package main

import (
	"database/sql"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

// Data represents columns in the database
type Data struct {
	Index        int    `json:"index"`
	Type         string `json:"type"`
	EPC          string `json:"epc"`
	ID           string `json:"id"`
	UserData     string `json:"userdata"`
	ReservedData string `json:"reserveddata"`
	TotalCount   int    `json:"totalcount"`
	ReadTime     string `json:"readtime"`
	InsertTime   string `json:"inserttime"`
	FlightNumber string `json:"flightnumber"`
}

func getData(db *sql.DB, flightNumber string) ([]Data, error) {
	rows, err := db.Query(`SELECT * FROM data WHERE flight_number = ?`, flightNumber)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var datas []Data
	for rows.Next() {
		var data Data
		err := rows.Scan(&data.Index, &data.Type, &data.EPC, &data.ID, &data.UserData,
			&data.ReservedData, &data.TotalCount, &data.ReadTime, &data.InsertTime, &data.FlightNumber)
		if err != nil {
			return nil, err
		}
		datas = append(datas, data)
	}
	return datas, nil
}

func dataHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Content-Type", "application/json")

		flightNumber := r.URL.Query().Get("flightNum")

		datas, err := getData(db, flightNumber)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(datas)
	}
}

func insertCSVData(db *sql.DB, csvPath string) error {
	csvFile, err := os.Open(csvPath)
	if err != nil {
		return err
	}
	defer csvFile.Close()

	csvReader := csv.NewReader(csvFile)
	csvValues, err := csvReader.ReadAll()
	if err != nil {
		return err
	}

	insertSQL := `INSERT INTO data ("Index", "Type", "EPC", "ID", "UserData", "ReservedData", "TotalCount", "ReadTime", "InsertTime") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
	stmt, err := db.Prepare(insertSQL)
	if err != nil {
		return err
	}
	defer stmt.Close()

	for _, value := range csvValues {
		if len(value) < 8 {
			log.Println("Skipping incomplete row:", value)
			continue
		}
		timeNow := time.Now().Format("15:04:05 02 January 2006")
		_, err = stmt.Exec(value[0], value[1], value[2], value[3], value[4], value[5], value[6], value[7], timeNow)
		if err != nil {
			log.Println("Failed to insert row:", err)
		}
	}
	return nil
}

func uploadHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")

		if r.Method != "POST" {
			http.Error(w, "Only POST method allowed", http.StatusMethodNotAllowed)
			return
		}

		flightNumber := r.FormValue("flightNum")
		if flightNumber == "" {
			http.Error(w, "flightNum not provided", http.StatusBadRequest)
			return
		}

		file, _, err := r.FormFile("file")
		if err != nil {
			http.Error(w, "Error reading file: "+err.Error(), http.StatusBadRequest)
			return
		}
		defer file.Close()

		csvReader := csv.NewReader(file)
		csvValues, err := csvReader.ReadAll()
		if err != nil {
			http.Error(w, "Failed to parse CSV: "+err.Error(), http.StatusBadRequest)
			return
		}

		// ⚠️ DELETE existing rows first
		_, err = db.Exec(`DELETE FROM data WHERE flight_number = ?`, flightNumber)
		if err != nil {
			http.Error(w, "Failed to clear old data: "+err.Error(), http.StatusInternalServerError)
			return
		}

		type DataRow struct {
			Index        string
			Type         string
			EPC          string
			ID           string
			UserData     string
			ReservedData string
			TotalCount   int
			ReadTime     string
		}

		aggregated := make(map[string]*DataRow)

		for _, row := range csvValues {
			if len(row) < 8 {
				log.Println("Skipping incomplete row:", row)
				continue
			}

			epc := row[2]

			// Clearly parse TotalCount from the CSV row itself
			count, err := strconv.Atoi(row[6])
			if err != nil {
				log.Printf("Invalid TotalCount '%s' in row, defaulting to 1: %v", row[6], err)
				count = 1
			}

			if existing, found := aggregated[epc]; found {
				existing.TotalCount += count // Clearly sum existing counts
			} else {
				aggregated[epc] = &DataRow{
					Index:        row[0],
					Type:         row[1],
					EPC:          epc,
					ID:           row[3],
					UserData:     row[4],
					ReservedData: row[5],
					TotalCount:   count, // Clearly use CSV provided count
					ReadTime:     row[7],
				}
			}
		}

		insertSQL := `INSERT INTO data ("Index", "Type", "EPC", "ID", "UserData", "ReservedData", "TotalCount", "ReadTime", "InsertTime", "flight_number") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
		stmt, err := db.Prepare(insertSQL)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer stmt.Close()

		for _, row := range aggregated {
			timeNow := time.Now().Format("15:04:05 02 January 2006")
			_, err = stmt.Exec(row.Index, row.Type, row.EPC, row.ID, row.UserData, row.ReservedData, row.TotalCount, row.ReadTime, timeNow, flightNumber)
			if err != nil {
				log.Println("Error inserting aggregated row:", err)
			}
		}

		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, "CSV uploaded and EPC quantities summed successfully for flight %s!", flightNumber)
	}
}

// clearly fetch flight numbers having at least one item with stock less than 5
func getLowStockFlights(db *sql.DB) ([]string, error) {
	rows, err := db.Query(`
		SELECT DISTINCT flight_number 
		FROM data 
		WHERE TotalCount < 5 AND flight_number IS NOT NULL AND flight_number != ''
	`)
	if err != nil {
		log.Println("SQL query error:", err)
		return nil, err
	}
	defer rows.Close()

	var flights []string
	for rows.Next() {
		var flightNumber sql.NullString
		if err := rows.Scan(&flightNumber); err != nil {
			log.Println("Row scan error:", err)
			return nil, err
		}
		if flightNumber.Valid {
			flights = append(flights, flightNumber.String)
		}
	}

	if err = rows.Err(); err != nil {
		log.Println("Rows error after scanning:", err)
		return nil, err
	}

	return flights, nil
}

// HTTP handler to clearly expose low-stock flights
func lowStockHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Content-Type", "application/json")

		flights, err := getLowStockFlights(db)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(flights)
	}
}

func main() {
	db, err := sql.Open("sqlite3", "database.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	err = insertCSVData(db, "RFIDscan.csv")
	if err != nil {
		log.Fatal("CSV Import Error:", err)
	}

	http.HandleFunc("/data", dataHandler(db))
	http.HandleFunc("/upload", uploadHandler(db))
	http.HandleFunc("/low-stock", lowStockHandler(db)) // ✅ Add clearly this line here!

	port := 8080
	fmt.Printf("Server is running on port %d\n", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))
}

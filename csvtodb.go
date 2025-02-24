package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
)

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
}

func getData() ([]Data, error) {
	db, err := sql.Open("sqlite3", "database.db")
	if err != nil {
		print("Luke smells")
		return nil, err
	}
	defer db.Close()

	rows, err := db.Query(`SELECT * from data`)
	if err != nil {
		print("Batman smells")
		return nil, err
	}
	defer rows.Close()

	var datas []Data
	for rows.Next() {
		var data Data
		err = rows.Scan(&data.Index, &data.Type, &data.EPC, &data.ID, &data.UserData, &data.ReservedData, &data.TotalCount,
			&data.ReadTime, &data.InsertTime)
		if err != nil {
			fmt.Printf("Robin laid an egg: %v\n", err)
			return nil, err
		}

		datas = append(datas, data)
	}
	return datas, nil
}

func dataHandler(w http.ResponseWriter, r *http.Request) {
	// Allow all origins (or specify a particular origin)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	datas, err := getData()
	if err != nil {
		http.Error(w, "TypeScript Smells", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(datas)
}

func main() {

	// the code assumes :
	// 1. that there is already a database created and that they contain the columns that are referred to in lines 27
	// 2. the csv has exactly 7 values

	// open database and csv, and read csv

	// csvFile, _ := os.Open("RFIDscan.csv")
	// defer csvFile.Close()
	// csvReader := csv.NewReader(csvFile)
	// csvValues, _ := csvReader.ReadAll()

	// injection sql
	// each quote marked word represents a column of the db that the csv values enter via

	// insertSQL := `INSERT INTO data ("Index", "Type", "EPC", "ID", "UserData", "ReservedData", "TotalCount", "ReadTime", "InsertTime") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
	// valuesSQL, _ := database.Prepare(insertSQL)
	// defer valuesSQL.Close()

	// iterate through csv and inject values into database
	// for _, value := range csvValues {
	// 	timeNow := time.Now().Format("15:04:05 02 January 2006")
	// 	valuesSQL.Exec(value[0], value[1], value[2], value[3], value[4], value[5], value[6], value[7], timeNow)
	// }
	http.HandleFunc("/data", dataHandler)
	port := 8080
	fmt.Printf("Server is running %d", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))

}

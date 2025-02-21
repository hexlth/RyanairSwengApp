package main

import (
	"database/sql"
	"encoding/csv"
	"os"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

func main() {

	// open database and csv, and read csv
	database, _ := sql.Open("sqlite3", "database.db")
	defer database.Close()
	csvFile, _ := os.Open("RFIDscan.csv")
	defer csvFile.Close()
	csvReader := csv.NewReader(csvFile)
	csvValues, _ := csvReader.ReadAll()

	// injection sql
	insertSQL := `INSERT INTO data ("Index", "Type", "EPC", "ID", "UserData", "ReservedData", "TotalCount", "ReadTime", "InsertTime") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
	valuesSQL, _ := database.Prepare(insertSQL)
	defer valuesSQL.Close()

	// Loop through CSV records and insert data
	for _, value := range csvValues {
		timeNow := time.Now().Format("15:04:05 02 January 2006")
		valuesSQL.Exec(value[0], value[1], value[2], value[3], value[4], value[5], value[6], value[7], timeNow)
	}
}

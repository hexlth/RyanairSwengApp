package main

import (
	"database/sql"
	"encoding/csv"
	"os"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

func main() {

	// the code assumes :
	// 1. that there is already a database created and that they contain the columns that are referred to in lines 27 
	// 2. the csv has exactly 7 values


	// open database and csv, and read csv
	database, _ := sql.Open("sqlite3", "database.db")
	defer database.Close()
	csvFile, _ := os.Open("RFIDscan.csv")
	defer csvFile.Close()
	csvReader := csv.NewReader(csvFile)
	csvValues, _ := csvReader.ReadAll()

	// injection sql
	// each quote marked word represents a column of the db that the csv values enter via

	insertSQL := `INSERT INTO data ("Index", "Type", "EPC", "ID", "UserData", "ReservedData", "TotalCount", "ReadTime", "InsertTime") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
	valuesSQL, _ := database.Prepare(insertSQL)
	defer valuesSQL.Close()

	// iterate through csv and inject values into database
	for _, value := range csvValues {
		timeNow := time.Now().Format("15:04:05 02 January 2006")
		valuesSQL.Exec(value[0], value[1], value[2], value[3], value[4], value[5], value[6], value[7], timeNow)
	}
}

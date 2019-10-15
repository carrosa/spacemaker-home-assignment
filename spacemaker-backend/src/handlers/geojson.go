package handlers

import (
	"log"
	"net/http"
	"spacemaker-backend/database"
	"strings"

	"github.com/gin-gonic/gin"
)

type geoJson struct {
	ID      int    `json:"id"`
	GeoJson string `json:"geojson"`
}

func getLastGeoJson() (geoJson, error) {
	const q = `SELECT * from geojson WHERE id=(SELECT max(id) FROM geojson);`
	row := database.QueryOne(q)
	var id int
	var geojson string
	err := row.Scan(&id, &geojson)
	if err != nil {
		var emptyGeoJson geoJson
		return emptyGeoJson, err
	}
	return geoJson{id, geojson}, nil
}
func getGeoJson() ([]geoJson, error) {
	const q = `SELECT * FROM geojson;`
	rows := database.Query(q)
	results := make([]geoJson, 0)
	for rows.Next() { // Loop through all DB rows
		var id int
		var geojson string
		err := rows.Scan(&id, &geojson)
		if err != nil {
			return nil, err
		}
		results = append(results, geoJson{id, geojson})
	}
	return results, nil
}

func GetGeoJson(ctx *gin.Context) {
	results, err := getGeoJson()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"status": "internal error: " + err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, results)
}

func deleteGeoJson(id string) error {
	q := `DELETE FROM geojson WHERE id=$1`
	_, err := database.DB.Exec(q, id)
	if err != nil {
		log.Fatal(err)
	}
	return err
}

func DeleteGeoJson(ctx *gin.Context) {
	id := ctx.Param("id")
	err := deleteGeoJson(id)
	if err != nil {
		log.Fatal(err)
		ctx.JSON(http.StatusForbidden, gin.H{"id": id})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"id": id})
}
func addGeoJson(geojson string) error {
	trimmed := strings.TrimPrefix(geojson, "\"")
	trimmed = strings.TrimSuffix(trimmed, "\"")

	const q = `INSERT INTO geojson (geojson) VALUES($1);`
	_, err := database.DB.Exec(q, geojson)
	if err != nil {
		log.Fatal(err)
	}
	return err
}

func AddGeoJson(ctx *gin.Context) {
	buf := make([]byte, 1024)
	num, _ := ctx.Request.Body.Read(buf)
	reqBody := string(buf[0:num])
	trimmed := strings.ReplaceAll(reqBody, "\\", "")

	checkCoordinateString := strings.Split(trimmed, "[")
	if len(checkCoordinateString) < 6 {
		ctx.JSON(http.StatusForbidden, "Too few coordinates")
	}

	err := addGeoJson(trimmed)
	if err != nil {
		log.Fatal(err)
	}
	latestGeoJson, err := getLastGeoJson()
	if err != nil {
		log.Fatal(latestGeoJson)
	}
	ctx.JSON(http.StatusOK, latestGeoJson)
}

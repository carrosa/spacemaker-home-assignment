package main

import (
	"fmt"
	"spacemaker-backend/database"
	"spacemaker-backend/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.Use(cors.Default())
	r.GET("/geojson", handlers.GetGeoJson)
	r.POST("/geojson", handlers.AddGeoJson)
	r.POST("/geojson/:id/", handlers.DeleteGeoJson)

	// api := r.Group("/api")
	// api.GET("/geojson", handlers.GetGeoJson)
	// api.POST("/geojson", handlers.AddGeoJson)
	database.Connect()

	if err := database.DB.Ping(); err != nil {
		panic(err)
	}
	defer database.DB.Close()

	fmt.Println("Successfully connected to DB!")

	if err := r.Run(":8080"); err != nil { // Run on port 8080
		panic(err)
	}

}

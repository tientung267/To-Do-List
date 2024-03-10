package main

import (
	"ToDoList/cmd/database"
	"ToDoList/cmd/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	database.Connect()
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
		AllowOrigins:     "http://localhost:3000/",
	}))
	routes.Setup(app)

	app.Listen(":4000")

}



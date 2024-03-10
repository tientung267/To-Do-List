package database

import (
	"ToDoList/cmd/models"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DBConnection *gorm.DB

func Connect() {
	connection, err := gorm.Open(mysql.Open("tientung:password@/mytodolistapp"), &gorm.Config{})

	if err != nil {
		log.Fatal(err.Error())
	}

	DBConnection = connection
	connection.AutoMigrate(&models.User{})
	connection.AutoMigrate(&models.UserCategory{})
}

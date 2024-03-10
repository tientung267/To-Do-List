package controllers

import (
	"ToDoList/cmd/database"
	"ToDoList/cmd/models"

	"github.com/dgrijalva/jwt-go/v4"
	"github.com/gofiber/fiber/v2"
)

// add new category
func AddCategory(c *fiber.Ctx) error {
	//Check if user is authorized for this request
	cookie := c.Cookies("jwt")
	_, err1 := jwt.ParseWithClaims(cookie, &jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(mySecretKey), nil
	})

	if err1 != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"response": "unauthorized",
		})
	}

	var data map[string]string

	//Parse data from FrontEnd
	err := c.BodyParser(&data)
	if err != nil {
		return err
	}

	addedCategory := models.UserCategory{
		Order:      data["order"],
		Id:         data["owner"] + "-" + data["name"],
		Owner:      data["owner"],
		SharedWith: data["coOwner"],
		Category:   data["name"],
		ToDo:       data["item"],
		Status:     data["status"],
	}
	database.DBConnection.Create(&addedCategory)

	return c.JSON(addedCategory)
}

// get User Infos
func User(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")
	token, err := jwt.ParseWithClaims(cookie, &jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(mySecretKey), nil
	})

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"response": "unauthorized",
		})
	}

	claims := token.Claims.(*jwt.MapClaims)

	var user models.User
	database.DBConnection.Where("id = ?", (*claims)["userID"]).First(&user)

	return c.JSON(user)
}

// get list of category belong to current user
func List(c *fiber.Ctx) error {
	//Check if user is authorized for this request
	cookie := c.Cookies("jwt")
	token, err := jwt.ParseWithClaims(cookie, &jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(mySecretKey), nil
	})

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"response": "unauthorized",
		})
	}

	claims := token.Claims.(*jwt.MapClaims)

	var user models.User
	database.DBConnection.Where("id = ?", (*claims)["userID"]).First(&user)

	var toDoList []models.UserCategory
	database.DBConnection.Where("owner = ?", user.Username).Find(&toDoList)
	if len(toDoList) == 0 {
		return c.JSON(fiber.Map{
			"response": "No list is found for this user",
		})
	}
	return c.JSON(toDoList)
}

// get list of category shared to current user (other user allow current user to see their list)
func SharedList(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")
	token, err := jwt.ParseWithClaims(cookie, &jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(mySecretKey), nil
	})

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"response": "unauthorized",
		})
	}

	claims := token.Claims.(*jwt.MapClaims)

	var user models.User
	database.DBConnection.Where("id = ?", (*claims)["userID"]).First(&user)

	var sharedToDoList []models.UserCategory
	database.DBConnection.Where("shared_with = ?", user.Username).Find(&sharedToDoList)
	if len(sharedToDoList) == 0 {
		return c.JSON(fiber.Map{
			"response": "No shared list is found for this user",
		})
	}
	return c.JSON(sharedToDoList)
}

func DeleteCategory(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")
	_, err1 := jwt.ParseWithClaims(cookie, &jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(mySecretKey), nil
	})

	if err1 != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"response": "unauthorized",
		})
	}

	var data map[string]string

	err := c.BodyParser(&data)
	if err != nil {
		return err
	}

	var toDoCategory models.UserCategory
	database.DBConnection.Where("id = ?", data["owner"]+"-"+data["name"]).First(&toDoCategory)
	if toDoCategory.Owner == "" {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"response": "Delete Failed! Item not found in data base",
		})
	}

	deleteResult := database.DBConnection.Delete(&toDoCategory)
	if deleteResult.Error != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"response": "Delete failed! Try Again",
		})
	}
	return c.JSON(fiber.Map{
		"response": "delete successfully",
	})
}

// ToDo Items in a existed category will be updated
func UpdateItemInCategory(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")
	_, err1 := jwt.ParseWithClaims(cookie, &jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(mySecretKey), nil
	})

	if err1 != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"response": "unauthorized",
		})
	}

	var data map[string]string

	err := c.BodyParser(&data)
	if err != nil {
		return err
	}

	var toDoCategory models.UserCategory
	database.DBConnection.Where("id = ?", data["owner"]+"-"+data["name"]).First(&toDoCategory)
	// If fetched category is exited, it will be update, otherwise create a new category
	if toDoCategory.Owner != "" {
		toDoCategory.ToDo = data["item"]
		database.DBConnection.Save(&toDoCategory)
		return c.JSON(toDoCategory)
	}

	newItemsInCategory := models.UserCategory{
		Order:      data["order"],
		Id:         data["owner"] + "-" + data["name"],
		Owner:      data["owner"],
		SharedWith: data["coOwner"],
		Category:   data["name"],
		ToDo:       data["item"],
		Status:     data["status"],
	}
	database.DBConnection.Create(&newItemsInCategory)

	return c.JSON(newItemsInCategory)
}

// Switch Positon of two Categories next to each other in the lists
func UpdateCategoryPosition(c *fiber.Ctx) error {
	//Check if user is authorized
	cookie := c.Cookies("jwt")
	_, err1 := jwt.ParseWithClaims(cookie, &jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(mySecretKey), nil
	})

	if err1 != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"response": "unauthorized",
		})
	}

	var data [2]map[string]string

	err := c.BodyParser(&data)
	if err != nil {
		return err
	}

	for _, category := range data {
		var existingCategory models.UserCategory
		database.DBConnection.Where("id = ?", category["id"]).First(&existingCategory)

		if existingCategory.Id == "" {
			c.Status(fiber.StatusInternalServerError)
			return c.JSON(fiber.Map{
				"response": "cannot find category in database",
			})
		}

		existingCategory.Order = category["order"]
		database.DBConnection.Save(&existingCategory)
	}
	return c.JSON(fiber.Map{
		"response": "move category successfully",
	})

}

// update coOwner key for category, so that another person can see shared category
func ShareCategory(c *fiber.Ctx) error {
	//Check authorization
	cookie := c.Cookies("jwt")
	_, err1 := jwt.ParseWithClaims(cookie, &jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(mySecretKey), nil
	})

	if err1 != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"response": "unauthorized",
		})
	}

	var category map[string]string

	err := c.BodyParser(&category)
	if err != nil {
		return err
	}

	var existingCategory models.UserCategory
	database.DBConnection.Where("id = ?", category["id"]).First(&existingCategory)

	if existingCategory.Id == "" {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"response": "cannot find category in database",
		})
	}
	existingCategory.SharedWith = category["coOwner"]
	database.DBConnection.Save(&existingCategory)

	return c.JSON(fiber.Map{
		"response": "share this category with " + existingCategory.SharedWith,
	})

}

package controllers

import (
	"ToDoList/cmd/database"
	"ToDoList/cmd/models"
	"bytes"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go/v4"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/scrypt"
)

const mySecretKey = "thisIsMySecretKey"

func Register(c *fiber.Ctx) error {
	var data map[string]string

	err := c.BodyParser(&data)
	if err != nil {
		return err
	}

	var userInDatabase models.User
	database.DBConnection.Where("username = ?", data["username"]).First(&userInDatabase)

	if userInDatabase.Id != 0 {
		c.Status(fiber.StatusConflict)
		return c.JSON(fiber.Map{
			"response": "this username already exists",
		})
	}
	password, _ := scrypt.Key([]byte(data["password"]), make([]byte, 3), 32768, 8, 1, 32)
	user := models.User{
		Username: data["username"],
		Password: password,
	}

	database.DBConnection.Create(&user)
	return c.JSON(user)
}

func Login(c *fiber.Ctx) error {
	var data map[string]string

	err := c.BodyParser(&data)
	if err != nil {
		return err
	}

	var user models.User
	database.DBConnection.Where("username = ?", data["username"]).First(&user)

	if user.Id == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"response": "this username doesn't exists",
		})
	}

	//encrypt a password of string into a byte array
	password, _ := scrypt.Key([]byte(data["password"]), make([]byte, 3), 32768, 8, 1, 32)

	if !bytes.Equal(user.Password, password) {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"response": "wrong password",
		})
	}

	//Create custom claims for jwt
	claims := jwt.MapClaims{
		"userID": strconv.Itoa(int(user.Id)),
		"exp":    time.Now().Add(time.Hour * 2).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(mySecretKey))

	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"response": "can not login, please try again!",
		})
	}

	//store JWT in cookie
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    tokenString,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"response": "succeed login",
	})
}

func DeleteUsers(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	token, err := jwt.ParseWithClaims(cookie, &jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(mySecretKey), nil
	})

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"response": "could not login",
		})
	}

	claims := token.Claims.(*jwt.MapClaims)

	var user models.User

	queryResult := database.DBConnection.Where("id = ?", (*claims)["userID"]).First(&user)
	if queryResult.Error != nil {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"response": "User doesn't exists",
		})
	}

	deleteResult := database.DBConnection.Delete(&user)
	if deleteResult.Error != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"response": "Delete failed! Try Again",
		})
	}
	return c.JSON(fiber.Map{
		"response": "Users deleted successfully",
	})
}

func Logout(c *fiber.Ctx) error {
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"response": "log out successfully",
	})
}

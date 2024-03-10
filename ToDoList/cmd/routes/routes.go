package routes

import (
	"ToDoList/cmd/controllers"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Post("/api/register", controllers.Register)
	app.Post("/api/login", controllers.Login)
	app.Get("/api/user", controllers.User)
	app.Post("/api/deleteUser", controllers.DeleteUsers)
	app.Post("/api/logout", controllers.Logout)
	app.Get("/api/getList", controllers.List)
	app.Get("/api/getSharedList", controllers.SharedList)
	app.Post("/api/addCategory", controllers.AddCategory)
	app.Post("/api/deleteCategory", controllers.DeleteCategory)
	app.Post("/api/updateItemInCategory", controllers.UpdateItemInCategory)
	app.Post("/api/updateCategoryPosition", controllers.UpdateCategoryPosition)
	app.Post("/api/shareCategory", controllers.ShareCategory)
}

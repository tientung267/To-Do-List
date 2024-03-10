package models

//schema of a user account in DB
type User struct {
	Id       uint   `json:"id"`
	Username string `json:"username" gorm:"unique"`
	Password []byte `json:"password"`
}

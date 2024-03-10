package models

//schema of a ToDo category
type UserCategory struct {
	Order      string `json:"order"`
	Id         string `json:"id"`
	Owner      string `json:"owner"`
	SharedWith string `json:"coOwner"`
	Category   string ` json:"name"`
	ToDo       string `json:"item"`
	Status     string `json:"status"`
}

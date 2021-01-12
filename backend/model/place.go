package model

type Place struct {
	ID        int64   `db:"id" json:"id"`
	Name      string  `db:"name" json:"name"`
	Latitude  float64 `db:"latitude" json:"latitude"`
	Longitude float64 `db:"longitude" json:"longitude"`
}

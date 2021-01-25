package model

type Place15 struct {
	ID              int64   `db:"id" json:"id"`
	InstitutionID   int64   `db:"institution_id" json:"institution_id"`
	InstitutionName string  `db:"institution_name" json:"institution_name"`
	Latitude        float64 `db:"latitude" json:"latitude"`
	Longitude       float64 `db:"longitude" json:"longitude"`
	Path            string  `db:"path" json:"path"`
}

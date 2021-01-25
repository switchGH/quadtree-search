package repository

import (
	"backend/model"

	"github.com/jmoiron/sqlx"
)

func SearchByLatLng(db *sqlx.DB, swLat float64, swLng float64, neLat float64, neLng float64) ([]model.Place, error) {
	a := make([]model.Place, 0)
	if err := db.Select(&a, `SELECT id, institution_id, institution_name, latitude, longitude, path FROM places WHERE ? < latitude AND latitude < ? AND ? < longitude
	AND longitude < ?`, swLat, neLat, swLng, neLng); err != nil {
		return nil, err
	}
	return a, nil
}

func SearchByPath(db *sqlx.DB, path string) ([]model.Place, error) {
	a := make([]model.Place, 0)
	if err := db.Select(&a, `SELECT id, institution_id, institution_name, latitude, longitude, path FROM places WHERE path LIKE ?`, path+"%"); err != nil {
		return nil, err
	}
	return a, nil
}

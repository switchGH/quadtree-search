package repository

import (
	"backend/model"

	"github.com/jmoiron/sqlx"
)

func AllPlace(db *sqlx.DB) ([]model.Place, error) {
	a := make([]model.Place, 0)
	if err := db.Select(&a, `SELECT * FROM testplaces`); err != nil {
		return nil, err
	}
	return a, nil
}

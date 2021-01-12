package repository

import (
	"backend/model"

	"github.com/jmoiron/sqlx"
)

func AllPoint(db *sqlx.DB) ([]model.Point, error) {
	a := make([]model.Point, 0)
	if err := db.Select(&a, `SELECT * FROM points`); err != nil {
		return nil, err
	}
	return a, nil
}

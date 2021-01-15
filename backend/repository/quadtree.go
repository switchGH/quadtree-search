package repository

import (
	"backend/model"

	"github.com/jmoiron/sqlx"
)

func SearchPath(db *sqlx.DB, path string) ([]model.Point, error) {
	a := make([]model.Point, 0)
	if err := db.Select(&a, `SELECT * FROM result WHERE path LIKE ?`, path+"%"); err != nil {
		return nil, err
	}
	return a, nil
}

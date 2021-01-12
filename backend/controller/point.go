package controller

import (
	"backend/repository"
	"net/http"

	"github.com/jmoiron/sqlx"
)

type Point struct {
	db *sqlx.DB
}

func NewPoint(db *sqlx.DB) *Point {
	return &Point{db: db}
}

func (p *Point) Index(_ http.ResponseWriter, _ *http.Request) (int, interface{}, error) {
	points, err := repository.AllPoint(p.db)
	if err != nil {
		return http.StatusInternalServerError, nil, err
	}
	return http.StatusOK, points, nil
}

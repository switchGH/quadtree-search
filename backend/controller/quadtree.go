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

func (p *Point) Index(_ http.ResponseWriter, r *http.Request) (int, interface{}, error) {
	path := r.URL.Query().Get("path")
	points, err := repository.SearchPath(p.db, path)
	if err != nil {
		return http.StatusInternalServerError, nil, err
	}
	return http.StatusOK, points, nil
}

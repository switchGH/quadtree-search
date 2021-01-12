package controller

import (
	"backend/repository"
	"net/http"

	"github.com/jmoiron/sqlx"
)

type Place struct {
	db *sqlx.DB
}

func NewPlace(db *sqlx.DB) *Place {
	return &Place{db: db}
}

func (p *Place) Index(_ http.ResponseWriter, _ *http.Request) (int, interface{}, error) {
	places, err := repository.AllPlace(p.db)
	if err != nil {
		return http.StatusInternalServerError, nil, err
	}
	return http.StatusOK, places, nil
}

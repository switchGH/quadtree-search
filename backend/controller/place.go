package controller

import (
	"backend/repository"
	"net/http"
	"strconv"

	"github.com/jmoiron/sqlx"
)

type Place struct {
	db *sqlx.DB
}

func NewPlace(db *sqlx.DB) *Place {
	return &Place{db: db}
}

// 経度緯度での地点探索
func (p *Place) GetPlacesByLatlng(_ http.ResponseWriter, r *http.Request) (int, interface{}, error) {
	// エラーハンドリングが必要
	swLat, _ := strconv.ParseFloat(r.URL.Query().Get("sw_lat"), 64)
	swLng, _ := strconv.ParseFloat(r.URL.Query().Get("sw_lng"), 64)
	neLat, _ := strconv.ParseFloat(r.URL.Query().Get("ne_lat"), 64)
	neLng, _ := strconv.ParseFloat(r.URL.Query().Get("ne_lng"), 64)

	places, err := repository.SearchByLatLng(p.db, swLat, swLng, neLat, neLng)
	if err != nil {
		return http.StatusInternalServerError, nil, err
	}
	return http.StatusOK, places, nil
}

// 領域値での地点探索
func (p *Place) GetPlacesByPath(_ http.ResponseWriter, r *http.Request) (int, interface{}, error) {
	path := r.URL.Query().Get("path")
	points, err := repository.SearchByPath(p.db, path)
	if err != nil {
		return http.StatusInternalServerError, nil, err
	}
	return http.StatusOK, points, nil
}

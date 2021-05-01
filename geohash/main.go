package main

import (
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
	geohash "github.com/mmcloughlin/geohash"
)

type repository struct {
	db *sql.DB
}

type Point struct {
	id  int64
	lat float64
	lng float64
}

func (r *repository) init() error {
	db, err := sql.Open("mysql", "root:password@tcp(0.0.0.0:3306)/test")
	if err != nil {
		panic(err.Error())
	}

	err = db.Ping()
	if err != nil {
		panic(err.Error())
	}

	r.db = db
	return nil
}

func (r *repository) finalize() error {
	return r.db.Close()
}

func (r *repository) getPointData(point *Point) ([]Point, error) {
	rows, err := r.db.Query("SELECT id, longitude, latitude FROM places")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	points := []Point{}
	for rows.Next() {
		var id int64
		var longitude, latitude float64
		if err := rows.Scan(&id, &longitude, &latitude); err != nil {
			return nil, err
		}
		dbpoint := Point{
			id:  id,
			lat: latitude,
			lng: longitude,
		}
		points = append(points, dbpoint)
	}
	return points, err
}

func (r *repository) addGeohash(point Point) error {

	hash := geohash.Encode(point.lat, point.lng)

	stmt, err := r.db.Prepare("UPDATE places SET geohash = ? WHERE id = ?")
	if err != nil {
		log.Fatal(err)
	}
	stmt.Exec(hash, point.id)
	return err
}

func main() {
	repo := &repository{}
	if err := repo.init(); err != nil {
		log.Fatal(err)
		return
	}
	defer repo.finalize()

	point := Point{}
	points, err := repo.getPointData(&point)
	if err != nil {
		log.Fatal(err)
		return
	}

	for _, v := range points {
		p := Point{
			id:  v.id,
			lat: v.lat,
			lng: v.lng,
		}
		if err := repo.addGeohash(p); err != nil {
			log.Fatal(err)
			return
		}
	}
}

package main

import (
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
	qtree "github.com/switchGH/quadtree-search/quadtree"
)

type repository struct {
	db    *sql.DB
	tree  *qtree.Tree
	depth int32
}

// DBを接続し、木と深さを定義する
func (r *repository) init(minPoint, maxPoint *qtree.Point, depth int32) error {
	db, err := sql.Open("mysql", "root:password@tcp(0.0.0.0:3306)/test")
	if err != nil {
		panic(err.Error())
	}

	err = db.Ping()
	if err != nil {
		panic(err.Error())
	}

	r.db = db
	r.tree = qtree.NewTree(minPoint, maxPoint)
	r.depth = depth
	return nil
}

// DB切断処理
func (r *repository) finalize() error {
	return r.db.Close()
}

// DBに地点情報(x座標, y座標, ４分木で求めた経路)を挿入する
func (r *repository) insert(point *qtree.Point) error {
	// 経路を求める
	_, path := r.tree.Path(point, 10)
	// 座標とともに経路もINSERTする
	_, err := r.db.Exec("INSERT INTO result (x, y, path) VALUES(?,?,?)", point.X, point.Y, path)
	return err
}

// 近傍検索をする
func (r *repository) search(point *qtree.Point, depth int32) ([]*qtree.Point, error) {
	_, path := r.tree.Path(point, depth)
	// 内包する深さdepthの領域の子孫に位置する点をSELECTする(sqlxで実装したい)
	rows, err := r.db.Query("SELECT x, y FROM result WHERE ? <= path AND path <= ?", path, path+"~")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// 1行づつ取得し、配列に入れていく
	points := []*qtree.Point{}
	for rows.Next() {
		var x, y float64
		err := rows.Scan(&x, &y)
		if err != nil {
			return nil, err
		}
		dbpoint := &qtree.Point{
			X: x,
			Y: y,
		}
		points = append(points, dbpoint)
	}
	// ループが正常に終了したか確認する(https://golang.shop/post/go-databasesql-07-error-handling-ja/)
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return points, nil
}

func (r *repository) getPointData(point *qtree.Point) ([]*qtree.Point, error) {
	rows, err := r.db.Query("SELECT x, y FROM points")
	if err != nil {
		return nil, err
	}

	points := []*qtree.Point{}
	for rows.Next() {
		if err := rows.Scan(&point.X, &point.Y); err != nil {
			return nil, err
		}
		dbpoint := &qtree.Point{
			X: point.X,
			Y: point.Y,
		}
		points = append(points, dbpoint)
	}
	return points, err
}

func main() {
	// 扱いたい領域の端2点
	minPoint := &qtree.Point{
		X: 135.0,
		Y: 34.0,
	}
	maxPoint := &qtree.Point{
		X: 136.0,
		Y: 35.0,
	}

	repo := &repository{}
	// 深さ10に設定する
	if err := repo.init(minPoint, maxPoint, 10); err != nil {
		log.Fatal(err)
		return
	}

	// DBから対象となるデータの経度・緯度を取得する
	point := qtree.Point{}
	points, err := repo.getPointData(&point)
	if err != nil {
		log.Fatal(err)
	}
	//fmt.Printf("%+v", points[0])
	defer repo.finalize()

	// 経路(path)を追加したデータをDBに挿入する
	for _, v := range points {
		p := &qtree.Point{
			X: v.X,
			Y: v.Y,
		}
		if err := repo.insert(p); err != nil {
			log.Fatal(err)
			return
		}
	}
	// 検索
}
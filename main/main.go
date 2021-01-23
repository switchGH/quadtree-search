package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
	qtree "github.com/switchGH/quadtree-module"
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
func (r *repository) addPath(point *qtree.Point) error {
	// 経路を求める
	_, path := r.tree.Path(point, 10)
	// pathカラムにデータを追加する
	stmt, err := r.db.Prepare("UPDATE data15 SET path = ? WHERE id = ?")
	if err != nil {
		log.Fatal(err)
	}
	stmt.Exec(path, point.ID)
	return err
}

// 近傍検索をする
func (r *repository) search(point *qtree.Point, depth int32) ([]*qtree.Point, error) {
	_, path := r.tree.Path(point, depth)
	//fmt.Printf("Path: %s\n", path)
	// 内包する深さdepthの領域の子孫に位置する点をSELECTする(sqlxで実装したい)
	rows, err := r.db.Query("SELECT id, longitude, latitude FROM data15 WHERE path LIKE ?", path+"%")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// 1行づつ取得し、配列に入れていく
	points := []*qtree.Point{}
	for rows.Next() {
		var id int64
		var longitude, latitude float64
		err := rows.Scan(&id, &longitude, &latitude)
		if err != nil {
			return nil, err
		}
		dbpoint := &qtree.Point{
			ID: id,
			X:  longitude,
			Y:  latitude,
		}
		//fmt.Printf("%+v\n", dbpoint)
		points = append(points, dbpoint)
	}
	// ループが正常に終了したか確認する(https://golang.shop/post/go-databasesql-07-error-handling-ja/)
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return points, nil
}

func (r *repository) getPointData(point *qtree.Point) ([]*qtree.Point, error) {
	rows, err := r.db.Query("SELECT id, longitude, latitude FROM data15")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	points := []*qtree.Point{}
	for rows.Next() {
		var id int64
		var longitude, latitude float64
		if err := rows.Scan(&id, &longitude, &latitude); err != nil {
			return nil, err
		}
		dbpoint := &qtree.Point{
			ID: id,
			X:  longitude,
			Y:  latitude,
		}
		points = append(points, dbpoint)
	}
	return points, err
}

func main() {
	// 扱いたい領域の端2点
	// minPoint := &qtree.Point{
	// 	X: 135.0,
	// 	Y: 34.0,
	// }
	// maxPoint := &qtree.Point{
	// 	X: 136.0,
	// 	Y: 35.0,
	// }
	// 大阪府の領域
	minPoint := &qtree.Point{
		X: 135.09194,
		Y: 34.27256,
	}
	maxPoint := &qtree.Point{
		X: 135.74641,
		Y: 35.05234,
	}

	repo := &repository{}
	// 深さ10に設定する
	if err := repo.init(minPoint, maxPoint, 10); err != nil {
		log.Fatal(err)
		return
	}
	defer repo.finalize()

	// DBから対象となるデータの経度・緯度を取得する
	point := qtree.Point{}
	points, err := repo.getPointData(&point)
	if err != nil {
		log.Fatal(err)
	}
	//fmt.Printf("%+v", points[0])

	// 経路(path)を追加したデータをDBに挿入する
	for _, v := range points {
		p := &qtree.Point{
			ID: v.ID,
			X:  v.X,
			Y:  v.Y,
		}
		if err := repo.addPath(p); err != nil {
			log.Fatal(err)
			return
		}
	}

	// 検索対象地点
	p := &qtree.Point{
		X: 135.45,
		Y: 34.6,
	}

	// 領域近傍検索
	fmt.Println("領域近傍検索")
	ps, err := repo.search(p, 3)
	if err != nil {
		log.Fatal(err)
		return
	}

	for _, p := range ps {
		fmt.Printf("matched: (%f, %f)\n", p.X, p.Y)
	}

	// pを内包する深さ5の領域と8近傍の子孫に含まれる点をSELECTする
	fmt.Println("検索地点を内包する深さ5の領域と8近傍の子孫に含まれる点をSELECTする")
	node, _ := repo.tree.Path(p, 5)
	for _, a := range node.Adjacent() {
		ps, err := repo.search(a.Mid(), node.Depth)
		if err != nil {
			log.Fatal(err)
			return
		}
		for _, p := range ps {
			fmt.Printf("matched: (%f,%f)\n", p.X, p.Y)
		}
	}
}

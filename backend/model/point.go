package model

type Point struct {
	ID   int64   `db:"id" json:"id"`
	X    float64 `db:"x" json:"x"`
	Y    float64 `db:"y" json:"y"`
	Path string  `db:"path" json:"path"`
}

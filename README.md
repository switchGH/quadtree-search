quadtree-search
===
４分木探索を行うプログラム

## DBセッティング
```
$ docker-compose up -d
$ make mysql/init // testデータベース作成
$ make flyway/migrate // DBマイグレーション
$ make flyway/validate
```
詳しくはMakefile参照

## Goモジュールインストール
```
go get -u github.com/go-sql-driver/mysql
```

## 実行
```
$ make run
go run ./main
領域近傍検索
matched: (135.470670, 34.575454)
matched: (135.470290, 34.575217)
matched: (135.470360, 34.575435)
検索地点を内包する深さ5の領域と8近傍の子孫に含まれる点をSELECTする
matched: (135.470670,34.575454)
matched: (135.470290,34.575217)
matched: (135.470360,34.575435)
```
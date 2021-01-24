quadtree-search
===

## Overview
4分木探索を調査するプログラム(制作中)

## Requirement
- macOS
- Docker 20.10.2
- Node.js (Next.js)
- Golang
- Flyway
- Mysql 8.0

## Usage
- コンテナ起動
```
$ make docker-compose/up
```

- DBセッティング
```
$ make mysql/init // testデータベース作成
$ make flyway/migrate // DBマイグレーション
$ make flyway/validate
```

- ４分木探索で領域値を算出
mainディレクトリで実行
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

その他はMakefileと各ディレクトリのREADMEを参照

## Feature
<ディレクトリ構成>
- ./main ４分木探索で領域値を求める(開発中)

以下、Dockerで管理している
- ./backend 地点情報を返すAPI
- ./frontend 地図を表示するページ
- ./database 地点情報(経度緯度など)を保存

<その他の機能>
Flywayでマイグレーション可能

## Reference
４分木探索用モージュール
https://github.com/switchGH/quadtree-module

## Author
switchGH

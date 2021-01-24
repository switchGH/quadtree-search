# quadtree-backend

## Overview
地点情報を返すAPI

## Feature
４分木を利用した検索と経度緯度を利用した検索の2種類を実装しています(2021/1/24)  
URL: localhost:1991

### Endpoint
|    |  メソッド  |   URI |  クエリ(例)  |
| ---- | ---- | ---- | ---- |
|  ４分木を使った検索  |  GET  | /quadtree  |  path=023321  |
|  経度緯度を使った検索  |  GET  |  /latlng  |  sw_lat=34.45&sw_lng=135.35&ne_lat=34.5&ne_lng=135.4  |


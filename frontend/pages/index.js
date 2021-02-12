import { useEffect, useState } from 'react';
import GoogleMap from '../components/GoogleMap';
import Marker from '../components/Maker';
import { getPlacesByLatlng, getPlacesByPath, getPlaces } from '../api/api';
import { calcPath } from '../util/path';
import { setTreeModel, searchNeighborhood } from '../util/tree'
import { MIN_SW, MAX_NE, DIVIVE_CENTER } from '../osakafu_latlng';

const Home = () => {
    const [center, setCenter] = useState({ lat: 34.4111, lng: 135.3008 });
    const [places, setPlaces] = useState([]);
    const [all_places, setAllPlaces] = useState([])

    useEffect(async () => {
        // すべてのデータを取得する
        const all_places_data = await getPlaces().catch(e => {
            console.log(e);
        });
        // all_places_data.filter(place => {
        //     place.show = false;
        // });
        setTreeModel(all_places_data) // 木構造にデータを割り当てる
        setAllPlaces(all_places_data)

        // はじめの範囲
        const framePoint = {
            ne_lat: 34.43036879139796, // 北東の緯度
            ne_lng: 135.3246736718893, // 北東の経度
            sw_lat: 34.39126015094337, // 南西の緯度
            sw_lng: 135.27726965086458 // 南西の経度
        }
        // // 経度緯度による領域内探索(API)
        // const target_places = await getPlacesByLatlng(framePoint).catch(e => {
        //   console.log(e)
        // })
        // 経度緯度による領域内探索
        //const target_places = WithinRangeSearch(all_places_data, framePoint)

        // 領域値による探索(API)
        const path = calcPath(3, center, MIN_SW, MAX_NE, DIVIVE_CENTER, '');
        console.log("現在のPATH:", path);
        // const res_json = await getPlacesByPath(path).catch(e => {
        //     console.log(e);
        // });
        // const tmp = searchNeighborhood(path)
        // 領域値による探索
        const target_places = searchNeighborhood(path)
        console.log('探索結果: ', target_places)
        // 表示POPが閉じている状態にする
        // res_json.filter(place => {
        //     place.show = false;
        // });
        setPlaces(target_places)
    }, []);
 
    // 地点クリック時のアクション
    const onClildClickCallback = key => {
        setPlaces(places => {
            const index = places.findIndex(e => e.id == key);
            console.log(places[index]);
            places[index].show = !places[index].show;
            return places;
        });
        console.log(places);
    };

    // ドラッグアンドドロップ後のアクション
    const onDragEnd = async map => {
        //console.log(searchNeighborhood('41'))
        //console.log(json)
        // 表示領域4点を取得する
        const latlngBounds = map.getBounds(); //表示領域の座標
        const swLatlng = latlngBounds.getSouthWest(); // 南西
        const neLatlng = latlngBounds.getNorthEast(); // 北東
        const framePoint = {
            sw_lat: swLatlng.lat(),
            sw_lng: swLatlng.lng(),
            ne_lat: neLatlng.lat(),
            ne_lng: neLatlng.lng(),
        };
        const center = {
            lat: map.center.lat(),
            lng: map.center.lng(),
        };
        console.log("framPoint: ", framePoint)
        // // 経度緯度による領域内探索(API)
        // const target_places = await getPlacesByLatlng(framePoint).catch(e => {
        //   console.log(e)
        // })
        // 経度緯度による領域内探索
        //const target_places = WithinRangeSearch(all_places, framePoint)

        // 領域値による探索(API)
        console.log('現在の中心点: ', center)
        const path = calcPath(3, center, MIN_SW, MAX_NE, DIVIVE_CENTER, '');
        console.log("現在のPATH: ", path)
        // const target_places = await getPlacesByPath(path).catch(e => {
        //     console.log(e);
        // });
        // 領域値による探索
        const target_places = searchNeighborhood(path)

        // res_json.filter(place => {
        //     place.show = false;
        // });
        console.log('探索結果: ', target_places)
        setPlaces(target_places);
    };

    return (
        <div style={{ height: '70vh', width: '70vh' }}>
            <GoogleMap
                defaultZoom={14}
                center={center}
                onChildClick={onClildClickCallback}
                onDragEnd={onDragEnd}
            >
                {places.map(place => (
                    <Marker
                        key={place.id}
                        lat={place.latitude}
                        lng={place.longitude}
                        // show={place.show}
                        place={place}
                    />
                ))}
            </GoogleMap>
        </div>
    );
};

// 範囲内探索
const WithinRangeSearch = (places, framePoint) => {
    console.log("places", places)
    let result = []

    for (let i = 0; i < places.length; i++) {
        if (places[i].latitude <= framePoint.ne_lat && framePoint.sw_lat <= places[i].latitude
            && places[i].longitude <= framePoint.ne_lng && framePoint.sw_lng <= places[i].longitude) {
            result.push(places[i])
        }
    }
    console.log("result: ", result)
    return result
}

export default Home;

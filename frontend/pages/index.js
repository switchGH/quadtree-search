import { useEffect, useState } from 'react';
import GoogleMap from '../components/GoogleMap';
import Marker from '../components/Maker';
import { getPlaces } from '../api/api';

const Home = () => {
    const [center, setCenter] = useState({ lat: 34.4111, lng: 135.3008 });
    const [places, setPlaces] = useState([]);
    const [all_places, setAllPlaces] = useState([]);

    useEffect(async () => {
        // すべてのデータを取得する
        const all_places_data = await getPlaces().catch(e => {
            console.log(e);
        });
        all_places_data.filter(place => {
            place.show = false;
        });
        setAllPlaces(all_places_data);

        // はじめの範囲
        const framePoint = {
            ne_lat: 34.43036879139796, // 北東の緯度
            ne_lng: 135.3246736718893, // 北東の経度
            sw_lat: 34.39126015094337, // 南西の緯度
            sw_lng: 135.27726965086458, // 南西の経度
        };
        // 領域値を算出
        const startTime = performance.now();
        // --------------------計測開始--------------------
        // 経度緯度による領域内探索
        const target_places = WithinRangeSearch(all_places_data, framePoint);
        // --------------------計測終了--------------------
        const endTime = performance.now();
        console.log('初回ページ表示時');
        console.log('データ量: ', target_places.length);
        console.log('計測結果(ミリ秒)', endTime - startTime); // 何ミリ秒かかったかを表示する
        // 表示POPが閉じている状態にする
        target_places.filter(place => {
            place.show = false;
        });
        setPlaces(target_places);
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

        const startTime = performance.now();
        // --------------------計測開始--------------------
        // 経度緯度による領域内探索
        const target_places = WithinRangeSearch(all_places, framePoint);
        // --------------------計測終了--------------------
        const endTime = performance.now();
        // res_json.filter(place => {
        //     place.show = false;
        // });
        console.log('データ量: ', target_places.length);
        console.log('計測結果(マイクロ秒)', endTime - startTime);
        setPlaces(target_places);
    };

    return (
        <div style={{ height: '70vh', width: '70vh', marginTop: '30px', marginLeft: '30px' }}>
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
                        show={place.show}
                        place={place}
                    />
                ))}
            </GoogleMap>
        </div>
    );
};

// 範囲内探索
const WithinRangeSearch = (places, framePoint) => {
    let result = [];

    for (let i = 0; i < places.length; i++) {
        if (
            places[i].latitude <= framePoint.ne_lat &&
            framePoint.sw_lat <= places[i].latitude &&
            places[i].longitude <= framePoint.ne_lng &&
            framePoint.sw_lng <= places[i].longitude
        ) {
            result.push(places[i]);
        }
    }
    return result;
};

export default Home;

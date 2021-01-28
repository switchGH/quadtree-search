import { useEffect, useState } from 'react';
import GoogleMap from '../components/GoogleMap';
import Marker from '../components/Maker';
import { getPlacesByLatlng, getPlacesByPath } from '../api/api';
import { calcPath } from '../util/path';
import { MIN_SW, MAX_NE, DIVIVE_CENTER } from '../osakafu_latlng';

const Home = () => {
    const [center, setCenter] = useState({ lat: 34.4111, lng: 135.3008 });
    const [places, setPlaces] = useState([]);

    useEffect(async () => {
        // はじめの範囲
        // const framaPoint = {
        //   sw_lat: 34.4064388134989, // 南西の緯度
        //   sw_lng: 135.295107346642, // 南西の経度
        //   ne_lat: 34.41583173345069, // 北東の緯度
        //   ne_lng: 135.30649265335796 // 北東の経度
        // }
        // 経度緯度による探索
        // const res_json = await getPlacesByLatlng(framaPoint).catch(e => {
        //   console.log(e)
        // })

        // 領域値による探索
        const path = calcPath(3, center, MIN_SW, MAX_NE, DIVIVE_CENTER, '');
        console.log(path);
        const res_json = await getPlacesByPath(path).catch(e => {
            console.log(e);
        });
        // 表示POPが閉じている状態にする
        res_json.filter(place => {
            place.show = false;
        });
        setPlaces(res_json);
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
        // const latlngBounds = map.getBounds(); //表示領域の座標
        // const swLatlng = latlngBounds.getSouthWest(); // 南西
        // const neLatlng = latlngBounds.getNorthEast(); // 北東
        // const params = {
        //     sw_lat: swLatlng.lat(),
        //     sw_lng: swLatlng.lng(),
        //     ne_lat: neLatlng.lat(),
        //     ne_lng: neLatlng.lng()
        // }
        // 経度緯度による探索
        // const res_json = await getPlacesByLatlng(params).catch(e => {
        //   console.log(e)
        // })

        // 領域値による探索
        const center = {
            lat: map.center.lat(),
            lng: map.center.lng(),
        };
        const path = calcPath(3, center, MIN_SW, MAX_NE, DIVIVE_CENTER, '');
        console.log(center);
        console.log(path);
        const res_json = await getPlacesByPath(path).catch(e => {
            console.log(e);
        });

        res_json.filter(place => {
            place.show = false;
        });
        console.log(res_json);
        setPlaces(res_json);
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
                        show={place.show}
                        place={place}
                    />
                ))}
            </GoogleMap>
        </div>
    );
};

export default Home;

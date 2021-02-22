import { useEffect, useState } from 'react';
import GoogleMap from '../components/GoogleMap';
import Marker from '../components/Maker';
import { getPlaces } from '../api/api';
import { calcPath } from '../util/path';
import { setTreeModel, searchNeighborhood } from '../util/tree';
import { MIN_SW, MAX_NE, DIVIVE_CENTER } from '../osakafu_latlng';

const Home = () => {
    const [center, setCenter] = useState({ lat: 34.4111, lng: 135.3008 });
    const [places, setPlaces] = useState([]);

    useEffect(async () => {
        // すべてのデータを取得する
        const all_places_data = await getPlaces().catch(e => {
            console.log(e);
        });
        all_places_data.filter(place => {
            place.show = false;
        });
        setTreeModel(all_places_data); // 木構造にデータを割り当てる

        // 領域値を算出
        const path = calcPath(3, center, MIN_SW, MAX_NE, DIVIVE_CENTER, '');
        const startTime = performance.now();
        // --------------------計測開始--------------------
        //領域値による探索
        const target_places = searchNeighborhood(path);
        // --------------------計測終了--------------------
        const endTime = performance.now();
        console.log('初回ページ表示時');
        console.log('現在のPATH:', path, 'データ量:', target_places.length);
        console.log('計測結果(ミリ秒)', endTime - startTime);
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
        const center = {
            lat: map.center.lat(),
            lng: map.center.lng(),
        };
        const path = calcPath(3, center, MIN_SW, MAX_NE, DIVIVE_CENTER, '');

        const startTime = performance.now();
        // --------------------計測開始--------------------
        // 領域値による探索
        const target_places = searchNeighborhood(path);
        // --------------------計測終了--------------------
        const endTime = performance.now();
        // res_json.filter(place => {
        //     place.show = false;
        // });
        console.log('現在のPATH: ', path, 'データ量: ', target_places.length);
        console.log('計測結果(マイクロ秒)', endTime - startTime); // 何ミリ秒かかったかを表示する
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

export default Home;

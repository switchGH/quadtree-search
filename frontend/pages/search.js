import { useEffect, useState } from 'react';
import { setTreeModel, searchNeighborhood } from '../util/tree';
import { calcPath } from '../util/path';
import { getPlaces } from '../api/api';
import { MIN_SW, MAX_NE, DIVIVE_CENTER } from '../osakafu_latlng';

const Search = () => {
    const [lat, setLat] = useState('34.69'); // 緯度
    const [lng, setLng] = useState('135.61'); // 経度
    const [res_json, setResJSON] = useState([]); // 全地点データ
    const [places, setPlaces] = useState([]);

    useEffect(async () => {
        const json = await getPlaces().catch(e => {
            console.log(e);
        });
        setResJSON(json);
        //setPlacesJSON() // すべての地点データを取得する
        setTreeModel(json); // 木構造にデータを割り当てる
    }, []);

    const handleLatChange = event => {
        setLat(event.target.value);
    };

    const handleLngChange = event => {
        setLng(event.target.value);
    };

    const handleSubmit = event => {
        //const path = calcPath(3, { lat: parseFloat(lat), lng: parseFloat(lng) }, MIN_SW, MAX_NE, DIVIVE_CENTER, '')　// 領域値算出

        // --------------------計測開始--------------------
        const startTime = performance.now();
        // 領域値で検索
        //const target_places = searchNeighborhood(path);

        // 距離で検索
        const target_places = calcDistance(res_json, parseFloat(lat), parseFloat(lng));

        // --------------------計測終了--------------------
        const endTime = performance.now();
        setPlaces(target_places);

        console.log('検索経度緯度: ', lng, lat, 'データ量: ', target_places.length);
        //console.log('検索領域: ', path)
        console.log('計測結果(マイクロ秒)', endTime - startTime);
        event.preventDefault();
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    経度(longitude):
                    <input value={lng} type="text" onChange={handleLngChange} />
                </label>
                <label>
                    緯度(latitude):
                    <input value={lat} type="text" onChange={handleLatChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
            <div>
                <ul>
                    {places.map(place => (
                        <li key={place.increment_id}>
                            施設名: {place.institution_name} & {place.longitude} & {place.latitude}{' '}
                            & {place.distance} & {place.path}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

// 2点間の距離を求める
const calcDistance = (places, lat, lng) => {
    const lat1 = (lat * Math.PI) / 180;
    const lng1 = (lng * Math.PI) / 180;
    // --------------------計測1開始--------------------
    const startTime1 = performance.now();
    // 距離を算出し、データに付加する
    for (let i = 0; i < places.length; i++) {
        let lat2 = (places[i].latitude * Math.PI) / 180;
        let lng2 = (places[i].longitude * Math.PI) / 180;
        let distance =
            6371 *
            Math.acos(
                Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) +
                    Math.sin(lat1) * Math.sin(lat2)
            );
        places[i].distance = distance;
    }
    // --------------------計測1終了--------------------
    const endTime1 = performance.now();

    // 5km以内の以内のデータのみに絞る
    // --------------------計測2開始--------------------
    const startTime2 = performance.now();
    const near_places = places.filter(place => place.distance <= 5);
    // --------------------計測2終了--------------------
    const endTime2 = performance.now();
    console.log(
        'for文の計測結果(ミリ秒)',
        endTime1 - startTime1,
        'filter計測結果(マイクロ秒)',
        endTime2 - startTime2
    );

    // 昇順にソートする
    // near_places.sort((a, b) => {
    //     if( a.distance < b.distance ) return -1;
    //     if( a.distance > b.distance ) return 1;
    //     return 0;
    // })

    return near_places;
};

export default Search;

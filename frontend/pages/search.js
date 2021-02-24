import { useEffect, useState } from 'react';
import GoogleMap from '../components/GoogleMap';
import Marker from '../components/Maker';
import { setTreeModel, searchNeighborhood } from '../util/tree';
import { calcPath } from '../util/path';
import { getPlaces } from '../api/api';
import { MIN_SW, MAX_NE, DIVIVE_CENTER } from '../osakafu_latlng';

const Search = () => {
    const [center, setCenter] = useState({ lat: 34.4111, lng: 135.3008 })
    const [lat, setLat] = useState('34.69'); // 緯度
    const [lng, setLng] = useState('135.61'); // 経度
    const [places, setPlaces] = useState([]);

    useEffect(async () => {
        const json = await getPlaces().catch(e => {
            console.log(e);
        });
        setTreeModel(json); // 木構造にデータを割り当てる
    }, []);

    const handleLatChange = event => {
        setLat(event.target.value);
    };

    const handleLngChange = event => {
        setLng(event.target.value);
    };

    const handleSubmit = event => {
        setCenter({ lat: parseFloat(lat), lng: parseFloat(lng) })

        // 中心座標とその８近傍の経度緯度を配列に格納する
        // let latlng = []
        // latlng.push({ lat: parseFloat(lat), lng: parseFloat(lng)})
        // latlng.push({ lat: parseFloat(lat) + parseFloat(0.04), lng: parseFloat(lng) })
        // latlng.push({ lat: parseFloat(lat) - parseFloat(0.04), lng: parseFloat(lng) })
        // latlng.push({ lat: parseFloat(lat), lng: parseFloat(lng) + parseFloat(0.04) })
        // latlng.push({ lat: parseFloat(lat), lng: parseFloat(lng) - parseFloat(0.04) })

        // latlng.push({ lat: parseFloat(lat) + parseFloat(0.04), lng: parseFloat(lng) + parseFloat(0.04) })
        // latlng.push({ lat: parseFloat(lat) - parseFloat(0.04), lng: parseFloat(lng) - parseFloat(0.04) })
        // latlng.push({ lat: parseFloat(lat) + parseFloat(0.04), lng: parseFloat(lng) - parseFloat(0.04) })
        // latlng.push({ lat: parseFloat(lat) - parseFloat(0.04), lng: parseFloat(lng) + parseFloat(0.04) })

        // console.log(latlng)
        // 領域値算出
        const path = calcPath(
            3,
            { lat: parseFloat(lat), lng: parseFloat(lng) },
            MIN_SW,
            MAX_NE,
            DIVIVE_CENTER,
            ''
        );

        // let path = []
        // for (let i = 0; i < 9; i++) {
        //     path.push(calcPath(
        //         4,
        //        latlng[i],
        //         MIN_SW,
        //         MAX_NE,
        //         DIVIVE_CENTER,
        //         ''
        //     ))
        // }
        // 領域地の重複削除する
        // path = Array.from(new Set(path))
        // console.log(path)

        //let target_places = []
        // --------------------計測開始--------------------
        const startTime = performance.now();
        // 領域値で検索
        const target_places = searchNeighborhood(path);

        // for (let i = 0; i < path.length; i++) {
        //     target_places = target_places.concat(searchNeighborhood(path[i]))
        // }

        // --------------------計測終了--------------------
        const endTime = performance.now();
        setPlaces(target_places);

        for (let i = 0; i < target_places.length; i++) {
            console.log(target_places[i].increment_id)
        }
        console.log(
            '検索経度緯度: ',
            lng,
            lat,
            '検索領域: ',
            path,
            'データ量: ',
            target_places.length
        );
        console.log('計測結果(マイクロ秒)', endTime - startTime);
        event.preventDefault();
    };

    return (
        <div>
            <div style={{ height: '70vh', width: '70vh', marginTop: '30px', marginLeft: '30px' }}>
            <GoogleMap
                defaultZoom={13}
                center={center}
                // onChildClick={onClildClickCallback}
                // onDragEnd={onDragEnd}
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
                            {' '}
                            施設名: {place.institution_name} & 経度: {place.longitude} & 緯度:{' '}
                            {place.latitude} & 領域値: {place.path}
                        </li>
                    ))}
                </ul>
            </div>
            </div>
        </div>
    );
};

export default Search;

import { useEffect, useState } from 'react';
import { setTreeModel, searchNeighborhood } from '../util/tree';
import { calcPath } from '../util/path';
import { getPlaces } from '../api/api';
import { MIN_SW, MAX_NE, DIVIVE_CENTER } from '../osakafu_latlng';

const Search = () => {
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
        const path = calcPath(3, { lat: parseFloat(lat), lng: parseFloat(lng) }, MIN_SW, MAX_NE, DIVIVE_CENTER, ''); // 領域値算出
        // --------------------計測開始--------------------
        const startTime = performance.now();
        // 領域値で検索
        const target_places = searchNeighborhood(path);
        // --------------------計測終了--------------------
        const endTime = performance.now();
        setPlaces(target_places);

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
    );
};

export default Search;

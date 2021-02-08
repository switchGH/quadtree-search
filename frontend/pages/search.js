import { useEffect, useState } from 'react';
import { setPlacesJSON, setTreeModel, searchNeighborhood } from '../util/tree'
import { calcPath } from '../util/path'
import { getPlaces } from '../api/api'
import { MIN_SW, MAX_NE, DIVIVE_CENTER } from '../osakafu_latlng';

const Search = () => {
    const [lat, setLat] = useState(34.69) // 緯度
    const [lng, setLng] = useState(135.61) // 経度
    const [res_json, setResJSON] = useState([]) // 全地点データ
    const [places, setPlaces] = useState([{ institution_name: 'Hi', latitude: 34.69, longitude: 135.61}])
    useEffect(async () => {
        const json = await getPlaces().catch(e => {
            console.log(e);
        });
        setResJSON(json)
        //console.log(res_json)
        //setPlacesJSON() // すべての地点データを取得する
        setTreeModel(json) // 木構造にデータを割り当てる
    }, [])

    const handleLatChange = (event) => {
        setLat(parseFloat(event.target.value))
    }

    const handleLngChange = (event) => {
        setLng(parseFloat(event.target.value))
    }

    const handleSubmit = (event) => {
        console.log(lat, lng)
        // 領域で検索
        const path = calcPath(3, { lat, lng }, MIN_SW, MAX_NE, DIVIVE_CENTER, '')
        console.log('検索領域: ', path)
        // setPlaces(searchNeighborhood(path))

        // 距離で検索
        setPlaces(calcDistance(res_json, lat, lng))

        event.preventDefault();
    }


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    経度(longitude): 
                    <input value={lng} type="number" onChange={handleLngChange} /> 
                </label>
                <label>
                    緯度(latitude): 
                     <input value={lat} type="number" onChange={handleLatChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
            <div>
                <ul>
                    {places.map(place => (
                        <li key={place}>{place.institution_name} & {place.longitude} & {place.latitude} & {place.distance} & {place.path}</li>
                    ))}
                </ul>
            </div>
        </div>   
    )
}

// 距離を求める
const calcDistance = (places, lat, lng) => {
    //let result = []
    let lat1 = lat * Math.PI / 180
    let lng1 = lng * Math.PI / 180
    for (let i = 0; i < places.length; i++) {
        let lat2 = places[i].latitude * Math.PI / 180
        let lng2 = places[i].longitude * Math.PI / 180
        let distance = 6371 * Math.acos(Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) + Math.sin(lat1) * Math.sin(lat2));
        places[i].distance = distance
    }
    // console.log('ソート前')
    // console.log(places)
    // 昇順にソートする
    places.sort((a, b) => {
        if( a.distance < b.distance ) return -1;
        if( a.distance > b.distance ) return 1;
        return 0;
    })
    // console.log('ソート後')
    // console.log(places)
    return places
}
  
export default Search
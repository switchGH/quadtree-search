const MIN_SW_LAT = 34.27256 // 南西緯度
const MIN_SW_LNG = 135.09194 // 南西経度
const MAX_NE_LAT = 35.05234 // 北東緯度
const MAX_NE_LNG = 135.74641 // 北東経度


const one_divive_center = {
    lat: 34.66245,
    lng: 135.419175
}

export const getPath = (center) => {
    const { lat, lng } = center
    let path = 0
    // 中心座標から領域値を決定する(例外処理必要)
    if (lat >= MIN_SW_LAT && lat <= one_divive_center.lat
        && lng >= MIN_SW_LNG && lng <= one_divive_center.lng) {
        // 領域0の場合
        path = 0
    } else if (lat >= MIN_SW_LAT && lat <= one_divive_center.lat
                && lng >= one_divive_center.lng && lng <= MAX_NE_LNG) {
        // 領域1の場合
        path = 1
    } else if (lat >= one_divive_center.lat && lat <= MAX_NE_LAT
                && lng >= MIN_SW_LNG && lng <= one_divive_center.lng) {
        // 領域2の場合
        path = 2
    } else if (lat >= one_divive_center.lat && lat <= MAX_NE_LAT
                && lng >= one_divive_center.lng && lng <= MAX_NE_LNG) {
        // 領域3の場合
        path = 3
    }
    return path
}
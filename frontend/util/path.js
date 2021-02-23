export const calcPath = (depth, center, min_sw, max_ne, divive_center, path) => {
    const { lat, lng } = center;
    // 深さに応じて処理
    if (path.length == depth) {
        return path;
    }
    // 経度緯度で領域値を判断する
    if (
        lat >= min_sw.lat &&
        lat <= divive_center.lat &&
        lng >= min_sw.lng &&
        lng <= divive_center.lng
    ) {
        // 領域1の場合
        path += '1';
        const new_center = {
            lat: (min_sw.lat + divive_center.lat) / 2,
            lng: (min_sw.lng + divive_center.lng) / 2,
        };
        return calcPath(depth, center, min_sw, divive_center, new_center, path);
    } else if (
        lat >= min_sw.lat &&
        lat <= divive_center.lat &&
        lng >= divive_center.lng &&
        lng <= max_ne.lng
    ) {
        // 領域2の場合
        path += '2';
        const new_sw_min = {
            lat: min_sw.lat,
            lng: divive_center.lng,
        };
        const new_ne_max = {
            lat: divive_center.lat,
            lng: max_ne.lng,
        };
        const new_center = {
            lat: (new_sw_min.lat + new_ne_max.lat) / 2,
            lng: (new_sw_min.lng + new_ne_max.lng) / 2,
        };
        return calcPath(depth, center, new_sw_min, new_ne_max, new_center, path);
    } else if (
        lat >= divive_center.lat &&
        lat <= max_ne.lat &&
        lng >= min_sw.lng &&
        lng <= divive_center.lng
    ) {
        // 領域3の場合
        path += '3';
        const new_sw_min = {
            lat: divive_center.lat,
            lng: min_sw.lng,
        };
        const new_ne_max = {
            lat: max_ne.lat,
            lng: divive_center.lng,
        };
        const new_center = {
            lat: (new_sw_min.lat + new_ne_max.lat) / 2,
            lng: (new_sw_min.lng + new_ne_max.lng) / 2,
        };
        return calcPath(depth, center, new_sw_min, new_ne_max, new_center, path);
    } else if (
        lat >= divive_center.lat &&
        lat <= max_ne.lat &&
        lng >= divive_center.lng &&
        lng <= max_ne.lng
    ) {
        // 領域4の場合
        path += '4';
        const new_sw_min = divive_center;
        const new_center = {
            lat: (divive_center.lat + max_ne.lat) / 2,
            lng: (divive_center.lng + max_ne.lng) / 2,
        };
        return calcPath(depth, center, new_sw_min, max_ne, new_center, path);
    }
};

// export const selectPathArra = initial => {
//     switch (initial) {
//         case '1':
//             return { start: 0, end: 74 };

//         case '2':
//             return { start: 75, end: 448 };

//         case '3':
//             return { start: 449, end: 451 };

//         case '4':
//             return { start: 452, end: 1038 };

//         default:
//             console.log('Error switch');
//             return {};
//     }
// };

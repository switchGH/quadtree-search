import { calcPath } from './path';

const min_sw = {
    lat: 34.27256, // 南西緯度
    lng: 135.09194, // 南西経度
};
const max_ne = {
    lat: 35.05234, // 北東緯度
    lng: 135.74641, // 北東経度
};

// ４分割時の中心点
const divive_center = {
    lat: 34.66245,
    lng: 135.419175,
};

// 深さ1の時の各領域値テスト
test('深さ1に設定、領域値は0になるはず', () => {
    expect(calcPath(1, { lat: 34.6, lng: 135.2 }, min_sw, max_ne, divive_center, '')).toBe('0');
});

test('深さ1に設定、領域値は1になるはず', () => {
    expect(calcPath(1, { lat: 34.6, lng: 135.5 }, min_sw, max_ne, divive_center, '')).toBe('1');
});

test('深さ1に設定、領域値は2になるはず', () => {
    expect(calcPath(1, { lat: 34.8, lng: 135.3 }, min_sw, max_ne, divive_center, '')).toBe('2');
});

test('深さ1に設定、領域値は3になるはず', () => {
    expect(calcPath(1, { lat: 35.0, lng: 135.7 }, min_sw, max_ne, divive_center, '')).toBe('3');
});

// 深さ２の時の各領域値のテスト
test('深さ2に設定、領域値は0*になるはず', () => {
    expect(calcPath(2, { lat: 34.44, lng: 135.2 }, min_sw, max_ne, divive_center, '')).toBe('00');
    expect(calcPath(2, { lat: 34.45, lng: 135.4 }, min_sw, max_ne, divive_center, '')).toBe('01');
    expect(calcPath(2, { lat: 34.5, lng: 135.24 }, min_sw, max_ne, divive_center, '')).toBe('02');
    expect(calcPath(2, { lat: 34.6, lng: 135.39 }, min_sw, max_ne, divive_center, '')).toBe('03');
});

test('深さ2に設定、領域値は1*になるはず', () => {
    expect(calcPath(2, { lat: 34.45, lng: 135.42 }, min_sw, max_ne, divive_center, '')).toBe('10');
    expect(calcPath(2, { lat: 34.43, lng: 135.6 }, min_sw, max_ne, divive_center, '')).toBe('11');
    expect(calcPath(2, { lat: 34.6, lng: 135.43 }, min_sw, max_ne, divive_center, '')).toBe('12');
    expect(calcPath(2, { lat: 34.59, lng: 135.7 }, min_sw, max_ne, divive_center, '')).toBe('13');
});

test('深さ2に設定、領域値は2*になるはず', () => {
    expect(calcPath(2, { lat: 34.7, lng: 135.1 }, min_sw, max_ne, divive_center, '')).toBe('20');
    expect(calcPath(2, { lat: 34.8, lng: 135.3 }, min_sw, max_ne, divive_center, '')).toBe('21');
    expect(calcPath(2, { lat: 34.99, lng: 135.14 }, min_sw, max_ne, divive_center, '')).toBe('22');
    expect(calcPath(2, { lat: 34.89, lng: 135.3 }, min_sw, max_ne, divive_center, '')).toBe('23');
});

test('深さ2に設定、領域値は3*になるはず', () => {
    expect(calcPath(2, { lat: 34.84, lng: 135.44 }, min_sw, max_ne, divive_center, '')).toBe('30');
    expect(calcPath(2, { lat: 34.8, lng: 135.74 }, min_sw, max_ne, divive_center, '')).toBe('31');
    expect(calcPath(2, { lat: 34.86, lng: 135.42 }, min_sw, max_ne, divive_center, '')).toBe('32');
    expect(calcPath(2, { lat: 35.0, lng: 135.73 }, min_sw, max_ne, divive_center, '')).toBe('33');
});

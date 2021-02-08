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
test('深さ1に設定、領域値は1になるはず', () => {
    expect(calcPath(1, { lat: 34.6, lng: 135.2 }, min_sw, max_ne, divive_center, '')).toBe('1');
});

test('深さ1に設定、領域値は2になるはず', () => {
    expect(calcPath(1, { lat: 34.6, lng: 135.5 }, min_sw, max_ne, divive_center, '')).toBe('2');
});

test('深さ1に設定、領域値は3になるはず', () => {
    expect(calcPath(1, { lat: 34.8, lng: 135.3 }, min_sw, max_ne, divive_center, '')).toBe('3');
});

test('深さ1に設定、領域値は4になるはず', () => {
    expect(calcPath(1, { lat: 35.0, lng: 135.7 }, min_sw, max_ne, divive_center, '')).toBe('4');
});

// 深さ２の時の各領域値のテスト
test('深さ2に設定、領域値は1*になるはず', () => {
    expect(calcPath(2, { lat: 34.44, lng: 135.2 }, min_sw, max_ne, divive_center, '')).toBe('11');
    expect(calcPath(2, { lat: 34.45, lng: 135.4 }, min_sw, max_ne, divive_center, '')).toBe('12');
    expect(calcPath(2, { lat: 34.5, lng: 135.24 }, min_sw, max_ne, divive_center, '')).toBe('13');
    expect(calcPath(2, { lat: 34.6, lng: 135.39 }, min_sw, max_ne, divive_center, '')).toBe('14');
});

test('深さ2に設定、領域値は2*になるはず', () => {
    expect(calcPath(2, { lat: 34.45, lng: 135.42 }, min_sw, max_ne, divive_center, '')).toBe('21');
    expect(calcPath(2, { lat: 34.43, lng: 135.6 }, min_sw, max_ne, divive_center, '')).toBe('22');
    expect(calcPath(2, { lat: 34.6, lng: 135.43 }, min_sw, max_ne, divive_center, '')).toBe('23');
    expect(calcPath(2, { lat: 34.59, lng: 135.7 }, min_sw, max_ne, divive_center, '')).toBe('24');
});

test('深さ2に設定、領域値は3*になるはず', () => {
    expect(calcPath(2, { lat: 34.7, lng: 135.1 }, min_sw, max_ne, divive_center, '')).toBe('31');
    expect(calcPath(2, { lat: 34.8, lng: 135.3 }, min_sw, max_ne, divive_center, '')).toBe('32');
    expect(calcPath(2, { lat: 34.99, lng: 135.14 }, min_sw, max_ne, divive_center, '')).toBe('33');
    expect(calcPath(2, { lat: 34.89, lng: 135.3 }, min_sw, max_ne, divive_center, '')).toBe('34');
});

test('深さ2に設定、領域値は4*になるはず', () => {
    expect(calcPath(2, { lat: 34.84, lng: 135.44 }, min_sw, max_ne, divive_center, '')).toBe('41');
    expect(calcPath(2, { lat: 34.8, lng: 135.74 }, min_sw, max_ne, divive_center, '')).toBe('42');
    expect(calcPath(2, { lat: 34.86, lng: 135.42 }, min_sw, max_ne, divive_center, '')).toBe('43');
    expect(calcPath(2, { lat: 35.0, lng: 135.73 }, min_sw, max_ne, divive_center, '')).toBe('44');
});

test('深さ3に設定、領域値は11*になるはず', () => {
    expect(calcPath(3, { lat: 34.3, lng: 135.1 }, min_sw, max_ne, divive_center, '')).toBe('111');
    expect(calcPath(3, { lat: 34.3, lng: 135.174 }, min_sw, max_ne, divive_center, '')).toBe('112');
    expect(calcPath(3, { lat: 34.38, lng: 135.11 }, min_sw, max_ne, divive_center, '')).toBe('113');
    expect(calcPath(3, { lat: 34.4, lng: 135.2 }, min_sw, max_ne, divive_center, '')).toBe('114');
});

test('深さ3に設定、領域値は12*になるはず', () => {
    expect(calcPath(3, { lat: 34.29, lng: 135.3 }, min_sw, max_ne, divive_center, '')).toBe('121');
    expect(calcPath(3, { lat: 34.35, lng: 135.4 }, min_sw, max_ne, divive_center, '')).toBe('122');
    expect(calcPath(3, { lat: 34.39, lng: 135.32 }, min_sw, max_ne, divive_center, '')).toBe('123');
    expect(calcPath(3, { lat: 34.45, lng: 135.38 }, min_sw, max_ne, divive_center, '')).toBe('124');
});

import TreeModel from 'tree-model';
import LTT from 'list-to-tree'
import { getPlaces } from '../api/api'
import { treeModel } from './treeModel'

const tree = new TreeModel();


//export let json = []

export let root1
export let root2
export let root3
export let root4

// 地点データをセットする
// export async function setPlacesJSON() {
//     json = await getPlaces()
//     return json
//     //console.log("データ取得: ", json)
// }

// 地点データをすべて取得する
export function setTreeModel(places) {
    console.log("Treeに渡されたJSON: ", places)
    const treeDataStructure = new LTT(
        treeModel,
        { key_id: 'id', key_parent: 'parent', key_child: 'children' }
    ).GetTree();

    // ノードごとに変数に格納する
    let tds1 = treeDataStructure[0];
    let tds2 = treeDataStructure[1];
    let tds3 = treeDataStructure[2];
    let tds4 = treeDataStructure[3];

    // 木構造モデルを作成
    root1 = tree.parse(tds1)
    root2 = tree.parse(tds2)
    root3 = tree.parse(tds3)
    root4 = tree.parse(tds4)

    // ノードごとに地点データを割り当てる
    // ノード1
    root1.walk(node => {
        for (let i = 0; i < places.length; i++) {
            if (node.model.id.toString() === places[i].path) {
                node.model.data.push(places[i])
            }   
        }
    });

    // ノード2
    root2.walk(node => {
        for (let i = 0; i < places.length; i++) {
            if (node.model.id.toString() === places[i].path) {
                node.model.data.push(places[i])
            }   
        }
    });

    // ノード3
    root3.walk(node => {
        for (let i = 0; i < places.length; i++) {
            if (node.model.id.toString() === places[i].path) {
                node.model.data.push(places[i])
            }   
        }
    });

    //　ノード4
    root4.walk(node => {
        for (let i = 0; i < places.length; i++) {
            if (node.model.id.toString() === places[i].path) {
                node.model.data.push(places[i])
            }   
        }
    });
    console.log(root4)
}

// 近傍検索
export function searchNeighborhood(path) {
    let result = []; // 探索目的のデータ
    let depth = path.length; //深さ
    let target_node;
    //console.log(path)
    // 対象ノード調べる
    if (path[0] === '1') {
        target_node = root1
    } else if (path[0] === '2') {
        target_node = root2
    } else if (path[0] === '3') {
        target_node = root3
    } else {
        target_node = root4
    }

    // 親のノードを先に取得しておくことで、探索時間を節約できそう? 
    target_node = target_node.first(function (node) {
        //console.log(node.model.id)
        return node.model.id.toString().slice(0, depth) == path;
    });
    
    //データを取得する(深さ優先)
    if (target_node != undefined) {
        target_node.all(node => {
            //console.log(node.model.id)
            let array = [];
            if (node.model.data != undefined) {
                array = node.model.data;
                //console.log(array)
                for (let i = 0; i < array.length; i++) {
                    result.push(array[i])
                }
            }
        })
    }
    
    return result
}





import {boardItemData} from "../components/boards/Board/Board";
import {cloneDeep} from 'lodash';
import {getOptionalItemsForNextMove, makeMove} from "./logic";

export const replace2Items = (item1: boardItemData, item2: boardItemData) => {
    const item1Value = item1.value;
    item1.value = item2.value;
    item2.value = item1Value;
}

function getRandomFromArray(items: []) {
    return items[Math.floor(Math.random() * items.length)];
}

export function moveRandomOnce(board: boardItemData[][]): boardItemData[][] {
    let copy = cloneDeep(board);
    const options = getOptionalItemsForNextMove(copy);
    const rndItem = getRandomFromArray(options);
    return makeMove(copy, rndItem);
}

export const shuffleArray = (board: boardItemData[][]): boardItemData[][] => {
    // flat array and shuffle 
    let copy = cloneDeep(board);
    const shuffleVolume = 50;
    for (var i = 0; i < shuffleVolume; i++) {
        copy = moveRandomOnce(copy)
    }
    // rebuild 
    return copy;
};

export const printBoard = (board: boardItemData[][]) => {
    console.log(">>>>        [*************************] ");
    board.forEach(line => {
        console.log(">>>> ", line.map(i => `${i.value}-${i.index} -> R${i.allowedDirection}`));
    })
    console.log(">>>>        [*************************] ");
}

export const convertToBoardItems = (data: [][], index: number): boardItemData[][] => {
    const fill = [];
    data.forEach(line => {
        line.forEach(item => {
            const bi: boardItemData = {value: item, index: 1};
            return bi;
        })
    })
    return data
}

export enum directions {
    UP = "UP",
    DOWN = "DOWN",
    LEFT = "LEFT",
    RIGHT = "RIGHT",
}

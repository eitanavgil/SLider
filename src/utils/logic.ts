import {cloneDeep} from 'lodash';
import {directions, printBoard} from "./Utils";
import {boardItemData} from "../components/boards/Board/Board";

/*
 this func receives a board and "tells" every box which direction it is allowed to move to
 E.G. 
 [1][2][3]
 [4][5][6]
 [7][8][ ]
 6 is allowed to go down, 8 is allowed to go right. Others are not allowed
*/

export interface coordinates {
    x: number;
    y: number;
}

export const getOptionalItemsForNextMove = (board: boardItemData[][]): [] => {
    const cols = board[0].length;
    // look for the empty (0) position 
    const emptyPosition = findZeroCoordinates(board);
    const itemAbove = getItemAbove(emptyPosition, board);
    const itemBelow = getItemBelow(emptyPosition, board);
    const itemToRight = getItemToRight(emptyPosition, cols, board);
    const itemToLeft = getItemToLeft(emptyPosition, board);
    const o = [];
    if (itemAbove) {
        o.push(itemAbove)
    }
    if (itemBelow) {
        o.push(itemBelow)
    }
    if (itemToRight) {
        o.push(itemToRight)
    }
    if (itemToLeft) {
        o.push(itemToLeft)
    }
    return o as [];
}

// this takes data array and fills all cells with their optional directions 
export const fillRestrictions = (board: boardItemData[][]): boardItemData[][] => {
    // TODO - clear prev positions 
    let boardCopy = cloneDeep(board);
    // reset previous restrictions 
    boardCopy = resetRestrictions(boardCopy);
    const cols = board[0].length;
    // look for the empty (0) position 
    const emptyPosition = findZeroCoordinates(boardCopy);
    const itemAbove = getItemAbove(emptyPosition, boardCopy);
    const itemBelow = getItemBelow(emptyPosition, boardCopy);
    const itemToRight = getItemToRight(emptyPosition, cols, boardCopy);
    const itemToLeft = getItemToLeft(emptyPosition, boardCopy);
    console.log(">>>> EE", itemAbove, itemBelow, itemToRight, itemToLeft)
    if (itemAbove) {
        itemAbove.allowedDirection = directions.DOWN
    }
    if (itemBelow) {
        itemBelow.allowedDirection = directions.UP
    }
    if (itemToRight) {
        itemToRight.allowedDirection = directions.LEFT
    }
    if (itemToLeft) {
        itemToLeft.allowedDirection = directions.RIGHT
    }
    return boardCopy;
    // TODO - support slide is simpler - same row and same height
}

// @ts-ignore
export const findZeroCoordinates = (board: boardItemData[][]): coordinates => {
    for (let y = 0; y < board.length; y++) {
        const row = board[y];
        for (let x = 0; x < row.length; x++) {
            const item = row[x];
            // @ts-ignore
            if (item.value === 0) {
                return {x: x, y: y}
            }
        }
    }
}

// by reference
export const resetRestrictions = (board: boardItemData[][]): boardItemData[][] => {
    const copy = cloneDeep(board)
    for (let y = 0; y < copy.length; y++) {
        const row = copy[y];
        for (let x = 0; x < row.length; x++) {
            const item = row[x];
            delete item.allowedDirection;
        }
    }
    return copy;
}

export const getZeroItem = (board: boardItemData[][]) => {
    for (let y = 0; y < board.length; y++) {
        const row = board[y];
        for (let x = 0; x < row.length; x++) {
            const item = row[x];
            // @ts-ignore
            if (item.value === 0) {
                return item
            }
        }
    }
}


export const getCoordinatesByItem = (board: boardItemData[][], item: boardItemData) => {
    for (let y = 0; y < board.length; y++) {
        const row = board[y];
        for (let x = 0; x < row.length; x++) {
            const cell = row[x];
            // @ts-ignore
            if (item.index === cell.index) {
                return {x: x, y: y}
            }
        }
    }
    return null
}

export const getItemByCoordinates = (x: number, y: number, board: boardItemData[][]): boardItemData | null => {
    if (!board[y] || board[y][x] === undefined) {
        return null
    }
    return board[y][x];
}

export const getItemToLeft = (coordinates: coordinates, board: boardItemData[][]): boardItemData | null => {
    return getItemByCoordinates(coordinates.x - 1, coordinates.y, board);
}

export const getItemToRight = (coordinates: coordinates, cols: number, board: boardItemData[][]): boardItemData | null => {
    return getItemByCoordinates(coordinates.x + 1, coordinates.y, board);
}

export const getItemAbove = (coordinates: coordinates, board: boardItemData[][]): boardItemData | null => {
    return getItemByCoordinates(coordinates.x, coordinates.y - 1, board);
}

export const getItemBelow = (coordinates: coordinates, board: boardItemData[][]): boardItemData | null => {
    return getItemByCoordinates(coordinates.x, coordinates.y + 1, board);
}

//maps a 2D array of single numbers to {value,index} structure 
export const convertToBoardData = (board: number[][]): boardItemData[][] => {
    const copy = cloneDeep(board);
    return copy.map((row, index, array) => {
        // this is now a scope of one row
        const newRow = cloneDeep(row as []);
        return newRow.map((item, itemIndex, array) => {
            return {value: item, index: index * array.length + itemIndex};
        })
    })
}

export const makeMove = (board: boardItemData[][], item: boardItemData) => {
    const copy = cloneDeep(board);
    const zero = getZeroItem(copy);
    const zeroCoordinates = findZeroCoordinates(copy);
    const itemCoordinates = getCoordinatesByItem(copy, item);
    copy[zeroCoordinates.y][zeroCoordinates.x] = item;
    // @ts-ignore
    copy[itemCoordinates.y][itemCoordinates.x] = zero;
    return copy;
}
export const replaceItems = (board: boardItemData[][], item1: boardItemData, item2: boardItemData) => {

}

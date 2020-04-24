import {boardItem, boxData} from "../components/boards/Board/Board";
import {cloneArray} from "./Utils";

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

export const fillRestrictions = (board: boxData[][]) => {
    // TODO - clear prev positions 

    const boardCopy = cloneArray(board as []);

    const rows = board.length;
    const cols = board[0].length;
    // look for the empty (0) position 
    const emptyPosition = findZero(board);
    console.log(">>>> emptyPosition", emptyPosition)
    const itemAbove = getItemAbove(emptyPosition, board);
    const itemBelow = getItemBelow(emptyPosition, board);
    const itemToRight = getItemToRight(emptyPosition, cols, board);
    const itemToLeft = getItemToLeft(emptyPosition, board);

    if (itemAbove) {
        console.log(">>>> itemAbove", itemAbove)
    }
    if (itemBelow) {
        console.log(">>>> itemBelow", itemBelow)
    }
    if (itemToRight) {
        console.log(">>>> itemToRight", itemToRight)
    }
    if (itemToLeft) {
        console.log(">>>> itemToLeft", itemToLeft)
    }
    // TODO - support slide is simpler - same row and same height
}

// @ts-ignore
export const findZero = (board: boxData[][]): coordinates => {
    for (let y = 0; y < board.length; y++) {
        const row = board[y];
        for (let x = 0; x < row.length; x++) {
            const item = row[x];
            // @ts-ignore
            if (item === 0) {
                return {x: x, y: y}
            }
        }
    }
}

export const getItemByCoordinates = (x: number, y: number, board: boxData[][]): boardItem | null => {
    if (!board[y] || board[y][x] === undefined) {
        return null
    }
    return board[y][x];
}

export const getItemToLeft = (coordinates: coordinates, board: boxData[][]): boardItem | null => {
    return getItemByCoordinates(coordinates.x - 1, coordinates.y, board);
}

export const getItemToRight = (coordinates: coordinates, cols: number, board: boxData[][]): boardItem | null => {
    return getItemByCoordinates(coordinates.x + 1, coordinates.y, board);
}

export const getItemAbove = (coordinates: coordinates, board: boxData[][]): boardItem | null => {
    return getItemByCoordinates(coordinates.x, coordinates.y - 1, board);
}

export const getItemBelow = (coordinates: coordinates, board: boxData[][]): boardItem | null => {
    return getItemByCoordinates(coordinates.x, coordinates.y + 1, board);
}

export const getAllowedDirection = (index: number, board: boxData[][]) => {

}


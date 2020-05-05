import {cloneDeep, flatten, isEqual, reverse} from 'lodash';
import {directions, printBoard} from "./Utils";
import {boardItemData, GameMode} from "../components/boards/Board/Board";

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
export const fillRestrictions = (board: boardItemData[][], gameMode?: GameMode): boardItemData[][] => {
    // TODO - clear prev positions 
    let boardCopy = cloneDeep(board);
    // reset previous restrictions 
    boardCopy = resetRestrictions(boardCopy);
    const coordintesOfEmpty = findZeroCoordinates(boardCopy);
    if (gameMode === GameMode.multiple) {
        // vertical 
        const flattenArray = flatten(boardCopy);
        const itemsAbove = getItemsAbove(flattenArray, coordintesOfEmpty);
        const itemsBelow = getItemsBelow(flattenArray, coordintesOfEmpty);
        const itemsToRight = getItemsToRight(flattenArray, coordintesOfEmpty);
        const itemsToLeft = getItemsToLeft(flattenArray, coordintesOfEmpty);
        if (itemsAbove) {
            itemsAbove.map(i => i.allowedDirection = directions.DOWN);
        }
        if (itemsBelow) {
            itemsBelow.map(i => i.allowedDirection = directions.UP);
        }
        if (itemsToRight) {
            itemsToRight.map(i => i.allowedDirection = directions.LEFT);
        }
        if (itemsToLeft) {
            itemsToLeft.map(i => i.allowedDirection = directions.RIGHT);
        }
        return boardCopy
    }
    const cols = board[0].length;
    // look for the empty (0) position 
    const itemAbove = getItemAbove(coordintesOfEmpty, boardCopy);
    const itemBelow = getItemBelow(coordintesOfEmpty, boardCopy);
    const itemToRight = getItemToRight(coordintesOfEmpty, cols, boardCopy);
    const itemToLeft = getItemToLeft(coordintesOfEmpty, boardCopy);
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


// compare 2 and check 
export const check = (board1: boardItemData[][], board2: boardItemData[][], gamePolicy?: any): boolean => {
    switch (gamePolicy) {
        case "normal": // by values - not by index 
        default:
            const cleanBoard1 = getValues(board1);
            const cleanBoard2 = getValues(board2);
            return isEqual(cleanBoard1, cleanBoard2)
    }
}

// returns a matrix only of of the values 
export const getValues = (board: boardItemData[][]): number[][] => {
    return board.map((line) => {
        return line.map((cell) => {
            return cell.value
        })
    })

}
export const resetRestrictions = (board: boardItemData[][]): boardItemData[][] => {
    const copy = cloneDeep(board)
    for (let y = 0; y < copy.length; y++) {
        const row = copy[y];
        for (let x = 0; x < row.length; x++) {
            const item = row[x];
            item.x = x;
            item.y = y;
            delete item.allowedDirection;
        }
    }
    return copy;
}

export const getZeroItem = (board: boardItemData[][]): boardItemData | null => {
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
    return null;
}
export const generateBoard = (sizes: coordinates, colors: number): number[][] => {
    let board = new Array()
    for (let y = 0; y < sizes.y; y++) {
        const row = new Array()
        for (let x = 0; x < sizes.x; x++) {
            row.push(getRandomInt(colors) + 1)
        }
        board.push(row);
    }
    // handle 0 
    board[getRandomInt(sizes.y)][getRandomInt(sizes.x)] = 0;
    return board
}

export const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * Math.floor(max));
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

///////////////////////////
export const getItemsAbove = (flattenBoard: boardItemData[], zeroCoordinates: coordinates): boardItemData[] => {
    return flattenBoard.filter((item: boardItemData) => {
        return item.x !== undefined && item.x === zeroCoordinates.x && item.y !== undefined && item.y < zeroCoordinates.y
    })
}
export const getItemsBelow = (flattenBoard: boardItemData[], zeroCoordinates: coordinates): boardItemData[] => {
    return flattenBoard.filter((item: boardItemData) => {
        return item.x !== undefined && item.x === zeroCoordinates.x && item.y !== undefined && item.y > zeroCoordinates.y
    })
}
export const getItemsToRight = (flattenBoard: boardItemData[], zeroCoordinates: coordinates): boardItemData[] => {
    return flattenBoard.filter((item: boardItemData) => {
        return item.x !== undefined && item.x > zeroCoordinates.x && item.y !== undefined && item.y === zeroCoordinates.y
    })
}
export const getItemsToLeft = (flattenBoard: boardItemData[], zeroCoordinates: coordinates): boardItemData[] => {
    return flattenBoard.filter((item: boardItemData) => {
        return item.x !== undefined && item.x < zeroCoordinates.x && item.y !== undefined && item.y === zeroCoordinates.y
    })
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

export const makeMove = (board: boardItemData[][], item: boardItemData, gameMode?: GameMode) => {
    const copy = cloneDeep(board);
    const zero = getZeroItem(copy);
    const zeroCoordinates = findZeroCoordinates(copy);
    const itemCoordinates = getCoordinatesByItem(copy, item);
    if (gameMode === GameMode.multiple) {
        // here we need to find out if the item is left/right/above/below
        multiMove(copy, item, zeroCoordinates, zero!);
        return copy
    }

    // simple mode - switch only one with the empty      
    copy[zeroCoordinates.y][zeroCoordinates.x] = item;
    // @ts-ignore
    copy[itemCoordinates.y][itemCoordinates.x] = zero;
    return copy;
}
// receive an item to move and the board - returns an updated board with results
export const multiMove = (board: boardItemData[][], item: boardItemData, zeroCoordinates: coordinates, zeroItem: boardItemData) => {
    const copy = cloneDeep(board);
    if (!item.allowedDirection) {
        return
    }
    const flattenArray = flatten(copy);
    // find out which side the item is 
    switch (item.allowedDirection) {
        case directions.RIGHT:
            // item is left to empty
            const itemsToLeft = reverse(getItemsToLeft(flattenArray, zeroCoordinates));
            for (let i = 0; i < itemsToLeft.length; i++) {
                // iterate all items that has X above=items X
                // @ts-ignore
                if (itemsToLeft[i].x >= item.x) {
                    // replaceItems(copy, zeroItem, itemsToLeft[i]);
                }
            }

            return fillRestrictions(copy);
            break;
        // item is right to empty
        case directions.LEFT:
            break;
        case directions.UP:
            // item is below empty
            break;
        case directions.DOWN:
            // item is above empty
            break;
    }
}
export const replaceItems = (board: boardItemData[][], item1: boardItemData, item2: boardItemData) => {
    const tmp1 = cloneDeep(item1);
    const tmp2 = cloneDeep(item2);
    debugger;
    item1.x = tmp2.x;
    item1.y = tmp2.y;
    item1.value = tmp2.value;
    item2.x = tmp1.x;
    item2.y = tmp1.y;
    item2.value = tmp1.value;
}

import {boardItem} from "../components/boards/Board/Board";

export const shuffle: Function = (array: []) => {
    return array.sort(() => Math.random() - 0.5);
};

export const shuffle2DArray = (arrData: number[][]) => {
    let copy = cloneArray(arrData as []);
    for (let i = 0; i < copy.length; i++) {
        (copy[i] as []) = shuffleArray(copy[i])
    }
    return shuffle(copy);
}

export const shuffleArray = (arrData: any[]) => {
    return shuffle(cloneArray(arrData as []));
};

export const cloneArray = (arr: []) => {
    let i, copy;
    if (Array.isArray(arr)) {
        copy = arr.slice(0);
        for (i = 0; i < copy.length; i++) {
            // @ts-ignore
            copy[i] = cloneArray(copy[i]);
        }
        return copy;
    } else if (typeof arr === 'object') {
        throw 'Cannot clone array containing an object!';
    } else {
        return arr;
    }
}

export const convertToBoardItems = (data: [][], index: number): boardItem[][] => {
    const fill = [];
    data.forEach(line => {
        line.forEach(item => {
            const bi: boardItem = {value: item, index: 1};
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


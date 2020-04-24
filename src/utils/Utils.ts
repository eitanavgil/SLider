import {boardItem} from "../App";

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

export const cloneArray = (arrData: []) => {
    return [...arrData];
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

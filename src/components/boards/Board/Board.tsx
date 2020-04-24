import React, {useEffect, useState} from "react";
import "./Board.css";
import {cloneArray, shuffle2DArray} from "../../../utils/Utils";
import SliderBox from "../../SliderBox/SliderBox";
import {fillRestrictions} from "../../../utils/logic";

export interface props {
    boardData: any[][];
    interactive?: Boolean;
}

export interface boardItem {
    index: number;
    value: number;
}

const defaultProps: props = {
    boardData: [],
    interactive: false,
};

export interface boxData {
    value: number,
    index: number
}

//maps a 2D array of single numbers to {value,index} structure 
const convertToBoardData = (board: number[][]): boxData[][] => {
    return board.map((row, index, array) => {
        // this is now a scope of one row
        const newRow = cloneArray(row as []);
        return newRow.map((item, itemIndex, array) => {
            return {value: item, index: index * array.length + itemIndex};
        })
    })
}

const Board = (props: props) => {
    useEffect(() => {
        // Update the document title using the browser API
        setBoard(getBoardData(props.boardData));
        fillRestrictions(props.boardData);
        // console.log(">>>> qq",)
        // console.log(">>>> ",props.boardData);
        // let cp = cloneArray(props.boardData as []);
        // console.log(">>>> CP 1",cp);
        // console.log(">>>> PPDD",props.boardData);
        // // @ts-ignore
        // cp[0][0] = 7;
        // console.log(">>>> CP 2",cp);
        // console.log(">>>> PPDD",props.boardData);

    }, []);

    const getBoardData = (boardData: number[][]): number[][] => {
        // if (props.interactive) {
        //     const sa = shuffle2DArray(boardData);
        //     return sa;
        // }
        return boardData;
    };

    const [board, setBoard] = useState(getBoardData(props.boardData));
    return (
        <div>
            {convertToBoardData(board).map((row, i) => (
                <div key={i}>
                    {row.map((col, j) => (
                        <SliderBox key={j} value={col.value} index={col.index}></SliderBox>
                    ))}
                </div>
            ))}
        </div>
    );
};
Board.defaultProps = defaultProps;
export default Board;

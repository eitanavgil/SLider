import React from "react";
import "./Board.css";
import {shuffle2DArray} from "../../../utils/Utils";
import SliderBox from "../../SliderBox/SliderBox";

export interface props {
    boardData: any[][];
    interactive?: Boolean;
}

const defaultProps: props = {
    boardData: [],
    interactive: false,
};

const Board = (props: props) => {

    const getBoardData = (boardData: number[][]): number[][] => {
        if (props.interactive) {
            const sa = shuffle2DArray(boardData);
            console.log(">>>>  SA", sa)
            return sa;
        }
        return boardData;
    };

    return (
        <div>
            {getBoardData(props.boardData).map((row, i) => (
                <div key={i}>
                    {row.map((col, j) => (
                        <SliderBox key={j} color={col}></SliderBox>
                    ))}
                </div>
            ))}
        </div>
    );
};
Board.defaultProps = defaultProps;
export default Board;

import React, {useEffect, useState} from "react";
import {cloneDeep, isEqual} from 'lodash';
import SliderBox from "../../SliderBox/SliderBox";
import {check, fillRestrictions, getOptionalItemsForNextMove, makeMove, resetRestrictions} from "../../../utils/logic";
import {directions, printBoard, shuffleArray} from "../../../utils/Utils";
import "./Board.css";

export interface props {
    boardData: boardItemData[][];
    interactive?: Boolean;
    onEnded?: () => void;
    onStarted?: () => void;
}

export interface boardItemData {
    index: number;
    value: number;
    allowedDirection?: directions | undefined;
}

const defaultProps: props = {
    boardData: [],
    interactive: false,
};

const Board = (props: props) => {

    const nextMove = (item: boardItemData) => {
        props.onStarted && props.onStarted();
        if (!props.interactive) {
            return; // make sure we are not changing the next 
        }
        let board = makeMove(boardData, item);
        board = resetRestrictions(board);
        setBoardData(fillRestrictions(board));
        if (check(board, props.boardData)) {
            setTimeout(() => {
                if (props.onEnded) {
                    props.onEnded()
                }
            }, 50)
        }
    }

    const [boardData, setBoardData] = useState(cloneDeep(props.boardData));

    useEffect(() => {
        let newBoard = cloneDeep(props.boardData);
        if (props.interactive) {
            newBoard = shuffleArray(newBoard);
        }
        newBoard = fillRestrictions(newBoard);
        setBoardData(newBoard);
    }, []);

    return (
        <div className={props.interactive ? "interactive" : "preview"}>
            {boardData.map((row, i) => (
                <div key={i} className={"board-row"}>
                    {row.map((col, j) => (
                        <SliderBox key={j}
                                   data={col}
                                   onMove={nextMove}
                        ></SliderBox>
                    ))}
                </div>
            ))}
        </div>
    );
};
Board.defaultProps = {interactive: false};
export default Board;

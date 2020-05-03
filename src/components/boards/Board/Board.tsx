import React, {useEffect, useState} from "react";
import {cloneDeep, isEqual} from 'lodash';
import SliderBox from "../../SliderBox/SliderBox";
import {check, fillRestrictions, getOptionalItemsForNextMove, makeMove, resetRestrictions} from "../../../utils/logic";
import {directions, printBoard, shuffleArray} from "../../../utils/Utils";
import "./Board.css";

export interface props {
    gameMode?: GameMode;
    boardData: boardItemData[][];
    interactive?: Boolean;
    onEnded?: () => void;
    onStarted?: () => void;
}

export enum GameMode {
    "simple" = "simple",
    "multiple" = "multiple"
}

export interface boardItemData {
    x?: number;
    y?: number;
    index: number;
    value: number;
    allowedDirection?: directions | undefined;
}

const defaultProps: props = {
    gameMode: GameMode.simple,
    boardData: [],
    interactive: false,
};

const Board = (props: props) => {

    const nextMove = (item: boardItemData) => {
        if (!props.interactive) {
            return; // make sure we are not changing the next 
        }
        props.onStarted && props.onStarted();
        let board = makeMove(boardData, item, props.gameMode);
        board = resetRestrictions(board);
        setBoardData(fillRestrictions(board, props.gameMode));
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
        newBoard = fillRestrictions(newBoard, props.gameMode);
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
Board.defaultProps = defaultProps;
export default Board;

import React, { useEffect, useState } from "react";
import { cloneDeep } from "lodash";
import SliderBox from "../../SliderBox/SliderBox";
import {
  check,
  fillRestrictions,
  makeMove,
  resetRestrictions,
} from "../../../utils/logic";
import { directions } from "../../../utils/Utils";
import "./Board.css";

export interface props {
  gameMode?: GameMode;
  boardData: any;
  interactive?: Boolean;
  onEnded?: () => void;
  onStarted?: () => void;
}

export enum GameMode {
  "simple" = "simple",
  "multiple" = "multiple",
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
  boardData: {},
  interactive: false,
};

const Board = (props: props) => {
  const [boardData, setBoardData] = useState();
  const [active, setActive] = useState(true);

  const nextMove = (item: boardItemData) => {
    if (!props.interactive || !active) {
      return; // make sure we are not changing the next
    }
    props.onStarted && props.onStarted();
    let board = makeMove(boardData, item, props.gameMode);
    board = resetRestrictions(board);
    setBoardData(fillRestrictions(board, props.gameMode));
    // todo - optimize later
    if (check(board, JSON.parse(props.boardData.target!))) {
      setTimeout(() => {
        if (props.onEnded) {
          setActive(false);
          props.onEnded();
        }
      }, 50);
    }
  };

  useEffect(() => {
    let boardDataLocal = props.boardData;
    if (!boardDataLocal) {
      return;
    }
    if (props.interactive && props.boardData.target) {
      let data = props.boardData.scrambled;
      if (typeof data === "string") {
        data = JSON.parse(props.boardData.scrambled);
      }
      let newBoard = cloneDeep(data);
      newBoard = fillRestrictions(newBoard!, props.gameMode);
      setBoardData(newBoard);
    } else {
      let data = props.boardData.target;
      if (typeof data === "string") {
        data = JSON.parse(props.boardData.target);
      }
      let newBoard = cloneDeep(data);
      newBoard = fillRestrictions(newBoard!, props.gameMode);
      setBoardData(newBoard);
    }
  }, []);

  // @ts-ignore
  return (
    <div className={props.interactive ? "interactive board" : "preview board"}>
      {boardData &&
        boardData.map((row: [], i: number) => (
          <div key={i} className={"board-row"}>
            {row.map((col: boardItemData, j: number) => (
              <SliderBox key={j} data={col} onMove={nextMove}></SliderBox>
            ))}
          </div>
        ))}
    </div>
  );
};
Board.defaultProps = defaultProps;
export default Board;

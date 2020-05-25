import React, { useRef, useState, Fragment } from "react";
import Board, { boardItemData } from "../Board/Board";
import "./GameBoard.css";
import Timer from "../../Timer/Timer";

export interface gameData {
  createMode?: boolean;
  onDone?: (time: string) => void;
  target: boardItemData[][];
  scrambled: boardItemData[][];
}
/**
 * Game board is in fact 2 different single board.
 * One interactive, one target sample
 */
function GameBoard(props: gameData) {
  const [timer, setTimer] = useState(false);
  const [score, setScore] = useState();

  const startTimer = () => {
    setTimer(true);
  };
  const done = () => {
    setTimer(false);
    setTimeout(() => {
      if (props.onDone) {
        props.onDone(score);
      }
    }, 500);
  };
  useRef();

  const greeting = "Hello Function Component!";
  return (
    <Fragment>
      {!props.createMode && (
        <div className={"timer-wrapper"}>
          <Timer
            start={timer}
            onUpdated={(time: string) => {
              setScore(time);
            }}
          />
        </div>
      )}
      <div className={"separator"}></div>
      {props.target && (
        <Board
          boardData={props}
          interactive={true}
          onStarted={startTimer}
          onEnded={done}
        ></Board>
      )}
      <div className={"separator"}></div>
      {props.scrambled && <Board boardData={props} interactive={false}></Board>}
    </Fragment>
  );
}
export default GameBoard;

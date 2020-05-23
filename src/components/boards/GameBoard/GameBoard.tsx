import React, { useState, Fragment } from "react";
import Board, { boardItemData } from "../Board/Board";
import "./GameBoard.css";
import Timer from "../../Timer/Timer";

export interface gameData {
  target: boardItemData[][];
  scrambled: boardItemData[][];
}
/**
 * Game board is in fact 2 different single board.
 * One interactive, one target sample
 */
function GameBoard(props: gameData) {
  const [timer, setTimer] = useState(false);

  const startTimer = () => {
    setTimer(true);
  };
  const done = () => {
    setTimer(false);
  };

  const greeting = "Hello Function Component!";
  return (
    <Fragment>
      {timer ? <Timer start={timer} /> : <h4> </h4>}
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

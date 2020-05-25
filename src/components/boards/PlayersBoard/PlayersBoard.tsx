import React, { Fragment, useState } from "react";
import "./PlayersBoard.css";

export interface playerData {
  name?: string;
  score?: number;
}
export interface playersBoardProps {
  players: playerData[];
}
/*************   LIST OF ALL PLAYERS   ************/
function PlayersBoard(props: playersBoardProps) {
  return (
    <Fragment>
      <div className="players-table">
        {console.log(">>>> ss", props.players)}
        {props.players &&
          props.players &&
          props.players.length > 1 &&
          props.players.map((line: any, i: number) => {
            if (i === 0) {
              return null;
            }
            return (
              <div key={i} className="player-line">
                <div className="player-line-item">{line.name}</div>
                <div className="player-line-item">{line.score}</div>
              </div>
            );
          })}
      </div>
      {!props.players && <span>No Players Yet</span>}
    </Fragment>
  );
}
export default PlayersBoard;

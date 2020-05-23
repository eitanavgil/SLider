import React, { Fragment, useState } from "react";

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
      {props.players &&
        props.players &&
        props.players.length &&
        props.players.map((line: any, i: number) => (
          <div key={i}>{line.name}</div>
        ))}
      {!props.players && <span>BBB</span>}
    </Fragment>
  );
}
export default PlayersBoard;

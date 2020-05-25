import React, { Fragment, useEffect, useState } from "react";
import { FirebaseService } from "../../../utils/firebaseService";
import PlayersBoard from "../../boards/PlayersBoard/PlayersBoard";
import { GameState } from "../../../App";
import "./Manage.css";

let fb: FirebaseService;
// join a game by id or show generic board with an option to type the game id manually
const Manage = (props: any) => {
  const [gameId, setGameId] = useState();
  const [gameData, setGameData] = useState();
  const [gamePlayers, setGamePlayers] = useState();

  useEffect(() => {
    const sp = new URLSearchParams(props.location.search).get("game");
    // todo - handle authentication later
    fb = new FirebaseService();
    // @ts-ignore
    fb.listenToChange(sp, (o: any) => {
      setGameData(o);
    });
    // @ts-ignore
    fb.listenToTableChange(sp, (o: any) => {
      setGamePlayers(o);
    });
    // todo - handle missing id !
    setGameId(sp);
  }, []);

  const startGame = () => {
    fb.startGame(gameId);
  };
  const endGame = () => {
    fb.endGame(gameId);
  };

  return (
    <Fragment>
      <h1>Game: {gameId}</h1>
      {gameData && gameData.status && (
        <Fragment>
          <h1>
            Game is in <span className="h1 status">{gameData.status}</span> mode
          </h1>
          {gameData.status === GameState.lobby && (
            <button className={"player-button"} onClick={startGame}>
              Start Game !
            </button>
          )}
          {gameData.status === GameState.playing && (
            <button className={"player-button"} onClick={endGame}>
              End Game !
            </button>
          )}
        </Fragment>
      )}

      {gamePlayers && <PlayersBoard players={gamePlayers}></PlayersBoard>}
    </Fragment>
  );
};

export default Manage;

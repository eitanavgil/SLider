import React, { Fragment, useEffect, useState } from "react";
import "./Player.css";
import { FirebaseService } from "../../../utils/firebaseService";
import PlayersBoard from "../../boards/PlayersBoard/PlayersBoard";
import GameBoard from "../../boards/GameBoard/GameBoard";

let fb: FirebaseService;

export enum GameState {
  "init" = "init",
  "join" = "join",
  "create" = "create",
  "push" = "push",
  "lobby" = "lobby",
  "playing" = "playing",
  "end" = "end",
}

// join a game by id or show generic board with an option to type the game id manually
const Play = (props: any) => {
  const [gameId, setGameId] = useState();
  const [userId, setUserId] = useState();
  const [error, setError] = useState();
  const [gameData, setGameData] = useState();
  const [gamePlayers, setGamePlayers] = useState();

  const submitScore = (score: string) => {
    setTimeout(() => {
      fb.submitScore(userId, gameId, score);
    }, 2000);
  };
  const join = (evt: any) => {
    evt.preventDefault();
    // assume FB is ready
    fb.addUserToGame(userId, gameId)
      .then((o: any) => {
        fb.listenToChange(gameId, (o: any) => {
          setGameData(o);
        });
        fb.listenToTableChange(gameId, (o: any) => {
          setGamePlayers(o);
        });
      })
      .catch((e) => {
        setError(e.error);
      });
  };

  useEffect(() => {
    const sp = new URLSearchParams(props.location.search);
    fb = new FirebaseService();
    const input = document.querySelector("input");
    input!.focus();
    setGameId(sp.get("game"));
  }, []);

  return (
    <div className={"player"}>
      {error && <div className={"error"}>{error}</div>}
      <div className={"player-body"}>
        {/***************************** NEW USER - SHOW LOGIN UI ****************************/}
        {!gameData && (
          <form className={"join-form"} onSubmit={(evt) => join(evt)}>
            <input
              className={"player-input"}
              onChange={(e: any) => {
                setUserId(e.target.value);
              }}
              placeholder={"Nickname"}
            />
            <button
              className={"player-button join"}
              onSubmit={(evt) => join(evt)}
            >
              Join
            </button>
          </form>
        )}
        {/********************** LOBBY MODE - WAIT FOR GAME START ***************************/}
        {gameData && gameData.status === GameState.lobby && (
          <div>
            <h1>Hello {userId}</h1>
            <p className={"instructions"}>
              You are now in the lobby. We are waiting for your friends to join.
              <h3>The game host should start the game soon.</h3>
            </p>
            <br />
            <br />
            <br />
            <br />
            <h4>Look who is playing this game:</h4>
            <h4>
              Ido - Shahaf - I would want to show an animation of how to play
              here...
            </h4>
            {gamePlayers && <PlayersBoard players={gamePlayers}></PlayersBoard>}
          </div>
        )}
        {/********************** GAME MODE - Game is ready to play **************************/}
        {gameData && gameData.status === GameState.playing && (
          <Fragment>
            {gameData.target && (
              <GameBoard
                onDone={(score) => {
                  submitScore(score);
                }}
                target={gameData.target}
                scrambled={gameData.scrambled}
              />
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
};
export default Play;

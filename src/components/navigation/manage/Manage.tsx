import React, { Fragment, useEffect, useState } from "react";
import { FirebaseService } from "../../../utils/firebaseService";
import PlayersBoard from "../../boards/PlayersBoard/PlayersBoard";
import { GameState } from "../../../App";
import "./Manage.css";

let fb: FirebaseService;
// join a game by id or show generic board with an option to type the game id manually
const Manage = (props: any) => {
  const [qrUrl, setQrUrl] = useState();
  const [gameId, setGameId] = useState();
  const [gameData, setGameData] = useState();
  const [gamePlayers, setGamePlayers] = useState();

  useEffect(() => {
    const sp = new URLSearchParams(props.location.search).get("game");
    if (!sp) {
      console.log(">>>> missing game parameter on the URL ");
      return;
    }
    const gameNumber = parseInt(sp);
    if (!gameNumber) {
      console.log(">>>> game id is not a valid number ");
      return;
    }
    // todo - handle authentication later
    fb = new FirebaseService();
    // @ts-ignore
    fb.listenToChange(gameNumber, (o: any) => {
      setGameData(o);
    });
    // @ts-ignore
    fb.listenToTableChange(gameNumber, (o: any) => {
      setGamePlayers(o);
    });
    // todo - handle missing id !
    setGameId(sp);
    setQrUrl(
      `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=https%3A%2F%2Fslider-98bd3.web.app%2Fplay%3FgameId%3D${gameNumber}`
    );
  }, []);

  const startGame = () => {
    fb.startGame(gameId);
  };
  const setQrVisibility = () => {
    if (qrUrl) {
      setQrUrl("");
    } else {
      setQrUrl(
        `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=https%3A%2F%2Fslider-98bd3.web.app%2Fplay%3FgameId%3D${gameId}`
      );
    }
  };
  const copyUrl = () => {
    var el = document.createElement("textarea");
    el.value = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=https%3A%2F%2Fslider-98bd3.web.app%2Fplay%3FgameId%3D${gameId}`;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
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
            <Fragment>
              <button className={"player-button"} onClick={endGame}>
                End Game !
              </button>
            </Fragment>
          )}

          <Fragment>
            <br />
            <button className="copy-icon player-button" onClick={copyUrl}>
              Copy URL
            </button>
            <button className="qr-icon player-button" onClick={setQrVisibility}>
              Toggle QR
            </button>
          </Fragment>

          {qrUrl && (
            <img
              className={"qr-code"}
              src={qrUrl}
              alt="QR code"
              onClick={setQrVisibility}
            />
          )}
        </Fragment>
      )}
      {gamePlayers && <PlayersBoard players={gamePlayers}></PlayersBoard>}
    </Fragment>
  );
};

export default Manage;

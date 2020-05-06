import "./App.css";
import { convertToBoardData, generateBoard } from "./utils/logic";
import Board, { boardItemData } from "./components/boards/Board/Board";
import React, { Fragment, useEffect, useState } from "react";
import Timer from "./components/Timer/Timer";
import { shuffleArray } from "./utils/Utils";
import { FirebaseService } from "./utils/firebaseService";
import Lobby from "./components/Lobby/Lobby";
import GameOptions, { gameOptions } from "./components/GameOptions/GameOptions";
import ScoreBoard from "./components/boards/ScoreBoard/ScoreBoard";

export enum GameState {
  "init" = "init",
  "join" = "join",
  "create" = "create",
  "push" = "push",
  "lobby" = "lobby",
  "playing" = "playing",
  "end" = "end",
}

export enum UserTypes {
  "admin" = "admin",
  "player" = "player",
}

export interface gameData {
  target?: boardItemData[][];
  scrambled?: boardItemData[][];
}

let fb: FirebaseService;

function App() {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [boardData, setBoardData] = useState<gameData>();
  const [timerStarted, setTimerStarted] = useState(false);
  const [gameState, setGameState] = useState(GameState.init);
  const [gameId, setGameId] = useState();
  const [userType, setUserType] = useState<UserTypes>(UserTypes.player);
  const [user, setUser] = useState();
  const [users, setUsers] = useState<[]>();
  const [qrPreview, setQrPreview] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const myGame = urlParams.get("game");
    const admin = urlParams.get("admin");
    if (admin) {
      setUserType(UserTypes.admin);
    }
    if (gameState === GameState.init) {
      fb = new FirebaseService();
      if (myGame) {
        setGameId(parseInt(myGame));
        setGameState(GameState.join);
      } else if (admin) {
        setGameState(GameState.create);
      }
    }
    if (gameState === GameState.end) {
      console.log(">>>> ENDED");
    }
    if (gameState === GameState.push) {
      fb.createGame(boardData!.target!, boardData!.scrambled!, (gameId) => {
        setGameId(gameId);
        setGameState(GameState.playing);
        listenToNamesUpdates(gameId);
      });
    }
    if (gameState === GameState.create) {
    }
    if (gameState === GameState.playing) {
      if (userType === UserTypes.admin) {
        setQrPreview(true);
      }
    }
  }, [gameState]);

  const saveGame = (gameOptions: gameOptions) => {
    if (gameOptions.colors < 2 || gameOptions.colors > 5) {
      setErrorMessage("Colors must be between 2 to 5");
      return;
    }
    if (gameOptions.x > 5 || gameOptions.y > 5) {
      setErrorMessage("Maximum Board is 5");
      return;
    }
    if (gameOptions.x * gameOptions.y < 6) {
      setErrorMessage("Board must have at least 6 items");
      return;
    }
    const newBoard = generateBoard(
      {
        x: gameOptions.x,
        y: gameOptions.y,
      },
      gameOptions.colors
    );
    setBoardData({
      target: convertToBoardData(newBoard),
      scrambled: shuffleArray(convertToBoardData(newBoard)),
    });
    setGameState(GameState.push);
  };

  const startGame = () => {
    fb.startGame(gameId);
  };

  const setTimerEnded = (time: string) => {
    fb.submitScore(user, gameId, time);
  };
  const endGame = () => {
    fb.endGame(gameId);
  };

  const listenToNamesUpdates = (gameId: number) => {
    fb.listenToNames(gameId, (data: any) => {
      if (data && data.names) {
        setUsers(data.names);
      }
    });
  };

  const join = () => {
    if (gameId && user && fb) {
      if (!fb) {
        return;
      }
      // add user
      fb.addUserToGame(user, gameId, (data: any) => {
        if (data.message) {
          // TODO - convert to text on screen to the user
          alert(data.message);
          return;
        }
        if (data.target) {
          setBoardData({
            target: data.target as boardItemData[][],
            scrambled: data.scrambled as boardItemData[][],
          });
          setGameState(GameState.playing);
          listenToNamesUpdates(gameId);
        }
      });
    } else {
      // TODO - convert to text on screen to the user
      if (!gameId) {
        alert("Both fields are mandatory");
      }
    }
  };

  const setAdminMode = () => {
    setUserType(UserTypes.admin);
    setGameState(GameState.create);
  };

  return (
    <Fragment>
      <Timer start={timerStarted} onEnded={(v) => setTimerEnded(v)} />
      {userType === UserTypes.admin && gameId && (
        <a
          href={`http://projects.kaltura.com/eitan/slider/index.html?game=${gameId}`}
        >
          {`http://projects.kaltura.com/eitan/slider/index.html?game=${gameId}`}
        </a>
      )}
      {/********************************   INIT  **************************/}
      {gameState === GameState.init && (
        <div className="game-options">
          <h2>What would you like to do?</h2>
          <button
            onClick={() => setGameState(GameState.join)}
            className={"game-action"}
          >
            Join A Game?
          </button>
          <button onClick={setAdminMode} className={"game-action"}>
            Host A Game?
          </button>
        </div>
      )}
      {/********************************   LOBBY  **************************/}
      {gameState === GameState.lobby && <Lobby />}

      {/********************************   END   **************************/}
      {gameState === GameState.end && (
        <Fragment>
          <h2>YEY</h2>
          <h2>Submitting your Score !</h2>
          {users && <ScoreBoard data={users}></ScoreBoard>}
        </Fragment>
      )}
      {/********************************   JOIN   **************************/}
      {gameState === GameState.join && (
        <div className="game-options">
          <input
            type="number"
            className="join-input"
            value={gameId}
            onBlur={(e) => setGameId(parseInt(e.target.value))}
            placeholder={"Game Id"}
          />
          <input
            type="text"
            className="join-input"
            onChange={(e) => setUser(e.target.value)}
            placeholder={"Name"}
          />
          <button onClick={(e) => join()} className={"game-action"}>
            JOIN
          </button>
        </div>
      )}
      {gameState === GameState.create && (
        <GameOptions onOptionsSet={(data) => saveGame(data)}></GameOptions>
      )}

      {/*******************************  PLAYING / CREATE / LOBBY *************************/}
      {(gameState === GameState.playing || gameState === GameState.lobby) &&
        boardData &&
        gameId && (
          <Fragment>
            <h3>Play Board</h3>
            <div className="App">
              {gameId && <h3>{`Game Id:${gameId}`}</h3>}
              <Board
                boardData={boardData}
                interactive={true}
                onStarted={() => {
                  setTimerStarted(true);
                }}
                onEnded={() => {
                  setTimerStarted(false);
                  setGameState(GameState.end);
                }}
              />
              <h3>Target Board</h3>
              <Board boardData={boardData} interactive={false}></Board>
            </div>
            <div>
              {userType === UserTypes.admin && (
                <Fragment>
                  {users && <ScoreBoard data={users}></ScoreBoard>}{" "}
                  {/*<button className="control-button save-game" onClick={saveGame}>save t game</button>*/}
                  <button
                    className="control-button start-game"
                    onClick={startGame}
                  >
                    Start Game To All
                  </button>
                  <button className="control-button end-game" onClick={endGame}>
                    End Game To All
                  </button>
                  {qrPreview && gameId && (
                    <img
                      className="qr-code"
                      onClick={() => {
                        setQrPreview(false);
                      }}
                      src={`https://chart.googleapis.com/chart?chs=400x400&cht=qr&chl=http://projects.kaltura.com/eitan/slider/index.html?game=${gameId}&choe=UTF-8`}
                    />
                  )}
                </Fragment>
              )}
            </div>
          </Fragment>
        )}
    </Fragment>
  );
}

export default App;

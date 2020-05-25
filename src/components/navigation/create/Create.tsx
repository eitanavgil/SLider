import React, { Fragment, useEffect, useState } from "react";
import { convertToBoardData, generateBoard } from "../../../utils/logic";
import { shuffleArray } from "../../../utils/Utils";
import GameBoard from "../../boards/GameBoard/GameBoard";
import { cloneDeep } from "lodash";
import { FirebaseService } from "../../../utils/firebaseService";
import { Redirect } from "react-router-dom";
import "./Create.css";

export const GameDifficulty = {
  0: { index: 0, dimensions: { x: 3, y: 3 }, colors: 2, name: "Easy" },
  1: { index: 1, dimensions: { x: 4, y: 3 }, colors: 3, name: "Normal" },
  2: { index: 2, dimensions: { x: 4, y: 4 }, colors: 4, name: "Hard" },
  3: { index: 3, dimensions: { x: 5, y: 5 }, colors: 5, name: "Hardest" },
};

let fb: FirebaseService;

// join a game by id or show generic board with an option to type the game id manually
const Create = (props: any) => {
  const [gameId, setGameId] = useState();
  const [boardData, setBoardData] = useState();
  const [difficulty, setdDifficulty] = useState(GameDifficulty["0"]);

  useEffect(() => {
    const sp = new URLSearchParams(props.location.search);
    // todo - handle authentication later
    fb = new FirebaseService();
  }, []);

  const upload = () => {
    fb.createGame(boardData.target, boardData.scrambled)
      .then((gameId) => {
        console.log(">>>> gameId", gameId);
        setGameId(gameId);
      })
      .catch(() => {
        console.log(">>>> FAILED");
      });
  };
  const generate = () => {
    let nextGameIndex = difficulty.index + 1;
    if (nextGameIndex === 4) {
      nextGameIndex = 0;
    }
    const selectedGameOptions = difficulty;
    // @ts-ignore
    const dimensions = selectedGameOptions.dimensions;
    const colors = selectedGameOptions.colors;
    const newBoard = generateBoard(dimensions, colors);
    const gameData = {
      target: convertToBoardData(newBoard),
      scrambled: shuffleArray(convertToBoardData(newBoard)),
    };
    setBoardData(null);
    setTimeout(() => {
      setBoardData(cloneDeep(gameData));
      // @ts-ignore
      setdDifficulty(GameDifficulty[nextGameIndex.toString()]);
    }, 0);
  };

  return (
    <Fragment>
      {gameId && (
        <a href={`/manage?game=${gameId}`} target="_blank">
          Manage game: {gameId}
        </a>
      )}
      {gameId && (
        <a href={`/play?game=${gameId}`} target="_blank">
          Play game {gameId}
        </a>
      )}
      {/*{gameId && <Redirect to={`/manage/?game=${gameId}`} />}*/}
      <h2 className={"h2 title"}>Create A New Game</h2>
      <button className={"player-button"} onClick={generate}>
        {`Generate ${difficulty.name} Game`}
      </button>
      <button
        disabled={!boardData}
        className={"player-button upload-button"}
        onClick={upload}
      >
        Upload !
      </button>
      <div className={"spacer"} />
      {boardData && (
        <Fragment>
          <GameBoard
            createMode={true}
            target={boardData.target}
            scrambled={boardData.scrambled}
          />
        </Fragment>
      )}
    </Fragment>
  );
};

export default Create;

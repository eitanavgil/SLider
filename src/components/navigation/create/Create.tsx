import React, { Fragment, useEffect, useState } from "react";
import { convertToBoardData, generateBoard } from "../../../utils/logic";
import { shuffleArray } from "../../../utils/Utils";
import GameBoard from "../../boards/GameBoard/GameBoard";
import { cloneDeep } from "lodash";
import { FirebaseService } from "../../../utils/firebaseService";
import { Redirect } from "react-router-dom";

export const GameDifficulty = {
  0: { dimensions: { x: 3, y: 3 }, colors: 2 },
  1: { dimensions: { x: 4, y: 3 }, colors: 3 },
  2: { dimensions: { x: 4, y: 4 }, colors: 4 },
  3: { dimensions: { x: 5, y: 5 }, colors: 5 },
};

let fb: FirebaseService;

// join a game by id or show generic board with an option to type the game id manually
const Create = (props: any) => {
  const [gameId, setGameId] = useState();
  const [boardData, setBoardData] = useState();
  const [difficultyIndex, setdDifficultyIndex] = useState(-1);

  useEffect(() => {
    const sp = new URLSearchParams(props.location.search);
    // todo - handle authentication later
    fb = new FirebaseService();
  }, []);

  const upload = () => {
    fb.createGame(boardData.target, boardData.scrambled)
      .then((gameid) => {
        setGameId(gameid);
      })
      .catch(() => {
        console.log(">>>> FAILED");
      });
  };
  const generate = () => {
    let nextGame = difficultyIndex + 1;
    if (nextGame === 4) {
      nextGame = 0;
    }
    // @ts-ignore
    const selectedGameOptions = GameDifficulty[nextGame]!;
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
      setdDifficultyIndex(nextGame);
    }, 0);
  };

  return (
    <Fragment>
      {gameId && <Redirect to={`/manage/?game=${gameId}`} />}

      <h2>Create A New Game</h2>
      <button className={"player-button"} onClick={generate}>
        Generate
      </button>
      <div className={"spacer"} />
      <button
        disabled={!boardData}
        className={"player-button"}
        onClick={upload}
      >
        Upload
      </button>
      {boardData && (
        <Fragment>
          <GameBoard
            target={boardData.target}
            scrambled={boardData.scrambled}
          />
        </Fragment>
      )}
    </Fragment>
  );
};

export default Create;

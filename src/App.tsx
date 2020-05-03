import "./App.css";
import {convertToBoardData} from "./utils/logic";
import Board, {boardItemData} from "./components/boards/Board/Board";
import React, {Fragment, useEffect, useState, useRef} from "react";
import Timer from "./components/Timer/Timer";
import {shuffleArray} from "./utils/Utils";
import {FirebaseService} from "./utils/firebaseService";
// import joinGame from "./utils/firebase";

const board: number[][] = [
    [4, 5, 1],
    [2, 0, 3],
    [3, 1, 4],
];
const board1: number[][] = [
    [4, 5],
    [2, 0],
];
const board2: number[][] = [
    [4, 5, 1, 2, 4],
    [2, 0, 3, 4, 3],
    [4, 1, 2, 5, 2],
    [3, 5, 3, 1, 4],
];
const board3: number[][] = [
    [2, 0, 3, 4],
    [3, 5, 3, 1],
    [4, 5, 1, 2],
];
const board4: number[][] = [
    [2, 0, 3],
    [2, 2, 3],
    [2, 2, 3],
];

export enum GameState {
    "init" = "init",
    "join" = "join",
    "create" = "create",
    "gameInit" = "gameInit",
    "playing" = "playing",
    "end" = "end",
}

export interface gameData {
    target?: boardItemData[][];
    scrambled?: boardItemData[][];
}

let fb: FirebaseService

function App() {
    const gameInput = useRef(null);
    const nameInput = useRef(null);
    const [boardData, setboardData] = useState();
    const [timerStarted, setTimerStarted] = useState(false);
    const [gameState, setGameState] = useState(GameState.init);


    useEffect(() => {
        if (gameState === GameState.init) {
            fb = new FirebaseService();
        }
        if (gameState === GameState.create) {
            fb.createGame(convertToBoardData(board3), shuffleArray(convertToBoardData(board3)));
        }
    }, [gameState]);

    useEffect(() => {
        // Update the document title using the browser API
        // setboardData(convertToBoardData(board2));

        const target = convertToBoardData(board2);
        const scrambled = shuffleArray(target);

    }, []);

    const initGame = () => {
        // setboardData(convertToBoardData(board2));
    }
    const join = () => {
        if (gameInput && (gameInput.current as any).value && fb) {
            if (!fb) {
                return;
            }
            fb.getGameById((gameInput.current as any).value, (data: any): any => {
                // @ts-ignore
                setboardData({
                    target: (data.target as boardItemData[][]),
                    scrambled: (data.scrambled as boardItemData[][])
                })
                setGameState(GameState.gameInit);
            });
        }
    }

    return (
        <Fragment>
            <Timer start={timerStarted}/>
            {gameState === GameState.init &&
            <div className="game-options">
                <h2>What would you like to do?</h2>
                <button onClick={() => setGameState(GameState.join)}
                        className={"game-action"}>Join A Game?
                </button>
                <button onClick={() => setGameState(GameState.create)}
                        className={"game-action"}>Host A Game?
                </button>
            </div>
            }
            {gameState === GameState.end &&
            <h2>YEY</h2>
            }
            {gameState === GameState.join &&
            <div className="game-options">
                <input type="number" className="join-input" ref={gameInput} placeholder={"Game Id"}/>
                <input type="text" className="join-input" ref={nameInput} placeholder={"Name"}/>
                <button onClick={() => join()}
                        className={"game-action"}>JOIN
                </button>
            </div>
            }
            {(gameState === GameState.gameInit || gameState === GameState.playing) && boardData &&
            <Fragment>
                <h2>Play Board</h2>
                <div className="App">
                    {boardData &&
                    <Board boardData={boardData} interactive={true}
                           onStarted={() => {
                               setTimerStarted(true);
                           }}
                           onEnded={() => {
                               setTimerStarted(false);
                               setGameState(GameState.end)
                           }}
                    />
                    }
                </div>
                <div>
                    {boardData &&
                    <Fragment>
                        <h2>Target Board</h2>
                        <Board boardData={boardData} interactive={false}></Board>
                    </Fragment>
                    }
                </div>
            </Fragment>
            }
        </Fragment>
    );
}

export default App;

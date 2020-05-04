import "./App.css";
import {convertToBoardData} from "./utils/logic";
import Board, {boardItemData} from "./components/boards/Board/Board";
import React, {Fragment, useEffect, useState, useRef} from "react";
import Timer from "./components/Timer/Timer";
import {printBoard, shuffleArray} from "./utils/Utils";
import {FirebaseService} from "./utils/firebaseService";
import Lobby from "./components/Lobby/Lobby";

const board1: number[][] = [
    [4, 5, 1],
    [2, 0, 3],
    [3, 1, 4],
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
const board5: number[][] = [
    [3, 0, 3],
    [2, 2, 3],

];

export enum GameState {
    "init" = "init",
    "join" = "join",
    "create" = "create",
    "lobby" = "lobby",
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
    const [boardData, setBoardData] = useState<gameData>();
    const [timerStarted, setTimerStarted] = useState(false);
    const [gameState, setGameState] = useState(GameState.init);
    const [gameId, setGameId] = useState(1);
    const [user, setUser] = useState();
    const [time, SetTime] = useState();


    useEffect(() => {
        if (gameState === GameState.init) {
            fb = new FirebaseService();
        }
        if (gameState === GameState.end) {
        }
        if (gameState === GameState.create) {
            const myBoard = board5;
            setBoardData({
                target: (convertToBoardData(myBoard)),
                scrambled: (shuffleArray(convertToBoardData(myBoard)))
            })
            fb.createGame(convertToBoardData(myBoard), shuffleArray(convertToBoardData(myBoard)), (gameId) => {
                setGameId(gameId);
            });
        }
    }, [gameState]);


    const startGame = () => {
        fb.startGame(gameId);
    }
    const setTimerEnded = (time: string) => {
        fb.submitScore(user, gameId, time)
    }
    const endGame = () => {
        fb.endGame(gameId);
    }
    const join = () => {

        if (gameInput && (gameInput.current as any).value && (nameInput.current as any).value && fb) {
            if (!fb) {
                return;
            }

            setUser((nameInput.current as any).value);
            setGameId((gameInput.current as any).value);

            // add user
            fb.addUserToGame((nameInput.current as any).value, (gameInput.current as any).value, (data: any) => {
                if (data.message) {
                    alert(data.message);
                    return;
                }
                // @ts-ignore
                setBoardData({
                    target: (data.target as boardItemData[][]),
                    scrambled: (data.scrambled as boardItemData[][])
                })
                setGameState(GameState.lobby);
            })

        } else {
            alert("Bot fields are mandatory")
        }
    }

    return (
        <Fragment>
            <Timer start={timerStarted} onEnded={(v) => setTimerEnded(v)}/>
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
            {gameState === GameState.lobby &&
            <Lobby/>
            }

            {gameState === GameState.end &&
            <Fragment>
                <h2>YEY</h2>
                <h2>Submitting your Score !</h2>
            </Fragment>
            }
            {gameState === GameState.join &&
            <div className="game-options">
                <input type="number" className="join-input" value={gameId}
                       ref={gameInput} placeholder={"Game Id"}/>
                <input type="text" className="join-input"
                       ref={nameInput} placeholder={"Name"}/>
                <button onClick={(e) => join()}
                        className={"game-action"}>JOIN
                </button>
            </div>
            }
            {   (gameState === GameState.playing
                || gameState === GameState.create
                || gameState === GameState.lobby) 
                && boardData && gameId &&
            <Fragment>
                <h2>Play Board</h2>
                <div className="App">
                    {gameId && <h3>{`Game Id:${gameId}`}</h3>}
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
                    {gameState === GameState.create &&
                    <Fragment>
                        <button className="control-button start-game" onClick={startGame}>Start Game To All</button>
                        <button className="control-button end-game" onClick={endGame}>End Game To All</button>
                    </Fragment>
                    }

                </div>
            </Fragment>
            }
        </Fragment>
    );
}

export default App;

import "./App.css";
import {convertToBoardData} from "./utils/logic";
import Board from "./components/boards/Board/Board";
import React, {Fragment, useEffect, useState} from "react";
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
    "playing" = "playing",
    "end" = "end",
}

let db: FirebaseService

function App() {

    const [boardData, setboardData] = useState();
    const [timerStarted, setTimerStarted] = useState(false);
    const [gameState, setGameState] = useState(GameState.init);


    useEffect(() => {
        if (gameState === GameState.init) {
            db = new FirebaseService();
        }

        if (gameState === GameState.join) {
            db.getGameById("167");
        }

        if (gameState === GameState.create) {
            db.createGame(convertToBoardData(board4), shuffleArray(convertToBoardData(board4)));
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
        // @ts-ignore
        // firebase.firestore().collection("games")
        // .where("gameId", "==", "167").get()
        // .then((snapshot) => {
        //     // snapshot.docs.forEach(doc => {
        //     //     if (doc.data() && doc.data().board) {
        //     //         console.log(">>>> doc", JSON.parse(doc.data().board))
        //     //     }
        //     // })
        // })
    }

    return (
        <Fragment>

            <h2>What would you like to do?</h2>
            {gameState === GameState.init &&
            <div className="game-options">
                <button onClick={() => setGameState(GameState.join)}
                        className={"game-action"}>Join A Game?
                </button>
                <button onClick={() => setGameState(GameState.create)}
                        className={"game-action"}>Host A Game?
                </button>
            </div>
            }
            {gameState === GameState.join &&
            <div className="game-options">
                <input type="text" className="join-input"/>
                <button onClick={() => join()}
                        className={"game-action"}>JOIN
                </button>
            </div>
            }

            {/*<h2>Play Board</h2>*/}
            {/*<Timer start={timerStarted}/>*/}
            {/*<div className="App">*/}
            {/*    {boardData && gameState !== GameState.end &&*/}
            {/*    <Board boardData={boardData} interactive={true}*/}
            {/*           onStarted={() => {*/}
            {/*               setTimerStarted(true);*/}
            {/*           }}*/}
            {/*           onEnded={() => {*/}
            {/*               setGameState(GameState.end)*/}
            {/*               setTimerStarted(false);*/}
            {/*           }}*/}
            {/*    />*/}
            {/*    }*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*    {boardData && gameState !== GameState.end &&*/}
            {/*    <Fragment>*/}
            {/*        <h2>Target Board</h2>*/}
            {/*        /!*<Board boardData={boardData} interactive={false}></Board>*!/*/}
            {/*    </Fragment>*/}
            {/*    }*/}
            {/*</div>*/}
        </Fragment>
    );
}

export default App;

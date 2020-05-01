import "./App.css";
import {convertToBoardData} from "./utils/logic";
import Board from "./components/boards/Board/Board";
import React, {Fragment, useEffect, useState} from "react";
import Timer from "./components/Timer/Timer";


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

function App() {

    const [boardData, setboardData] = useState();
    const [timerStarted, setTimerStarted] = useState(false);

    useEffect(() => {
        // Update the document title using the browser API
        setboardData(convertToBoardData(board1));
    }, []);

    return (
        <Fragment>
            <h2>Play Board</h2>
            <Timer start={timerStarted}/>
            <div className="App">
                {boardData &&
                <Board boardData={boardData} interactive={true}
                       onStarted={() => {
                           setTimerStarted(true);
                       }}
                       onEnded={() => {
                           setTimerStarted(false);
                       }}
                />
                }
            </div>
            <h2>Target Board</h2>
            <div className="App">
                {boardData && <Board boardData={boardData} interactive={false}></Board>}
            </div>
        </Fragment>
    );
}

export default App;

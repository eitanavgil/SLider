import React, {Fragment} from "react";
import "./App.css";
import Board from "./components/boards/Board/Board";
import {cloneArray} from "./utils/Utils";

const board: number[][] = [
    [0, 2, 5, 1, 3],
    [2, 5, 9, 3, 4],
    [2, 4, 1, 5, 5],
];

export interface boardItem {
    index: number;
    value: number;
}

function App() {
    return (
        <Fragment>
            <h2>Play Board</h2>
            <div className="App">
                <Board boardData={board} interactive={true}></Board>
            </div>
            <hr></hr>
            <h2>Target Board</h2>
            <div className="App">
                <Board boardData={board}></Board>
            </div>
        </Fragment>
    );
}

export default App;

import React, {Fragment} from "react";
import "./App.css";
import Board from "./components/boards/Board/Board";

const board: number[][] = [
    [0, 0, 1, 1],
    [2, 2, 9, 3],
    [4, 4, 5, 5],
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

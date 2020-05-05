import React, {useState} from "react";
import "./GameOptions.css";

export interface gameOptions {
    x: number;
    y: number;
    colors: number;
}

export interface props {
    onOptionsSet: (options: gameOptions) => void;
}

const GameOptions = (props: props) => {

    const [cols, setCols] = useState(2);
    const [rows, setRows] = useState(3);
    const [colors, setColors] = useState(3);

    const create = () => {
        if (!cols || !rows || !colors) {
            return;
        }
        props.onOptionsSet({x: cols, y: rows, colors: colors})
    }

    return (
        <div className="lobby">
            <div className="game-options">
                <h4>Columns</h4>
                <input min={3} max={5} type="number" className="settings-input"
                       placeholder={"Max:5"}
                       onChange={(e) => setCols(parseInt(e.target.value))}/>
                <h4>Rows</h4>
                <input min={2} max={5} type="number" className="settings-input"
                       placeholder={"Max:5"}
                       onChange={(e) => setRows(parseInt(e.target.value))}/>
                <h4>#Colors</h4>
                <input min={2} max={5} type="number" className="settings-input"
                       placeholder={"Max:5"}
                       onChange={(e) => setColors(parseInt(e.target.value))}/>
                <button onClick={(e) => create()}
                        className={"game-action"}>Create
                </button>
            </div>
        </div>
    )
        ;
};
export default GameOptions;

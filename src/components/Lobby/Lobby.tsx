// @ts-nocheck
import React, {useEffect, useState} from "react";
import "./Lobby.css";

export interface props {

}


const defaultProps: props = {};

const Lobby = (props: props) => {
    return (
        <div className="lobby">
            <div className="lobby-inner">
                <h2>Lobby</h2>
                <span className="lobby-text">Game will start soon.</span>
                <span className="lobby-text">Stop Watch begins on first move</span>
                {/*<span className="lobby-text">firebase/games/sliders/</span>*/}
                {/*<span className="lobby-text">&nbsp;&nbsp; 1</span>*/}
                {/*<span className="lobby-text">&nbsp;&nbsp;&nbsp;&nbsp; target</span>*/}
                {/*<span className="lobby-text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [1,3,5]</span>*/}
                {/*<span className="lobby-text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [2,0,3]</span>*/}
                {/*<span className="lobby-text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [2,4,4]</span>*/}
                {/*<span className="lobby-text">&nbsp;&nbsp;&nbsp;&nbsp; target</span>*/}
                {/*<span className="lobby-text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [1,3,5]</span>*/}
                {/*<span className="lobby-text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [2,0,3]</span>*/}
                {/*<span className="lobby-text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [2,4,4]</span>*/}
                {/*<span className="lobby-text">&nbsp;&nbsp;&nbsp;&nbsp; names:</span>*/}
                {/*<span className="lobby-text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Jimmy</span>*/}
                {/*<span className="lobby-text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Bobby</span>*/}
                {/*<span className="lobby-text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Rachel</span>*/}
                {/*<span className="lobby-text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Will</span>*/}
            </div>
        </div>
    );
};
Lobby.defaultProps = defaultProps;
export default Lobby;

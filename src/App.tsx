import React, { Fragment, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./App.css";

import Home from "./components/navigation/home/Home";
import Create from "./components/navigation/create/Create";
import Manage from "./components/navigation/manage/Manage";
import Player from "./components/navigation/player/Player";
import { FirebaseService } from "./utils/firebaseService";

export enum GameState {
  "init" = "init",
  "join" = "join",
  "create" = "create",
  "push" = "push",
  "lobby" = "lobby",
  "playing" = "playing",
  "end" = "end",
}

let fb: FirebaseService;

function App() {
  const [db, setDb] = useState();

  useEffect(() => {}, []);

  return (
    <Router>
      <main className={"main"}>
        <nav>
          <ul className={"nav-list"}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/play?game=44">play</Link>
            </li>
            <li>
              <Link to="/create?token=12ws3">create</Link>
            </li>
            <li>
              <Link to="/manage?token=27uwyh&game=123">manage</Link>
            </li>
          </ul>
        </nav>
        <div className={"router-body"}>
          <div className={"inner-router"}>
            <Route path="/" exact component={Home} />
            <Route path="/play" component={Player} />
            <Route path="/create" component={Create} />
            <Route path="/manage" component={Manage} />
          </div>
        </div>
      </main>
    </Router>
  );
}

export default App;

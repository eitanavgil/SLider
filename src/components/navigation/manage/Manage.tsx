import React, { Fragment, useEffect, useState } from "react";

// join a game by id or show generic board with an option to type the game id manually
const Manage = (props: any) => {
  const [gameId, setGameId] = useState();

  useEffect(() => {
    console.log(">>>> props", props);
    const sp = new URLSearchParams(props.location.search);
    setGameId(sp.get("token"));
  }, []);

  return (
    <Fragment>
      <h1>Manage {gameId}</h1>
    </Fragment>
  );
};

export default Manage;

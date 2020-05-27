import React, { useState } from "react";
import "./Home.css";
enum stateTypes {
  state1,
  state2,
}
function Home() {
  const greeting = "HOME";
  return <h1>{greeting}</h1>;
}
export default Home;

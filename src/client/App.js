import React from "react";

import ListContainer from "./components/ListContainer";
import Dock from "./components/Dock";

export function App() {
  return (
    <div id='react'>
      <div id="header">
        <div id="title">LANCER</div>
      </div>
      <Dock></Dock>
      <ListContainer></ListContainer>
    </div>
  );
}

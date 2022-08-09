import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import "../../public/styles.scss";

import { BrowserRouter } from "react-router-dom";

const appElement = document.getElementById("app");

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  appElement
);

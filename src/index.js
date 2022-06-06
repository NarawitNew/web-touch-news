import ContextProider from "./context";
import React from "react";
import ReactDOM from "react-dom";
import Root from "./Root";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <ContextProider>
      <Root />
    </ContextProider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();

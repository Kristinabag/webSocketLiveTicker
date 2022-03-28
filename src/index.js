import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import WidgetContainer from "./containers/WidgetContainer";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <WidgetContainer />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

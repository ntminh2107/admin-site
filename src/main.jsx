import React from "react";
import ReactDOM from "react-dom/client"; // For React 18+
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./redux/store";

// Use the createRoot method for React 18+
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app wrapped with BrowserRouter and Provider
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);

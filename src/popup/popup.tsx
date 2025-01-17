import React from "react";
import ReactDOM from "react-dom/client";

import PopupLayout from "./components/PopupLayout/PopupLayout";

import "./styles/popup.scss";

const App: React.FC = () => {
  return <PopupLayout />;
};

const container = document.createElement("div");
container.id = "root";
document.body.appendChild(container);

const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

export default App;

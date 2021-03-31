import React from "react";
import "./styles/App.scss";
import { useDataLayerValue } from "./DataLayer";
import Site from "./pages/Site";
import Login from "./components/Login";

function App() {
  const [{ user_login }] = useDataLayerValue();
  return <div className="app">{user_login ? <Site /> : <Login />}</div>;
}

export default App;

import React from "react";
import "./styles/App.scss";
import { useDataLayerValue } from "./DataLayer";
import UnknownPerson from "./components/UnknownPerson";
import Site from "./components/Site";

function App() {
  const [{ user_login }] = useDataLayerValue();
  return <div className="app">{user_login ? <Site /> : <UnknownPerson />}</div>;
}

export default App;

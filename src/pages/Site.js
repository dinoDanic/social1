import React, { lazy, Suspense } from "react";
import "../styles/Site.scss";
import Posts from "./Posts";
import Sidebar from "../components/Sidebar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Acc from "./Acc";
import { AnimatePresence } from "framer-motion";

const posts = lazy(() => import("./Posts"));
const acc = lazy(() => import("./Acc"));

function Site() {
  return (
    <div className="site">
      <Router>
        <Route
          render={({ location }) => (
            <Suspense fallback={<h1>Loading...</h1>}>
              <div className="sec1">
                <Sidebar />
              </div>
              <div className="sec2">
                <AnimatePresence exitBeforeEnter initial={false}>
                  <Switch location={location} key={location.pathname}>
                    <Route path="/" exact component={Posts} />
                    <Route path="/acc" exact component={Acc} />
                  </Switch>
                </AnimatePresence>
              </div>
              {/* <div className="sec3"></div> */}
            </Suspense>
          )}
        />
      </Router>
    </div>
  );
}

export default Site;

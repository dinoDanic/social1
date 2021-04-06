import React, { lazy, Suspense } from "react";
import "../styles/Site.scss";
import Sidebar from "../components/Sidebar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import UserProfile from "./UserProfile";
import Buddys from "../components/Buddys";
import Notifications from "../components/Notifications";

const posts = lazy(() => import("./Posts"));
const acc = lazy(() => import("./Acc"));
const findBuddies = lazy(() => import("./FindBuddies"));

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
                    <Route path="/" exact component={posts} />
                    <Route path="/acc" exact component={acc} />
                    <Route path="/acc" exact component={acc} />
                    <Route path="/findbuddies" exact component={findBuddies} />
                    <Route path={["/user/:id", "/"]} component={UserProfile} />
                  </Switch>
                </AnimatePresence>
              </div>
              <div className="sec3">
                <Notifications />
                <Buddys />
              </div>
            </Suspense>
          )}
        />
      </Router>
    </div>
  );
}

export default Site;

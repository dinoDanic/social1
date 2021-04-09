import React, { lazy, Suspense } from "react";
import "../styles/Site.scss";
import Sidebar from "../components/Sidebar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Notifications from "../components/Notifications";
import Buddys from "../components/Buddys";
import UserProfile from "./UserProfile";
import FindBuddies from "./FindBuddies";
import Posts from "./Posts";
import Acc from "./Acc";
import BigPost from "../components/BigPost";

/* const posts = lazy(() => import("./Posts"));
const acc = lazy(() => import("./Acc"));
const findBuddies = lazy(() => import("./FindBuddies")); */

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
                    <Route path={["/post/:id", "/"]} exact component={Posts} />
                    <Route path="/acc" exact component={Acc} />
                    <Route exact path="/findbuddies" component={FindBuddies} />
                    <Route exact path={["/user/:id"]} component={UserProfile} />
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
  /* return (
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
                    <Route path={["/post/:id", "/"]} exact component={Posts} />
                    <Route path="/acc" exact component={Acc} />
                    <Route path="/findbuddies" exact component={FindBuddies} />
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
  ); */
}

export default Site;

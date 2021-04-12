import React, { Suspense, useEffect, useState } from "react";
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
import PlayCircleFilledOutlinedIcon from "@material-ui/icons/PlayCircleFilledOutlined";
import MenuIcon from "@material-ui/icons/Menu";
import { Button } from "@material-ui/core";

function Site() {
  const [sidebarSmall, setSidebarSmall] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [sidebarButtonShow, setSidebarButtonShow] = useState(false);

  useEffect(() => {
    if (width < 1200 && width > 600) {
      setSidebarSmall(true);
    } else {
      setSidebarSmall(false);
    }
  }, []);

  return (
    <div className="site">
      <Router>
        <Route
          render={({ location }) => (
            <Suspense fallback={<h1>Loading...</h1>}>
              <div
                className={`sec1 ${sidebarSmall ? "sec1__small" : ""} ${
                  sidebarButtonShow ? "sec1-showMenu" : ""
                }`}
              >
                <Sidebar
                  sidebarSmall={sidebarSmall}
                  setSidebarButtonShow={setSidebarButtonShow}
                  sidebarButtonShow={sidebarButtonShow}
                />
                <div
                  className="site__arrow"
                  onClick={() => setSidebarSmall(!sidebarSmall)}
                >
                  <div className={sidebarSmall ? "sec1__arrowActive" : ""}>
                    <PlayCircleFilledOutlinedIcon fontSize="large" />
                  </div>
                </div>
                <div
                  className={`sec1__menuForMobile ${
                    sidebarButtonShow ? "sec1__menuForMobileActive" : ""
                  }`}
                >
                  <Button
                    className={sidebarButtonShow ? "sec1__buttonActive" : ""}
                    variant="outlined"
                    onClick={() => setSidebarButtonShow(!sidebarButtonShow)}
                  >
                    <MenuIcon />
                  </Button>
                </div>
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

import { FunctionalComponent, h } from "preact";
import { Route, Router } from "preact-router";

import Home from "../routes/home";
import Profile from "../routes/profile";
import NotFoundPage from "../routes/notfound";
import Header from "./header";
import Races from "../routes/races";
import Series from "../routes/series";
import Upload from "../routes/upload";
import Footer from "./footer";

const App: FunctionalComponent = () => {
  return (
    <div id="preact_root">
      <Header />
      <Router>
        <Route path="/" component={Home} />
        <Route path="/series/" component={Series} />
        <Route path="/races/:race" component={Races} />
        <Route path="/upload" component={Upload} />
        <Route path="/profile/:user" component={Profile} />
        <NotFoundPage default />
      </Router>
      <Footer />
    </div>
  );
};

export default App;

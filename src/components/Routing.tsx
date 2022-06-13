<<<<<<< HEAD
import { FunctionalComponent, h } from "preact"
import Router, { Route } from "preact-router"
import Home from "../routes/home"
import New from "../routes/new"
import Results from "../routes/results"
import Scoring from "../routes/Scoring"
import { RacesList } from "../routes/scoring/RacesList"
import { RaceProperties} from "../routes/scoring/RaceProperties"
import Upload from "../routes/upload"
import { AuthRoute } from "../util/AuthenticatedRoute "
import NotFoundPage from "../routes/notfound";
import { StateUpdater } from "preact/hooks"

interface IRouting {
    
    [x: string | number]: any;
}
const Routing: FunctionalComponent<IRouting> = (props)=>{
// console.log(props);
    return (
        <Router>
          <Route path="/" component={Home} {...props}/>
          <Route path="/new" component={New} {...props} />
          {/* <AuthRoute path="/races/:race" component={Races} {...props} /> */}
          <AuthRoute path="/upload" component={Upload} {...props} />
          <Route path="/results" component={Results} {...props} />
          {/* <AuthRoute
            path="/scoring"
            component={(props) => <Scoring {...props} />}
          /> */}
          <AuthRoute path="/scoring" component={Scoring} {...props} />
          {/* <Scoring path="/scoring" {...props} /> */}
          <AuthRoute path="/race-properties" component={RaceProperties} {...props} />
          {/* Display RaceList */}
          <AuthRoute
            path="/scoring/:seriesid/"
            component={(props) => <RacesList {...props} />}
          />
          <Route path="/races" component={RacesList} {...props} />

          {/* <AuthRoute
            path="/scoring/:seriesid/:raceid"
            component={(props) => <ScoringSetUp {...props} />}
          /> */}

          <NotFoundPage default />
        </Router>
    )
}
export default Routing
=======
import { FunctionalComponent, h } from "preact";
import Router, { Route } from "preact-router";
import Competitors from "../routes/competitors/Competitors";
import Events from "../routes/events/Events";
import Home from "../routes/home";
import NotFoundPage from "../routes/notfound";
import Results from "../routes/results";
import { RaceProperties } from "../routes/scoring/RaceProperties";
import { RacesList } from "../routes/scoring/RacesList";
import Series from "../routes/series/Series";
import Upload from "../routes/upload";
import UserLanding from "../routes/user/UserLanding";
import UserProfile from "../routes/user/UserProfile";
import UserSettings from "../routes/user/UserSettings";
import { AuthRoute } from "../util/AuthenticatedRoute ";
import { SignIn } from "./SignIn";

interface IRouting {
  [x: string | number]: any;
}

const Routing: FunctionalComponent<IRouting> = (props) => {
  // console.log(props);
  return (
    <Router>
      <Route path="/" component={Home} {...props} />

      <Route path="/signin" component={SignIn} {...props} />

      <AuthRoute path="/upload" component={Upload} {...props} />

      <Route path="/results" component={Results} {...props} />

      <AuthRoute path="/series" component={Series} {...props} />

      <AuthRoute
        path="/race-properties"
        component={RaceProperties}
        {...props}
      />

      <AuthRoute path="/races" component={RacesList} {...props} />

      <AuthRoute path="/events" component={Events} {...props} />

      <AuthRoute path="/competitors" component={Competitors} {...props} />

      <AuthRoute path="/user" component={UserLanding} {...props} />

      <AuthRoute path="/user/settings" component={UserSettings} {...props} />

      <AuthRoute path="/user/profile" component={UserProfile} {...props} />

      <NotFoundPage default />
    </Router>
  );
};
export default Routing;
>>>>>>> bba0015782d41309e2b4fa53740d1ca6f1b17d7c

import { FunctionalComponent, h } from "preact";
import Router, { Route } from "preact-router";

import Competitors from "../../routes/competitors/Competitors";
import EventList from "../../routes/events/Event";
import EventEdit from "../../routes/events/EventEdit";
import Events from "../../routes/events/Events";
import Home from "../../routes/home";
import Import from "../../routes/import/Import";
import NotFoundPage from "../../routes/notfound";
import { RaceEdit } from "../../routes/races/RaceEdit";
import Races from "../../routes/races/Races";

import Result from "../../routes/results";
// import Results from "../routes/results";
import Series from "../../routes/series/Series";
import SeriesEdit from "../../routes/series/SeriesEdit";
import UserLanding from "../../routes/user/UserLanding";
import UserProfile from "../../routes/user/UserProfile";
import UserSettings from "../../routes/user/UserSettings";
import { AuthRoute } from "../../util/AuthenticatedRoute ";
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

      <AuthRoute path="/import" component={Import} {...props} />

      <Route path="/result/:seriesId/:raceId/:raceName" component={Result} {...props} />

      <AuthRoute path="/series" component={Series} {...props} />
      <AuthRoute path="/series/edit" component={SeriesEdit} {...props} />

      <AuthRoute path="/events" component={Events} {...props} />
      <AuthRoute path="/events/edit" component={EventEdit} {...props} />
      <AuthRoute path="/events/event" component={EventList} {...props} />

      <AuthRoute path="/races" component={Races} {...props} />
      <AuthRoute path="/races/edit" component={RaceEdit} {...props} />

      <AuthRoute path="/competitors" component={Competitors} {...props} />

      <AuthRoute path="/user" component={UserLanding} {...props} />
      <AuthRoute path="/user/settings" component={UserSettings} {...props} />
      <AuthRoute path="/user/profile" component={UserProfile} {...props} />

      <NotFoundPage default />
    </Router>
  );
};
export default Routing;

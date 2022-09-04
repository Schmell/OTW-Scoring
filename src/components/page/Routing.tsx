import { createContext, h } from "preact";
import { FC } from "preact/compat";

import Router, { Route } from "preact-router";
import { StateUpdater, useMemo, useState } from "preact/hooks";
import useStorage from "../../hooks/useStorage";

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

const Routing: FC<IRouting> = (props) => {
  return (
    <Router>
      <Route path="/" component={Home} {...props} />

      <Route path="/signin" component={SignIn} {...props} />

      {/* <RacesCtx.Provider value={racesContextProvider}> */}
      <Route path="/import" component={Import} {...props} />
      <Route
        path="/result/:seriesId/:raceId/:raceName"
        component={Result}
        {...props}
      />
      {/* </RacesCtx.Provider> */}

      <Route path="/series" component={Series} {...props} />
      <Route path="/series/edit" component={SeriesEdit} {...props} />

      <AuthRoute path="/events" component={Events} {...props} />
      <AuthRoute path="/events/edit" component={EventEdit} {...props} />
      <AuthRoute path="/events/event" component={EventList} {...props} />

      <Route path="/races" component={Races} {...props} />
      <Route path="/races/edit" component={RaceEdit} {...props} />

      <Route path="/competitors" component={Competitors} {...props} />

      <Route path="/user" component={UserLanding} {...props} />
      <Route path="/user/settings" component={UserSettings} {...props} />
      <Route path="/user/profile" component={UserProfile} {...props} />

      <NotFoundPage default />
    </Router>
  );
};
export default Routing;

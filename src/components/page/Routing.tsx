import AsyncRoute from "preact-async-route";
import Router, { Route } from "preact-router";
import Home from "../../routes/home";
import NotFoundPage from "../../routes/notfound";

interface RoutingProps {
  [x: string | number]: any;
}

export default function Routing(props) {
  return (
    <Router>
      <Route path="/" component={Home} {...props} />
      <AsyncRoute
        path="/signin"
        getComponent={() =>
          import("../../components/page/SignIn").then(
            (module) => module.default
          )
        }
        {...props}
      />
      <AsyncRoute
        path="/import"
        getComponent={() =>
          import("../../routes/import/Import").then((module) => module.default)
        }
        {...props}
      />
      <AsyncRoute
        path="/result/:seriesId/:raceId/:raceName"
        getComponent={() =>
          import("../../routes/results").then((module) => module.default)
        }
        {...props}
      />
      <AsyncRoute
        path="/series"
        getComponent={() =>
          import("../../routes/series/Series").then((module) => module.default)
        }
        {...props}
      />
      <AsyncRoute
        path="/series/edit"
        getComponent={() =>
          import("../../routes/series/SeriesEdit").then(
            (module) => module.default
          )
        }
        {...props}
      />
      <AsyncRoute
        path="/events"
        getComponent={() =>
          import("../../routes/events/Events").then((module) => module.default)
        }
        {...props}
      />
      <AsyncRoute
        path="/events/edit"
        getComponent={() =>
          import("../../routes/events/EventEdit").then(
            (module) => module.default
          )
        }
        {...props}
      />
      <AsyncRoute
        path="/events/event"
        getComponent={() =>
          import("../../routes/events/Event").then((module) => module.default)
        }
        {...props}
      />
      <AsyncRoute
        path="/races"
        getComponent={() =>
          import("../../routes/races/Races").then((module) => module.default)
        }
        {...props}
      />
      <AsyncRoute
        path="/races/edit"
        getComponent={() =>
          import("../../routes/races/RaceEdit").then((module) => module.default)
        }
        {...props}
      />
      <AsyncRoute
        path="/competitors"
        getComponent={() =>
          import("../../routes/competitors/Competitors").then(
            (module) => module.default
          )
        }
        {...props}
      />
      <AsyncRoute
        path="/user"
        getComponent={() =>
          import("../../routes/user/UserLanding").then(
            (module) => module.default
          )
        }
        {...props}
      />
      <AsyncRoute
        path="/user/settings"
        getComponent={() =>
          import("../../routes/user/UserSettings").then(
            (module) => module.default
          )
        }
        {...props}
      />
      <AsyncRoute
        path="/user/profile"
        getComponent={() =>
          import("../../routes/user/UserProfile").then(
            (module) => module.default
          )
        }
        {...props}
      />
      <NotFoundPage default={true} />
    </Router>
  );
}
// export default Routing;

import { h } from "preact";
import AsyncRoute from "preact-async-route";
import Router, { Route } from "preact-router";
import { useAuthState } from "react-firebase-hooks/auth";
import Home from "../../routes/home";
import NotFoundPage from "../../routes/notfound";
import { auth } from "../../util/firebase-config";
import { SignIn } from "./SignIn";

interface RoutingProps {
  [x: string | number]: any;
}

export default function Routing(props) {
  return (
    <Router onChange={() => {}}>
      <Route path="/" component={Home} {...props} />
      <Route path="/signin" component={SignIn} {...props} />
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
        path="/organizations"
        getComponent={() =>
          import("../../routes/organizations/Organizations").then(
            (module) => module.default
          )
        }
        {...props}
      />
      <AsyncRoute
        path="/organizations/search"
        getComponent={() =>
          import("../../routes/organizations/SearchOrgs").then(
            (module) => module.default
          )
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
        path="/competitors/:seriesId/:compId"
        getComponent={() =>
          import("../../routes/competitors/Comp").then(
            (module) => module.default
          )
        }
        {...props}
      />
      <AsyncRoute
        path="/competitors/:seriesId/"
        getComponent={() =>
          import("../../routes/competitors/Comps").then(
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

      <AsyncRoute
        path="/organization/edit/:orgId"
        getComponent={() =>
          import("../../routes/organizations/OrganizationEdit").then(
            (module) => module.default
          )
        }
        {...props}
      />

      <AsyncRoute
        path="/organization/:orgId"
        getComponent={() =>
          import("../../routes/organizations/Organization").then(
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

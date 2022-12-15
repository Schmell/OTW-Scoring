import { User } from "firebase/auth";
import { Fragment, h } from "preact";
import AsyncRoute from "preact-async-route";
import Router, { Route } from "preact-router";
import { StateUpdater } from "preact/hooks";
import Home from "../../routes/home";
import NotFoundPage from "../../routes/notfound";
import { SignIn } from "./SignIn";

interface RoutingProps {
  user: User | null | undefined;
  setHeaderTitle: StateUpdater<string>;
  headerTitle: string;
  [x: string | number]: any;
}

export default function Routing(props: RoutingProps) {
  // const { user } = props;
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
          import("../../routes/series/SeriesCompact").then(
            (module) => module.default
          )
        }
        {...props}
      />

      <AsyncRoute
        path="/series/edit/:seriesId"
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
        path="/events/edit/:eventId"
        getComponent={() =>
          import("../../routes/events/EventEdit").then(
            (module) => module.default
          )
        }
        {...props}
      />
      <AsyncRoute
        path="/events/event/:eventId"
        getComponent={() =>
          import("../../routes/events/Event").then((module) => module.default)
        }
        {...props}
      />
      <AsyncRoute
        path="/events/search"
        getComponent={() =>
          import("../../routes/events/SearchEvents").then(
            (module) => module.default
          )
        }
        {...props}
      />
      <AsyncRoute
        path="/races/:seriesId"
        getComponent={() =>
          import("../../routes/races/Races").then((module) => module.default)
        }
        {...props}
      />
      <AsyncRoute
        path="/races/:seriesId/edit/:raceId"
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

      <AsyncRoute
        path="/users"
        getComponent={() =>
          import("../../routes/users/Users").then((module) => module.default)
        }
        {...props}
      />

      <NotFoundPage default={true} />
    </Router>
  );
}
// export default Routing;

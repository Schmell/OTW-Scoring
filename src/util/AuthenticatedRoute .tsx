import { h } from "preact";
import { Route } from "preact-router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase-config";
import Unauthed from "../routes/signin";

export function AuthRoute({ component: C, ...props }) {
  const [user] = useAuthState(auth);
  return (
    <Route
      {...props}
      component={(routeProps) =>
        user ? (
          <C {...routeProps} />
        ) : (
          <Route path="/signin" component={Unauthed} />
        )
      }
    />
  );
}
//

import { Fragment, h } from "preact";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../util/firebase-config";
import { EventsList } from "./EventsList";

const Series = (props) => {
  const [user] = useAuthState(auth);

  return (
    <Fragment>
      <EventsList {...props}></EventsList>
    </Fragment>
  );
};

export default Series;

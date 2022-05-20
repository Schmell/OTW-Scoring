import { Fragment, FunctionalComponent, h } from "preact";
import { EventsList } from "./scoring/EventsList";

const Scoring: FunctionalComponent = (props) => {

  return (
    <Fragment>
      <EventsList {...props}></EventsList>
    </Fragment>
  );
};

export default Scoring;

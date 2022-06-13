import { Fragment, h } from "preact";
import { EventsList } from "./scoring/EventsList";

export default function Scoring(
  props: h.JSX.IntrinsicAttributes & { user: any; setHeaderTitle: any }
) {
  return (
    <Fragment>
      <EventsList {...props}></EventsList>
    </Fragment>
  );
}

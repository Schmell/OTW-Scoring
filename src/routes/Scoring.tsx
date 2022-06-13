<<<<<<< HEAD
import { Fragment, FunctionalComponent, h } from "preact";
import { EventsList } from "./scoring/EventsList";

const Scoring: FunctionalComponent = (props) => {
=======
import { Fragment, h } from "preact";
import { EventsList } from "./scoring/EventsList";
>>>>>>> bba0015782d41309e2b4fa53740d1ca6f1b17d7c

export default function Scoring(
  props: h.JSX.IntrinsicAttributes & { user: any; setHeaderTitle: any }
) {
  return (
    <Fragment>
      <EventsList {...props}></EventsList>
    </Fragment>
  );
}

import { Fragment, h } from "preact";

export default function Profile(props) {
  const { user } = props;
  return <Fragment>{user}</Fragment>;
}

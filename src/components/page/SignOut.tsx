import { h } from "preact";
import { Button } from "@chakra-ui/react";
import { auth } from "../../util/firebase-config";

export function SignOut() {
  return (
    auth.currentUser && <Button onClick={() => auth.signOut()}>Sign Out</Button>
  );
}

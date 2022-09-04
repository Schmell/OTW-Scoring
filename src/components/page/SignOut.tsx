import { h } from "preact";
import { Button } from "@chakra-ui/react";
import { auth } from "../../util/firebase-config";

export function SignOut() {
  return (
    auth.currentUser && (
      <Button
        className="sign-out"
        variant="outline"
        colorScheme="blue"
        boxShadow="md"
        mr={3}
        // zIndex="0"
        onClick={() => auth.signOut()}
      >
        Sign Out
      </Button>
    )
  );
}

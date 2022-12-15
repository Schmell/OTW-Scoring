import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { User } from "firebase/auth";
import { collection, query, where } from "firebase/firestore";
import { Fragment, h } from "preact";
import { useEffect } from "preact/hooks";
import { useCollection } from "react-firebase-hooks/firestore";
import { Page } from "../../components/page/Page";
import { db } from "../../util/firebase-config";

interface UsersProps {
  user: User | null | undefined;
  setHeaderTitle: (p: string) => void;
}

export default function Users(props: UsersProps) {
  const { user, setHeaderTitle } = props;
  setHeaderTitle("Users");

  const usersRef = collection(db, "user");
  const usersQuery = query(usersRef, where("uid", "!=", user?.uid));

  const [users, usersLoading, error] = useCollection(usersQuery);
  useEffect(() => {
    users?.docs.forEach((doc) => {
      console.log("doc ", doc.data());
    });
    console.log("error ", error);
    console.log("users ", users?.docs);
  }, []);
  return (
    <Fragment>
      <Page>
        <Box>
          <VStack mt={24}>
            {!usersLoading &&
              users?.docs.map((otherUser) => (
                <Box>
                  <Flex>
                    <Text>{otherUser.data().displayName}</Text>
                    <Text>{otherUser.data().uid}</Text>
                  </Flex>
                </Box>
              ))}
          </VStack>
        </Box>
      </Page>
    </Fragment>
  );
}

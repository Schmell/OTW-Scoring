import {
  Box,
  Container,
  Divider,
  Flex,
  Heading,
  Icon,
  IconButton,
  List,
  ListItem,
  Spinner,
} from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { FadeInSlideRight } from "../../components/animations/FadeSlide";
// import { MdLibraryAdd } from "react-icons/md";
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import {
  query,
  collectionGroup,
  where,
  orderBy,
  collection,
} from "firebase/firestore";
import { db } from "../../util/firebase-config";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { useMemo } from "preact/hooks";

export default function Competitors({ user, setHeaderTitle }) {
  setHeaderTitle("Competitors");
  // trying to get a ref for the users collections
  //   const eventRef = collection(db, "events", )
  const compsQ = query(collectionGroup(db, "comps"), orderBy("boat"));
  const [comps, compsLoading] = useCollection(compsQ);

  if (!compsLoading) {
    console.log("comps: ", comps);
    //
  }

  console.log("events - user: ", user);
  const uniqueComps = useMemo(() => {
    return new Set(
      comps?.docs.map((comp) => {
        return comp.id;
      })
    );
  }, [comps]);
  console.log("uniqueComps: ", uniqueComps);

  return (
    <Fragment>
      <Flex justifyContent="space-between" alignItems="end">
        <FadeInSlideRight>
          <Heading color="blue.400">Select Competitors</Heading>
        </FadeInSlideRight>

        <IconButton
          aria-label="Add Event"
          icon={(<Icon as={AddToPhotosOutlinedIcon} />) as any}
          colorScheme={"blue"}
          variant={"outline"}
          boxShadow={"md"}
        />
      </Flex>

      <Divider mt={3} border="8px" shadow={"inner"} />

      <Container>
        {compsLoading ? (
          <Spinner />
        ) : (
          comps?.docs.map((comp) => (
            <List>
              <ListItem>{comp.data().boat}</ListItem>
            </List>
          ))
        )}
      </Container>
    </Fragment>
  );
}
// export default Competitors;

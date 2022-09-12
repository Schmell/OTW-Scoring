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
  useDisclosure,
} from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { FadeInSlideRight } from "../../components/animations/FadeSlide";
// import { MdLibraryAdd } from "react-icons/md";
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import { collection, doc, getDoc, orderBy, query } from "firebase/firestore";
import { useMemo, useState } from "preact/hooks";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { SiteList } from "../../components/generic/SiteList";
import { db } from "../../util/firebase-config";
import { SiteListButtons } from "../../components/generic/SiteList/SiteListButtons";
import { SiteListItem } from "../../components/generic/SiteList/SiteListItem";
import { SiteListText } from "../../components/generic/SiteList/SiteListText";

const Competitors = ({ user, setHeaderTitle, seriesId, compId }) => {
  setHeaderTitle("Competitors");
  // trying to get a ref for the users collections
  //   const eventRef = collection(db, "events", )
  // const compsQ = query(collectionGroup(db, "comps"), orderBy("boat"));
  const seriesRef = doc(db, "series", seriesId);
  const compsRef = query(collection(seriesRef, "comps"), orderBy("boat"));
  const [comps, compsLoading] = useCollection(compsRef);
  const [series] = useDocument(seriesRef);

  // const compRef = doc(compsRef, compId);
  // const [comp, compLoading] = useDocument(compRef);

  const deleteCompDisclosure = useDisclosure();

  const [compsId, setCompsId] = useState("");

  return (
    <Fragment>
      <Flex justifyContent="space-between" mx={4} my={4}>
        <FadeInSlideRight>
          <Heading color="blue.400">{series?.data()?.event}</Heading>
        </FadeInSlideRight>

        <IconButton
          aria-label="Add Event"
          icon={(<Icon as={AddToPhotosOutlinedIcon} />) as any}
          colorScheme={"blue"}
          variant={"outline"}
          boxShadow={"md"}
        />
      </Flex>

      <Divider my={4} border={4} />

      <Container>
        <Fragment>
          <SiteList loading={compsLoading}>
            {comps?.docs.map((comp) => (
              <SiteListItem
                key={comp.id}
                item={comp}
                disclosure={deleteCompDisclosure}
                listType="competitor"
              >
                <SiteListText
                  item={comp}
                  setStorage={setCompsId}
                  forward={`competitors/${seriesId}/${comp.id}`}
                  textItems={{
                    head: comp.data().boat,
                    sub: comp.data().helmname,
                    foot: `Rating: ${comp.data().rating}  Fleet: ${
                      comp.data().fleet || comp.data().division
                    }`,
                  }}
                >
                  <SiteListButtons
                    setStorage={setCompsId}
                    item={comp}
                    listType="comps"
                    disclosure={deleteCompDisclosure}
                  >
                    <Box>
                      This will delete the competitor and is not undo-able
                    </Box>
                    <Box>
                      You will loose any work you have done with this Competitor
                    </Box>
                  </SiteListButtons>
                </SiteListText>
              </SiteListItem>
            ))}
          </SiteList>
        </Fragment>
      </Container>
    </Fragment>
  );
};
export default Competitors;

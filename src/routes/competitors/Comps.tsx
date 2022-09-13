import {
  Box,
  Divider,
  Flex,
  Heading,
  Icon,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { useState } from "preact/hooks";
import { collection, doc, orderBy, query } from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { db } from "../../util/firebase-config";
import { SiteList } from "../../components/generic/SiteList";
import { SiteListButtons } from "../../components/generic/SiteList/SiteListButtons";
import { SiteListItem } from "../../components/generic/SiteList/SiteListItem";
import { SiteListText } from "../../components/generic/SiteList/SiteListText";
import { FadeInSlideRight } from "../../components/animations/FadeSlide";
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";

export default function Competitors({ setHeaderTitle, seriesId }) {
  setHeaderTitle("Competitors");

  const seriesRef = doc(db, "series", seriesId);
  const compsRef = query(collection(seriesRef, "comps"), orderBy("boat"));
  const [comps, compsLoading] = useCollection(compsRef);
  const [series] = useDocument(seriesRef);

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
                <Box>This will delete the competitor and is not undo-able</Box>
                <Box>
                  You will loose any work you have done with this Competitor
                </Box>
              </SiteListButtons>
            </SiteListText>
          </SiteListItem>
        ))}
      </SiteList>
    </Fragment>
  );
}

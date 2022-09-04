import { Box, Divider, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { collection, doc, query, updateDoc, where } from "firebase/firestore";
import { Fragment, h } from "preact";
import { route } from "preact-router";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import { FadeInSlideLeft, FadeInSlideRight } from "../../components/animations/FadeSlide";
import { AreYouSure } from "../../components/generic/AreYouSure";
import { SiteList } from "../../components/generic/SiteList";
import { SiteListButtons } from "../../components/generic/SiteList/SiteListButtons";
import { SiteListItem } from "../../components/generic/SiteList/SiteListItem";
import { SiteListText } from "../../components/generic/SiteList/SiteListText";
import useStorage from "../../hooks/useStorage";
import { db } from "../../util/firebase-config";
import AddSeriesModal from "./AddSeriesModal";
// Icons
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import EditIcon from "@mui/icons-material/Edit";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import ToolIconBtn from "../../components/generic/ToolIconBtn";

export default function EventList({ setHeaderTitle }) {
  setHeaderTitle("Event");

  const [eventId] = useStorage("eventId");
  const [_seriesId, setSeriesId] = useStorage("seriesId");

  const colRef = collection(db, "series");
  const seriesQuery = query(colRef, where("__event", "==", eventId));

  const [series, seriesLoading] = useCollection(seriesQuery);

  const removeSeries = async (id: any) => {
    // Uses cloud function to remove any sub-collections
    await updateDoc(doc(db, "series", id), { __event: "" });
  };
  const docRef = doc(db, "events", eventId);
  const [eventDoc, eventDocLoading] = useDocumentData(docRef);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteEventDisclosure = useDisclosure();

  return (
    <Fragment>
      {!eventDocLoading && eventDoc && (
        <Fragment>
          <Flex justifyContent="space-between" alignItems="end" px={4}>
            <FadeInSlideRight>
              <Heading as="h4" color="blue.400">
                {eventDoc.name}
              </Heading>
            </FadeInSlideRight>

            {/* Sub header buttons */}
            <FadeInSlideLeft>
              <Flex gap={2}>
                <ToolIconBtn label="Edit Event Details" action={() => route("/events/edit")} icon={EditIcon} />
                <ToolIconBtn label="Import file" action={() => route("/import")} icon={FileUploadOutlinedIcon} />
                <ToolIconBtn label="Add Series" action={onOpen} icon={AddToPhotosOutlinedIcon} />
              </Flex>
            </FadeInSlideLeft>

            <AddSeriesModal isOpen={isOpen} onClose={onClose} eventId={eventId} />
          </Flex>

          <Divider my={3} border={2} shadow={"md"} />

          <SiteList loading={seriesLoading}>
            {series?.docs.map((item) => {
              // console.log("item: ", item.data());
              return (
                <SiteListItem key={item.id} item={item} disclosure={deleteEventDisclosure} listType="series">
                  <SiteListText
                    item={item}
                    setStorage={setSeriesId}
                    forward="races"
                    textItems={{ head: item.data().event, sub: item.data().venue, foot: item.data().venuewebsite }}
                  >
                    <SiteListButtons
                      setStorage={setSeriesId}
                      item={item}
                      listType="series"
                      disclosure={deleteEventDisclosure}
                    />
                  </SiteListText>
                  <AreYouSure disclosure={deleteEventDisclosure} callback={removeSeries} itemId={item.id} risk="low">
                    <Box>This action will remove this series from the event</Box>
                    <Box>You can always add this back if you want</Box>
                  </AreYouSure>
                </SiteListItem>
              );
            })}
          </SiteList>
        </Fragment>
      )}
    </Fragment>
  );
}

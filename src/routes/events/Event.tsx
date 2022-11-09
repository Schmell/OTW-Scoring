import { Box, useDisclosure } from "@chakra-ui/react";
import { collection, doc, query, updateDoc, where } from "firebase/firestore";
import { Fragment, h } from "preact";
import { route } from "preact-router";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
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
import { Page } from "../../components/page/Page";
import PageHead from "../../components/page/pageHead";
import ToolIconButton from "../../components/generic/ToolIconButton";
import UserLanding from "../user/UserLanding";
import FollowButtons from "../../components/generic/FollowButtons";

export default function EventList({ setHeaderTitle, user }) {
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
    <Page>
      {!eventDocLoading && eventDoc && (
        <Fragment>
          <PageHead title={eventDoc.name}>
            <ToolIconButton
              aria-label="Edit Event Details"
              icon={EditIcon}
              onClick={() => route("/events/edit")}
            />
            <ToolIconButton
              aria-label="Import file"
              icon={FileUploadOutlinedIcon}
              onClick={() => route("/import")}
            />
            <ToolIconButton
              aria-label="Add Series"
              icon={AddToPhotosOutlinedIcon}
              onClick={onOpen}
            />
          </PageHead>

          <AddSeriesModal isOpen={isOpen} onClose={onClose} eventId={eventId} />

          <SiteList loading={seriesLoading}>
            {series?.docs.map((item) => {
              return (
                <Fragment>
                  {item.data().__owner === user?.uid ? (
                    <SiteListItem
                      key={item.id}
                      item={item}
                      disclosure={deleteEventDisclosure}
                      listType="series"
                    >
                      <SiteListText
                        item={item}
                        setStorage={setSeriesId}
                        forward="races"
                        textItems={{
                          head: item.data().event,
                          sub: item.data().venue,
                          foot: item.data().venuewebsite,
                        }}
                      >
                        <SiteListButtons
                          setStorage={setSeriesId}
                          item={item}
                          listType="series"
                          disclosure={deleteEventDisclosure}
                        />
                      </SiteListText>
                      <AreYouSure
                        disclosure={deleteEventDisclosure}
                        callback={removeSeries}
                        itemId={item.id}
                        risk="low"
                      >
                        <Box>
                          This action will remove this series from the event
                        </Box>
                        <Box>You can always add this back if you want</Box>
                      </AreYouSure>
                    </SiteListItem>
                  ) : (
                    <FollowButtons
                      user={user}
                      data={item}
                      colName="followEvents"
                      variant="ghost"
                    />
                  )}
                </Fragment>
              );
            })}
          </SiteList>
        </Fragment>
      )}
    </Page>
  );
}

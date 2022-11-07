import { Box, useDisclosure, useFocusEffect } from "@chakra-ui/react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { Fragment, h } from "preact";
import { route } from "preact-router";
import { useCollection } from "react-firebase-hooks/firestore";
import useStorage from "../../hooks/useStorage";
import { db } from "../../util/firebase-config";
// Icons
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { SiteList } from "../../components/generic/SiteList";
import { SiteListButtons } from "../../components/generic/SiteList/SiteListButtons";
import { SiteListItem } from "../../components/generic/SiteList/SiteListItem";
import { SiteListText } from "../../components/generic/SiteList/SiteListText";
import ToolIconBtn from "../../components/generic/ToolIconBtn";
import { Page } from "../../components/page/Page";
import PageHead from "../../components/page/pageHead";
import ToolIconButton from "../../components/generic/ToolIconButton";
import { useState } from "react";
import { useEffect } from "preact/hooks";

export default function Events(props) {
  const { user, setHeaderTitle, ...rest } = props;
  setHeaderTitle("Events");
  const [eventId, setEventId] = useStorage("eventId");

  const [pageTitle, setPageTitle] = useState("");

  const colRef = collection(db, "events");
  const ownerEvents = query(colRef, where("__owner", "==", user && user.uid));

  const [events, eventsLoading] = useCollection(ownerEvents);

  const otherPublicEvents = query(
    colRef,
    where("__owner", "!=", user && user.uid),
    where("__public", "==", true)
  );
  const [allEvents, allEventsLoading] = useCollection(otherPublicEvents);

  class FollowEvents {
    constructor(public userId, public eventId, public eventRef) {
      this.userId = userId;
      this.eventId = eventId;
      this.eventRef = eventRef;
    }
    toString() {
      return this.userId + ", " + this.eventId;
    }

    async getEvent() {
      const docRef = doc(db, "events", eventId);
      return getDoc(docRef);
    }
  }

  // Firestore data converter
  const followEventsConverter = {
    toFirestore: (event) => {
      return {
        name: event.name,
        state: event.state,
        country: event.country,
      };
    },
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      return new FollowEvents(data.userId, data.followId, data.followRef);
    },
  };

  const followEventsRef = collection(db, "followEvents");
  const followQuery = query(
    followEventsRef,
    where("userId", "==", user && user.uid)
  ).withConverter(followEventsConverter);
  const [followEvents, followEventsLoading] = useCollection(followQuery);

  useEffect(() => {
    console.log("followEvents ", followEvents);
  }, []);

  const deleteEventDisclosure = useDisclosure();

  const addEventHandler = async () => {
    const docRef = await addDoc(colRef, {
      name: "New event",
      __owner: user.uid,
    });
    setEventId(docRef.id);
    route("/events/edit");
  };

  // const getAllEvents = () => {};

  setPageTitle("Your Events");

  useEffect(() => {}, []);

  return (
    <Fragment>
      <PageHead title="Your Events" loading={eventsLoading}>
        <ToolIconButton
          aria-label="Import file"
          icon={FileUploadOutlinedIcon}
          onClick={() => route("/import")}
        />
        <ToolIconButton
          aria-label="Add Event"
          icon={AddToPhotosOutlinedIcon}
          onClick={addEventHandler}
        />
      </PageHead>
      <Page>
        <SiteList loading={eventsLoading}>
          {events?.docs.map((item) => {
            const data = item.data();
            // setEventId(item.id);
            return (
              <SiteListItem
                key={item.id}
                item={item}
                disclosure={deleteEventDisclosure}
                listType="series"
              >
                <SiteListText
                  item={item}
                  setStorage={setEventId}
                  forward="events/event"
                  textItems={{
                    head: data.name,
                    sub: data.venue,
                    foot: data.date,
                  }}
                >
                  <SiteListButtons
                    setStorage={setEventId}
                    item={item}
                    listType="events"
                    disclosure={deleteEventDisclosure}
                  >
                    <Box>This will delete the event and is not undo-able</Box>
                    <Box>
                      You will loose any work you have done with this Event
                    </Box>
                  </SiteListButtons>
                </SiteListText>
              </SiteListItem>
            );
          })}
          {/* series?.docs.map */}
        </SiteList>
      </Page>
      {allEvents?.docs && (
        <Fragment>
          <PageHead title="Public Events" loading={allEventsLoading}></PageHead>
          <Page>
            <SiteList loading={allEventsLoading}>
              {allEvents?.docs.map((item) => {
                const data = item.data();
                // setEventId(item.id);
                return (
                  <SiteListItem
                    key={item.id}
                    item={item}
                    disclosure={deleteEventDisclosure}
                    listType="events"
                  >
                    <SiteListText
                      item={item}
                      setStorage={setEventId}
                      forward="events/event"
                      textItems={{
                        head: data.name,
                        sub: data.venue,
                        foot: data.date,
                      }}
                    >
                      <SiteListButtons
                        setStorage={setEventId}
                        item={item}
                        listType="events"
                        disclosure={deleteEventDisclosure}
                      >
                        <Box>
                          This will delete the event and is not undo-able
                        </Box>
                        <Box>
                          You will loose any work you have done with this Event
                        </Box>
                      </SiteListButtons>
                    </SiteListText>
                  </SiteListItem>
                );
              })}
              {/* series?.docs.map */}
            </SiteList>
          </Page>
        </Fragment>
      )}
    </Fragment>
  );
}

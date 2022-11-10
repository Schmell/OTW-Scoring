import { Box, Text, useDisclosure } from "@chakra-ui/react";
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
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import useStorage from "../../hooks/useStorage";
import { auth, db } from "../../util/firebase-config";
import { useState } from "react";
import FollowButtons from "../../components/generic/FollowButtons";
import { SiteList } from "../../components/generic/SiteList";
import { SiteListButtons } from "../../components/generic/SiteList/SiteListButtons";
import { SiteListItem } from "../../components/generic/SiteList/SiteListItem";
import { SiteListText } from "../../components/generic/SiteList/SiteListText";
import ToolIconButton from "../../components/generic/ToolIconButton";
import { Page } from "../../components/page/Page";
import PageHead from "../../components/page/pageHead";
// Icons
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Events(props) {
  const { user, userLoading, setHeaderTitle, ...rest } = props;
  setHeaderTitle("Events");
  const [eventId, setEventId] = useStorage("eventId");

  const [pageTitle, setPageTitle] = useState("");

  const colRef = collection(db, "events");
  const ownerEvents = query(
    colRef,
    where("__owner", "==", !userLoading && user.uid)
  );

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
      console.log("event ", event);
      return {
        userId: event.userId,
        followId: event.followId,
        followRef: event.followRef,
      };
    },
    fromFirestore: (snapshot) => {
      const data = snapshot.data();
      return new FollowEvents(data.userId, data.followId, data.followRef);
    },
  };

  const followEventsRef = collection(db, "followEvents");
  const followQuery = query(
    followEventsRef,
    where("userId", "==", user && user?.uid)
  );
  const [followEvents, followEventsLoading, error] = useCollection(followQuery);

  const getFollowing = () => {
    const items = followEvents?.docs.map((follow) => {
      const docRef = doc(colRef, follow.data().followId);
      const [item] = useDocument(docRef);
      // return { org: { ...item?.data() }, id: docRef.id };
      return item;
    });
    console.log("items ", items);
    if (items) return items;
    return [];
  };

  const deleteEventDisclosure = useDisclosure();

  const addEventHandler = async () => {
    const docRef = await addDoc(colRef, {
      name: "New event",
      __owner: user.uid,
    });
    setEventId(docRef.id);
    route(`/events/edit/${docRef.id}`);
  };

  return (
    <Fragment>
      <Fragment>
        <PageHead title="Your Events" loading={eventsLoading}>
          <ToolIconButton
            aria-label="Find Events"
            icon={SearchIcon}
            onClick={() => route("/events/search")}
          />
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
              return (
                <Fragment>
                  {!data.__owner ?? <Text>You have no Items</Text>}
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
                        <Box>
                          This will delete the event and is not undo-able
                        </Box>
                        <Box>
                          You will loose any work you have done with this Event
                        </Box>
                      </SiteListButtons>
                    </SiteListText>
                  </SiteListItem>
                </Fragment>
              );
            })}
          </SiteList>
        </Page>
      </Fragment>

      {allEvents?.docs && (
        <Fragment>
          <PageHead
            title="Public Events"
            loading={allEventsLoading}
            noSpace={true}
          ></PageHead>
          <Page>
            <SiteList loading={allEventsLoading}>
              {allEvents?.docs.map((item) => {
                const data = item.data();
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
                      <FollowButtons
                        user={user}
                        data={item}
                        variant="ghost"
                        colName="followEvents"
                      />
                    </SiteListText>
                  </SiteListItem>
                );
              })}
            </SiteList>
          </Page>
        </Fragment>
      )}

      {getFollowing() && !followEventsLoading && (
        <Fragment>
          <PageHead
            title="Following"
            loading={followEventsLoading}
            noSpace={true}
          ></PageHead>
          <Page>
            <SiteList loading={followEventsLoading}>
              {getFollowing()?.map((item) => {
                const data = item?.data();
                //
                return (
                  <SiteListItem
                    key={item?.id}
                    item={item}
                    disclosure={deleteEventDisclosure}
                    listType="events"
                  >
                    <SiteListText
                      item={item!}
                      setStorage={setEventId}
                      forward="events/event"
                      textItems={{
                        head: data?.name,
                        sub: data?.venue,
                        foot: data?.date,
                      }}
                    >
                      <FollowButtons
                        user={user}
                        data={item!}
                        variant="ghost"
                        colName="followEvents"
                      />
                    </SiteListText>
                  </SiteListItem>
                );
              })}
            </SiteList>
          </Page>
        </Fragment>
      )}
    </Fragment>
  );
}

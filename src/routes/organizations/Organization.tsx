import {
  Box,
  Divider,
  Flex,
  Heading,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { Link, route } from "preact-router";
import {
  collection,
  deleteField,
  doc,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../util/firebase-config";
import { User } from "firebase/auth";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import FollowButtons from "../../components/generic/FollowButtons";
import ToolIconButton from "../../components/generic/ToolIconButton";
import PageHead from "../../components/page/pageHead";
// Icons
import EditIcon from "@mui/icons-material/Edit";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotosOutlined";
import { SiteList } from "../../components/generic/SiteList";
import { SiteListItem } from "../../components/generic/SiteList/SiteListItem";
import { SiteListButtons } from "../../components/generic/SiteList/SiteListButtons";
import { SiteListText } from "../../components/generic/SiteList/SiteListText";
import useStorage from "../../hooks/useStorage";

interface OrganizationProps {
  orgId: string;
  setHeaderTitle: (x: string) => void;
  user: User | null | undefined;
}

export default function Organization(props: OrganizationProps) {
  const { orgId, setHeaderTitle, user } = props;
  setHeaderTitle("Organization");

  const orgsRef = collection(db, "organizations");
  const orgRef = doc(orgsRef, orgId);
  const [org, orgLoading] = useDocument(orgRef);

  const eventsRef = collection(db, "events");
  const orgEventsQuery = query(eventsRef, where("organization", "==", orgId));
  const [orgEvents, orgEventsLoading] = useCollection(orgEventsQuery);

  const deleteEventDisclosure = useDisclosure();
  const [eventId, setEventId] = useStorage("eventId");

  return (
    <Fragment>
      <Fragment>
        <PageHead title={org?.data()?.orgName} loading={orgLoading}>
          {org?.data()?.__owner === user?.uid && (
            <Fragment>
              <ToolIconButton
                aria-label="Edit Organization"
                icon={EditIcon}
                onClick={() => {
                  route(`/organization/edit/${orgId}`);
                }}
              />
              <ToolIconButton
                aria-label="Add series"
                icon={AddToPhotosIcon}
                onClick={() => {}}
              />
            </Fragment>
          )}
          {org?.data()?.__public && org?.data()?.__owner !== user?.uid && (
            <FollowButtons user={user} data={org} colName="followOrgs" />
          )}
        </PageHead>
        {!orgLoading && (
          <Box>
            <Tabs variant="enclosed" isLazy>
              <TabList pt={4} px={4} background="white" borderBottom="none">
                <Tab
                  _selected={{
                    bg: "blackAlpha.50",
                    borderColor: "gray.200",
                    borderBottom: "none",
                    boxShadow: "none",
                  }}
                >
                  Events
                </Tab>
                <Tab
                  _selected={{
                    bg: "blackAlpha.50",
                    borderColor: "gray.200",
                    borderBottom: "none",
                    boxShadow: "none",
                  }}
                >
                  Details
                </Tab>
              </TabList>
              <TabPanels>
                {/* /////////////////////////// */}
                {/* Events */}
                {/* /////////////////////////// */}
                <TabPanel p={0}>
                  <SiteList loading={orgEventsLoading}>
                    {orgEvents?.docs.map((item) => {
                      const data = item.data();
                      return (
                        <Fragment>
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
                              {item.data().__owner === user?.uid ? (
                                <SiteListButtons
                                  setStorage={setEventId}
                                  item={item}
                                  listType={""}
                                  callback={async (id) => {
                                    console.log("id ", id);
                                    // updateDoc removing orgaization
                                    await updateDoc(item.ref, {
                                      organization: deleteField(),
                                    });
                                  }}
                                  disclosure={deleteEventDisclosure}
                                >
                                  <Box>
                                    This will delete the event and is not
                                    undo-able
                                  </Box>
                                  <Box>
                                    You will loose any work you have done with
                                    this Event
                                  </Box>
                                </SiteListButtons>
                              ) : (
                                <FollowButtons
                                  user={user}
                                  data={item}
                                  colName="followEvents"
                                  variant="ghost"
                                />
                              )}
                            </SiteListText>
                          </SiteListItem>
                        </Fragment>
                      );
                    })}
                  </SiteList>
                </TabPanel>
                {/* /////////////////////////// */}
                {/* Details                     */}
                {/* /////////////////////////// */}
                <TabPanel>
                  <Fragment>
                    <Flex mx={4} mb={4} justifyContent="space-between">
                      <Text>{org?.data()?.description}</Text>

                      {org?.data()?.titlePhoto && (
                        <Image
                          src={org?.data()?.titlePhoto}
                          alt={org?.data()?.orgName}
                          boxSize={200}
                        />
                      )}
                    </Flex>
                    <Flex justifyContent={"space-between"}>
                      <Box>
                        <Heading fontSize={"lg"} color={"blue.400"}>
                          Contact:
                        </Heading>
                        <Divider mb={2} />
                        <Text>{org?.data()?.phone}</Text>
                        <Text>{org?.data()?.contactEmail}</Text>
                        <Text as={Link} href={org?.data()?.website}>
                          {org?.data()?.website}
                        </Text>
                      </Box>

                      <Box>
                        <Heading fontSize={"lg"} color={"blue.400"}>
                          Address:
                        </Heading>
                        <Divider mb={2} />
                        <Text>{org?.data()?.address}</Text>
                        <Flex gap={2}>
                          <Text>{org?.data()?.city}</Text>
                          <Text>{org?.data()?.area}</Text>
                        </Flex>
                        <Flex gap={2}>
                          <Text>{org?.data()?.state},</Text>
                          <Text>{org?.data()?.country}</Text>
                        </Flex>
                      </Box>
                    </Flex>
                  </Fragment>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        )}
      </Fragment>
    </Fragment>
  );
}

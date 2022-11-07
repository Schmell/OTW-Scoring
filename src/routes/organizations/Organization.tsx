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
} from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { Link, route } from "preact-router";
import { collection, doc, query, where } from "firebase/firestore";
import { db } from "../../util/firebase-config";
import { User } from "firebase/auth";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import FollowButtons from "../../components/generic/FollowButtons";
import ToolIconButton from "../../components/generic/ToolIconButton";
import PageHead from "../../components/page/pageHead";
// Icons
import EditIcon from "@mui/icons-material/Edit";

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
  const orgEventsQuery = query(eventsRef, where("orgId", "==", orgId));
  const [orgEvents, orgEventsLoading] = useCollection(orgEventsQuery);

  return (
    <Fragment>
      <Fragment>
        <PageHead title={org?.data()?.orgName} loading={orgLoading}>
          {org?.data()?.__owner === user?.uid && (
            <ToolIconButton
              aria-label="Edit Organization"
              icon={EditIcon}
              onClick={() => {
                route(`/organization/edit/${orgId}`);
              }}
            />
          )}
          {org?.data()?.__public && org?.data()?.__owner !== user?.uid && (
            <FollowButtons user={user} data={org} colName="followOrgs" />
          )}
        </PageHead>
        {!orgLoading && (
          <Box m={4}>
            <Tabs variant="enclosed">
              <TabList>
                <Tab>Events</Tab>
                <Tab>Details</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <p>two!</p>
                </TabPanel>
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

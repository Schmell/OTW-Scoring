import {
  Heading,
  Box,
  Image,
  useColorModeValue,
  Text,
  Flex,
  Grid,
  Divider,
} from "@chakra-ui/react";
import { collection, doc } from "firebase/firestore";
import { Fragment, h } from "preact";
import { useDocument } from "react-firebase-hooks/firestore";
import ToolIconButton from "../../components/generic/ToolIconButton";
import PageHead from "../../components/page/pageHead";
import { db } from "../../util/firebase-config";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect } from "preact/hooks";
import UserLanding from "../user/UserLanding";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Link, route } from "preact-router";

interface OrgaizationProps {}

export default function Organization(props) {
  const { orgId, setHeaderTitle, user } = props;
  setHeaderTitle("Organization");

  const colRef = collection(db, "organizations");
  const docRef = doc(colRef, orgId);
  const [org, orgLoading] = useDocument(docRef);

  // useEffect(() => {
  //   console.log("org ", org);
  // }, []);

  return (
    <Fragment>
      <Fragment>
        <PageHead title={org?.data()?.orgName} loading={orgLoading}>
          {org?.data()?.__owner === user.uid && (
            <ToolIconButton
              aria-label="Edit Organization"
              icon={EditIcon}
              onClick={() => {
                route(`/organization/edit/${orgId}`);
              }}
            />
          )}
          <ToolIconButton
            aria-label="Add to Organizations"
            icon={PersonAddIcon}
            onClick={() => {
              // add the org to follow list
            }}
          />
        </PageHead>
        {!orgLoading && (
          <Box m={4}>
            <Heading color={"blue.500"}>{org?.data()?.orgName}</Heading>
            <Divider mb={2} />
            <Flex mx={4} mb={4}>
              <Text>{org?.data()?.description}</Text>

              {org?.data()?.titlePhoto && (
                <Image
                  src={org?.data()?.titlePhoto}
                  alt={org?.data()?.orgName}
                  boxSize={100}
                />
              )}
            </Flex>
            <Flex justifyContent={"space-between"}>
              <Box>
                <Heading fontSize={"lg"}>Contact:</Heading>
                <Divider mb={2} />
                <Text>{org?.data()?.phone}</Text>
                <Text>{org?.data()?.contactEmail}</Text>
                <Text as={Link} href={org?.data()?.website}>
                  {org?.data()?.website}
                </Text>
              </Box>

              <Box>
                <Heading fontSize={"lg"}>Address:</Heading>
                <Divider mb={2} />
                <Text>{org?.data()?.address}</Text>
                <Flex gap={2}>
                  <Text>{org?.data()?.city}</Text>
                  <Text>({org?.data()?.area})</Text>
                </Flex>
                <Flex gap={2}>
                  <Text>{org?.data()?.state},</Text>
                  <Text>{org?.data()?.country}</Text>
                </Flex>
              </Box>
            </Flex>
          </Box>
        )}
      </Fragment>
    </Fragment>
  );
}

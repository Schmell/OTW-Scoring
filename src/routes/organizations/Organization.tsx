import {
  Heading,
  Box,
  Image,
  useColorModeValue,
  Text,
  Flex,
  Grid,
  Divider,
  flattenTokens,
} from "@chakra-ui/react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Fragment, h } from "preact";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import ToolIconButton from "../../components/generic/ToolIconButton";
import PageHead from "../../components/page/pageHead";
import { auth, db } from "../../util/firebase-config";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect } from "preact/hooks";
import UserLanding from "../user/UserLanding";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Link, route } from "preact-router";
import { useAuthState } from "react-firebase-hooks/auth";
import GroupRemoveOutlinedIcon from "@mui/icons-material/GroupRemoveOutlined";

interface OrgaizationProps {}

export default function Organization(props) {
  const { orgId, setHeaderTitle, user } = props;
  setHeaderTitle("Organization");
  // const [user] = useAuthState(auth);

  const orgsRef = collection(db, "organizations");
  const orgRef = doc(orgsRef, orgId);
  const [org, orgLoading] = useDocument(orgRef);

  const followOrgsRef = collection(db, "followOrgs");
  const userFollowOrgs = query(followOrgsRef, where("userId", "==", user?.uid));
  const [followOrgs, followOrgsLoading] = useCollection(userFollowOrgs);

  const addToFollowOrg = async (orgId) => {
    const added = await addDoc(followOrgsRef, {
      userId: user?.uid,
      orgId: orgId,
    });
  };

  const unFollowOrg = async (orgId) => {
    const q = query(
      followOrgsRef,
      where("orgId", "==", orgId),
      where("userId", "==", user.uid)
    );
    const del = await getDocs(q);
    del.docs.map(async (d) => {
      await deleteDoc(d.ref);
    });
  };

  // await deleteDoc(followed);

  const checkFollowing = () => {
    const matched = followOrgs?.docs.filter((followed) => {
      return followed.data().orgId === orgId;
    });
    // console.log("matched ", matched?.length);
    if (matched && matched.length > 0) return true;
    return false;
  };
  // console.log("checkFollowing(); ", checkFollowing());

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
          {org?.data()?.__public ||
            (org?.data()?.__owner === user.uid && (
              <Fragment>
                {checkFollowing() ? (
                  <ToolIconButton
                    aria-label="Un-Follow"
                    icon={GroupRemoveOutlinedIcon}
                    onClick={() => {
                      unFollowOrg(org?.id);
                    }}
                  />
                ) : (
                  <ToolIconButton
                    aria-label="Follow"
                    icon={PersonAddIcon}
                    onClick={() => {
                      addToFollowOrg(org?.id);
                    }}
                  />
                )}
              </Fragment>
            ))}
        </PageHead>
        {!orgLoading && (
          <Box m={4}>
            <Flex mx={4} mb={4} justifyContent="space-between">
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
          </Box>
        )}
      </Fragment>
    </Fragment>
  );
}

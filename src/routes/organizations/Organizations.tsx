import { Box, useDisclosure } from "@chakra-ui/react";
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import { collection, doc, query, where } from "firebase/firestore";
import { Fragment, h } from "preact";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { SiteList } from "../../components/generic/SiteList";
import { SiteListButtons } from "../../components/generic/SiteList/SiteListButtons";
import { SiteListItem } from "../../components/generic/SiteList/SiteListItem";
import { SiteListText } from "../../components/generic/SiteList/SiteListText";
import ToolIconButton from "../../components/generic/ToolIconButton";
import { Page } from "../../components/page/Page";
import PageHead from "../../components/page/pageHead";
import useStorage from "../../hooks/useStorage";
import { db } from "../../util/firebase-config";
import { addOrganization } from "./addOrganization";

import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import FollowButtons from "../../components/generic/FollowButtons";
import SearchIcon from "@mui/icons-material/Search";
import PriBtn from "../../components/generic/PriBtn";
import { route } from "preact-router";

interface OrganizationsProps {}

export default function Organizations(props) {
  const { user, setHeaderTitle, ...rest } = props;
  setHeaderTitle("Organizations");

  const orgsRef = collection(db, "organizations");
  const publicOrgsRef = query(
    orgsRef,
    where("__owner", "!=", user?.uid),
    where("__public", "==", true)
  );
  const [orgs, orgsLoading] = useCollection(publicOrgsRef);

  const userOrgsRef = query(orgsRef, where("__owner", "==", user?.uid));
  const [userOrgs, userOrgsLoading] = useCollection(userOrgsRef);

  const followOrgsRef = collection(db, "followOrgs");
  const userFollowOrgs = query(followOrgsRef, where("userId", "==", user?.uid));
  const [followOrgs, followingOrgsLoading] = useCollection(userFollowOrgs);

  const getFollowing = () => {
    const items = followOrgs?.docs.map((follow) => {
      const docRef = doc(orgsRef, follow.data().followId);
      const [item] = useDocument(docRef);
      // return { org: { ...item?.data() }, id: docRef.id };
      return item;
    });
    if (items) return items;
    return [];
  };

  const deleteOrgDisclosure = useDisclosure();

  // useStorage option (modified to be used as context)
  const [_orgId, setOrgId] = useStorage("orgId", {
    initVal: "",
    bool: false,
  });

  return (
    <Fragment>
      <PageHead title="Your Organizations" loading={orgsLoading}>
        <ToolIconButton
          aria-label="Add Orgaization"
          icon={AddToPhotosOutlinedIcon}
          onClick={() => {
            addOrganization(user);
          }}
        />
      </PageHead>
      <Page>
        <SiteList loading={orgsLoading}>
          {userOrgs?.docs.map((org) => (
            <Fragment>
              <SiteListItem
                key={org.id}
                item={org}
                disclosure={deleteOrgDisclosure}
                listType="organization"
              >
                <SiteListText
                  item={org}
                  setStorage={setOrgId}
                  forward={`organization/${org.id}`}
                  textItems={{
                    head: org.data().orgName,
                    sub: org.data().country,
                    foot: org.data().website,
                  }}
                >
                  <SiteListButtons
                    setStorage={setOrgId}
                    item={org}
                    listType="organizations"
                    disclosure={deleteOrgDisclosure}
                  >
                    <Box>
                      This will delete the organization and is not undo-able
                    </Box>
                    <Box>
                      You will loose any work you have done with this
                      Organization
                    </Box>
                  </SiteListButtons>
                </SiteListText>
              </SiteListItem>
            </Fragment>
          ))}
        </SiteList>
      </Page>

      <Fragment>
        <PageHead
          title="Following"
          loading={followingOrgsLoading}
          noSpace={true}
        >
          <ToolIconButton
            aria-label="Search"
            icon={SearchIcon}
            onClick={() => {
              route("/organizations/search");
            }}
          />
        </PageHead>
        <Page>
          <SiteList loading={orgsLoading}>
            {getFollowing()?.map((org) => (
              <Fragment>
                {org?.data() && org.data()?.__public && (
                  <SiteListItem
                    key={org.id}
                    item={org}
                    disclosure={deleteOrgDisclosure}
                    listType="organization"
                  >
                    <SiteListText
                      item={org}
                      setStorage={setOrgId}
                      forward={`organization/${org.id}`}
                      textItems={{
                        head: org.data()?.orgName,
                        sub: org.data()?.country,
                        foot: org.data()?.website,
                      }}
                    >
                      <FollowButtons
                        user={user}
                        data={org}
                        colName={"followOrgs"}
                        variant="ghost"
                        {...rest}
                      />
                    </SiteListText>
                  </SiteListItem>
                )}
              </Fragment>
            ))}
            <PriBtn
              w="full"
              leftIcon={<SearchIcon />}
              onClick={() => {
                route("/organizations/search");
              }}
            >
              Find More Organizations
            </PriBtn>
          </SiteList>
        </Page>
      </Fragment>
    </Fragment>
  );
}

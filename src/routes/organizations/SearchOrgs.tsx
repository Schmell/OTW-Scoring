import { Box, useDisclosure } from "@chakra-ui/react";
import { collection, query, where } from "firebase/firestore";
import { Fragment, h } from "preact";
import { useCollection } from "react-firebase-hooks/firestore";
import { SiteList } from "../../components/generic/SiteList";
import { SiteListButtons } from "../../components/generic/SiteList/SiteListButtons";
import { SiteListItem } from "../../components/generic/SiteList/SiteListItem";
import { SiteListText } from "../../components/generic/SiteList/SiteListText";
import ToolIconButton from "../../components/generic/ToolIconButton";
import { Page } from "../../components/page/Page";
import PageHead from "../../components/page/pageHead";
import { db } from "../../util/firebase-config";
import { addOrganization } from "./addOrganization";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import FollowButtons from "../../components/generic/FollowButtons";
import SearchIcon from "@mui/icons-material/Search";
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import useStorage from "../../hooks/useStorage";

interface SearchOrgsProps {}

export default function SearchOrgs(props) {
  const { user, setHeaderTitle, ...rest } = props;
  console.log("user ", user.uid);
  setHeaderTitle("Organizations");

  const orgsRef = collection(db, "organizations");
  const publicOrgsRef = query(
    orgsRef,
    where("__owner", "!=", user ? user.uid : ""),
    where("__public", "==", true)
  );
  const [orgs, orgsLoading] = useCollection(publicOrgsRef);

  const deleteOrgDisclosure = useDisclosure();

  // useStorage option (modified to be used as context)
  const [_orgId, setOrgId] = useStorage("orgId", {
    initVal: "",
    bool: false,
  });

  return (
    <Fragment>
      {user && (
        <Fragment>
          <PageHead title="Public Organizations" loading={orgsLoading}>
            <ToolIconButton
              aria-label="Add Orgaization"
              icon={AddToPhotosOutlinedIcon}
              onClick={() => {
                addOrganization(user);
              }}
            />
          </PageHead>
          <Page>
            {orgs && user && (
              <SiteList loading={orgsLoading}>
                {orgs?.docs.map((org) => (
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
                        <FollowButtons
                          user={user}
                          data={org}
                          colName={"followOrgs"}
                          variant="ghost"
                          {...rest}
                        />
                      </SiteListText>
                    </SiteListItem>
                  </Fragment>
                ))}
              </SiteList>
            )}
          </Page>
        </Fragment>
      )}
    </Fragment>
  );
}

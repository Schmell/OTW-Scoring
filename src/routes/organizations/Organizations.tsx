import {
  Box,
  Divider,
  Flex,
  Heading,
  VStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { collection } from "firebase/firestore";
import { Fragment, h } from "preact";
import { useCollection } from "react-firebase-hooks/firestore";
import { Page } from "../../components/page/Page";
import PageHead from "../../components/page/pageHead";
import { db } from "../../util/firebase-config";
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import ToolIconButton from "../../components/generic/ToolIconButton";
import { addOrganization } from "./addOrganization";
import { route } from "preact-router";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { SiteList } from "../../components/generic/SiteList";
import { SiteListButtons } from "../../components/generic/SiteList/SiteListButtons";
import { SiteListItem } from "../../components/generic/SiteList/SiteListItem";
import { SiteListText } from "../../components/generic/SiteList/SiteListText";
import useStorage from "../../hooks/useStorage";

interface OrganizationsProps {}

export default function Organizations(props) {
  const { user, setHeaderTitle } = props;
  setHeaderTitle("Organizations");

  const orgsRef = collection(db, "organizations");
  const [orgs, orgsLoading] = useCollection(orgsRef);

  const deleteOrgDisclosure = useDisclosure();

  // useStorage option (modified to be used as context)
  const [_orgId, setOrgId] = useStorage("orgId", {
    initVal: "",
    bool: false,
  });

  return (
    <Fragment>
      <PageHead title="Organizations" loading={orgsLoading}>
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
          {orgs?.docs.map((org) => (
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
                  listType="series"
                  disclosure={deleteOrgDisclosure}
                >
                  <Box>This will delete the series and is not undo-able</Box>
                  <Box>
                    You will loose any work you have done with this Series
                  </Box>
                </SiteListButtons>
              </SiteListText>
            </SiteListItem>
          ))}
        </SiteList>
      </Page>
    </Fragment>
  );
}

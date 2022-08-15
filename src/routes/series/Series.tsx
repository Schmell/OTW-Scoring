import { Box, Divider, Flex, Heading, Icon, Text, IconButton, Tooltip, useDisclosure } from "@chakra-ui/react";
import { addDoc, collection, query, where } from "firebase/firestore";
import { Fragment, h } from "preact";
import { route } from "preact-router";
import { useCollection } from "react-firebase-hooks/firestore";
import { FadeInSlideLeft, FadeInSlideRight } from "../../components/animations/FadeSlide";
import { AreYouSure } from "../../components/generic/AreYouSure";
import useStorage from "../../hooks/useStorage";
import { db } from "../../util/firebase-config";
// Icons
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { SiteList } from "../../components/generic/SiteList";
import { SiteListButtons } from "../../components/generic/SiteList/SiteListButtons";
import { SiteListItem } from "../../components/generic/SiteList/SiteListItem";
import { SiteListText } from "../../components/generic/SiteList/SiteListText";
import ToolIconBtn from "../../components/generic/ToolIconBtn";

export default function Series({ user, setHeaderTitle }) {
  setHeaderTitle("Series");
  // Get users series
  const seriesRef = collection(db, "series");
  const [series, seriesLoading] = useCollection(query(seriesRef, where("__owner", "==", user && user.uid)));
  const deleteSeriesDisclosure = useDisclosure();

  // useStorage option (modified to be used as context)
  const [_seriesId, setSeriesId] = useStorage("seriesId", {
    initVal: "",
    bool: false,
  });

  const addSeriesHandler = async () => {
    let __fileInfo = {
      lastModifiedDate: new Date().toLocaleDateString("en-UK"),
      lastModified: new Date().toTimeString(),
    };

    const docRef = await addDoc(seriesRef, {
      name: "Series ",
      __fileInfo,
      __owner: user.uid,
    });

    setSeriesId(docRef.id);
    route("/series/edit");
  };

  return (
    <Fragment>
      <Flex justifyContent="space-between" alignItems="end" px={4}>
        <FadeInSlideRight>
          <Heading as="h4" color="blue.400">
            All Series
          </Heading>
        </FadeInSlideRight>

        {/* Sub header buttons */}
        <FadeInSlideLeft>
          <Flex gap={2}>
            <ToolIconBtn label="Import file" action={() => route("/import")} icon={FileUploadOutlinedIcon} />
            <ToolIconBtn label="Add Series" action={addSeriesHandler} icon={AddToPhotosOutlinedIcon} />
          </Flex>
        </FadeInSlideLeft>
      </Flex>

      <Divider mt={4} border={4} />

      <SiteList loading={seriesLoading}>
        {series?.docs.map((series) => (
          <SiteListItem key={series.id} item={series} disclosure={deleteSeriesDisclosure} listType="series">
            <SiteListText
              item={series}
              setStorage={setSeriesId}
              forward="races"
              textItems={{ head: series.data().event, sub: series.data().venue, foot: series.data().venuewebsite }}
            >
              <SiteListButtons
                setStorage={setSeriesId}
                item={series}
                listType="series"
                disclosure={deleteSeriesDisclosure}
              />
            </SiteListText>
            <AreYouSure disclosure={deleteSeriesDisclosure} colPath="series" itemId={series.id}>
              <Box>This will delete the series and is not undo-able</Box>
              <Box>You will loose any work you have done with this Series</Box>
            </AreYouSure>
          </SiteListItem>
        ))}
      </SiteList>
    </Fragment>
  );
}

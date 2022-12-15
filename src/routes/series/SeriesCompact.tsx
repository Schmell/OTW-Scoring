import { Box, useDisclosure } from "@chakra-ui/react";
import { addDoc, collection, query, where } from "firebase/firestore";
import { Fragment, h } from "preact";
import { route } from "preact-router";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import useStorage from "../../hooks/useStorage";
import { db } from "../../util/firebase-config";
// Icons
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { SiteList } from "../../components/generic/SiteList";
import { SiteListButtons } from "../../components/generic/SiteList/SiteListButtons";
import { SiteListItem } from "../../components/generic/SiteList/SiteListItem";
import { SiteListText } from "../../components/generic/SiteList/SiteListText";
import ToolIconButton from "../../components/generic/ToolIconButton";
import { Page } from "../../components/page/Page";
import PageHead from "../../components/page/pageHead";
import CompactList from "../../components/generic/CompactList/CompactList";
import CompactListItem from "../../components/generic/CompactList/CompactListItem";
import { seriesConverter } from "../../model/Series";
import { useEffect } from "preact/hooks";

export default function SeriesCompact(props) {
  const { user, setHeaderTitle, ...rest } = props;
  setHeaderTitle("Series");
  // Get users series
  const seriesRef = collection(db, "series");
  const [userSeries, userSeriesLoading] = useCollection(
    query(seriesRef, where("__owner", "==", user && user.uid))
  );
  // console.log("userSeries ", userSeries);

  // const seriesRef = collection(db, "series").withConverter(seriesConverter)
  const classRef = seriesRef.withConverter(seriesConverter);
  const q = query(classRef, where("__owner", "==", user && user.uid));
  const [seriesClass, seriesClassLoading] = useCollectionData(q);

  // console.log("seriesClass ", seriesClass);

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
      event: "New Series",
      __fileInfo,
      __owner: user.uid,
      newFile: true,
    });

    setSeriesId(docRef.id);
    route(`/series/edit/${docRef.id}`);
  };

  return (
    <Page>
      <PageHead title="Your Series Compact" loading={userSeriesLoading}>
        <ToolIconButton
          aria-label="Import file"
          icon={FileUploadOutlinedIcon}
          onClick={() => route("/import")}
        />
        <ToolIconButton
          aria-label="Create Series"
          icon={AddToPhotosOutlinedIcon}
          onClick={addSeriesHandler}
        />
      </PageHead>

      <CompactList loading={userSeriesLoading}>
        <Fragment>
          {seriesClass?.map((series) => {
            // const data = series.data();

            return (
              <CompactListItem
                title={series.event}
                subText={series.venue}
                item={series.snapshot}
                snap={series}
                forward={`/races/${series.id}`}
              >
                <SiteListButtons
                  setStorage={setSeriesId}
                  item={series.snapshot}
                  listType="series"
                  disclosure={deleteSeriesDisclosure}
                >
                  <Box>This will delete the series and is not undo-able</Box>
                  <Box>
                    You will loose any work you have done with this Series
                  </Box>
                </SiteListButtons>
              </CompactListItem>
            );
          })}
        </Fragment>
      </CompactList>
    </Page>
  );
}

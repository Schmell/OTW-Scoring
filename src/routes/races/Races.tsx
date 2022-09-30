import { Box } from "@chakra-ui/react";
import { addDoc, collection, doc, query } from "firebase/firestore";
import { Fragment, h } from "preact";
import { route } from "preact-router";
import { useEffect } from "preact/hooks";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import useStorage from "../../hooks/useStorage";
import { db } from "../../util/firebase-config";
import RaceItem from "./racesView/RaceItem";
// import { RacesCtx } from "../../components/page/Routing";
// Icons
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import EditIcon from "@mui/icons-material/Edit";
import ToolIconBtn from "../../components/generic/ToolIconBtn";
import { Page } from "../../components/page/Page";
import PageHead from "../../components/page/pageHead";

export default function Races(props) {
  const { setHeaderTitle, ...rest } = props;

  setHeaderTitle("Races");

  // const { racesCtx, setRacesCtx } = useContext(RacesCtx);
  const [racesArray, setRacesArray] = useStorage("racesArray");
  // const { raceCtx, setRaceCtx, racesCtx, setRacesCtx } = useContext(RacesCtx);

  const [seriesId, _setSeriesId] = useStorage("seriesId");
  const [_raceId, setRaceId] = useStorage("raceId", { initVal: "1" });

  /////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////
  const racesRef = collection(db, "series", seriesId, "races");
  const racesQ = query(racesRef);
  const [races, racesLoading] = useCollection(racesQ);
  /////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////
  // console.log("races: ", races?.docs);
  const seriesRef = doc(db, "series", seriesId);
  const [series, _seriesLoading] = useDocumentData(seriesRef);

  const addRaceHandler = async () => {
    const docRef = await addDoc(racesRef, {
      name: "Race ",
      date: new Date().toLocaleDateString("en-UK"),
      time: new Date().toLocaleTimeString("en-US", { hour12: false }),
      sailed: "0",
      _seriesid: seriesId,
      starts: [],
    });
    setRaceId(docRef.id);
    route("/races/edit");
  };

  useEffect(() => {
    const raceIdArray = races?.docs.map((race) => {
      return race.id;
    });
    setRacesArray(raceIdArray);
  }, [racesLoading]);

  return (
    <Page>
      <PageHead title={series && series.event}>
        <ToolIconBtn
          action={() => route("/series/edit")}
          label="Edit Series"
          icon={EditIcon}
        />
        <ToolIconBtn
          action={addRaceHandler}
          label="Add Race"
          icon={AddToPhotosOutlinedIcon}
        />
      </PageHead>

      <Box mt={2} my={4} mb={14}>
        <Fragment>
          {races &&
            races.docs.map((race) => (
              <RaceItem
                key={race.id}
                race={race}
                setRaceId={setRaceId}
              ></RaceItem>
            ))}
        </Fragment>
      </Box>
    </Page>
  );
}

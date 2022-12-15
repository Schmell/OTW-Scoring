import {
  Box,
  useDisclosure,
  Text,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { addDoc, collection, doc, query } from "firebase/firestore";
import { Fragment, h } from "preact";
import { route } from "preact-router";
import { useEffect } from "preact/hooks";
import {
  useCollection,
  useDocument,
  useDocumentData,
} from "react-firebase-hooks/firestore";
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
import { SiteList } from "../../components/generic/SiteList";
import { SiteListItem } from "../../components/generic/SiteList/SiteListItem";
import { SiteListText } from "../../components/generic/SiteList/SiteListText";
import { SiteListButtons } from "../../components/generic/SiteList/SiteListButtons";
import { checkIfSailed } from "./racesView/checkIfRaceSailed";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import ToolIconButton from "../../components/generic/ToolIconButton";

export default function Races(props) {
  const { setHeaderTitle, seriesId, ...rest } = props;
  // http://localhost:8080/races/hcCKIVNTgEkvnRnSIjDY

  setHeaderTitle("Races");

  // const { racesCtx, setRacesCtx } = useContext(RacesCtx);
  const [racesArray, setRacesArray] = useStorage("racesArray");
  // const { raceCtx, setRaceCtx, racesCtx, setRacesCtx } = useContext(RacesCtx);
  const startTheRaceDisclosure = useDisclosure();
  // const [seriesId, setSeriesId] = useStorage("seriesId");
  // const [raceId, setRaceId] = useStorage("seriesId");
  const [raceId, setRaceId] = useStorage("raceId", { initVal: "1" });

  /////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////
  const racesRef = collection(db, "series", seriesId, "races");
  const racesQ = query(racesRef);
  const [races, racesLoading] = useCollection(racesQ);
  /////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////
  // console.log("races: ", races?.docs);
  const seriesRef = doc(db, "series", seriesId);
  const [series, _seriesLoading] = useDocument(seriesRef);

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
    route(`/races/edit/${docRef.id}`);
  };

  useEffect(() => {
    const raceIdArray = races?.docs.map((race) => {
      return race.id;
    });
    setRacesArray(raceIdArray);
  }, [racesLoading]);

  return (
    <Page>
      <PageHead title={series && series.data()?.event}>
        <ToolIconButton
          aria-label="Edit Series"
          icon={EditIcon}
          onClick={() => route(`/series/edit/${series?.id}`)}
        />
        <ToolIconButton
          aria-label="Add Race"
          icon={AddToPhotosOutlinedIcon}
          onClick={addRaceHandler}
        />
      </PageHead>

      <SiteList loading={racesLoading}>
        {races?.docs.map((race) => (
          <SiteListItem
            key={race.data().id}
            item={race}
            disclosure={startTheRaceDisclosure}
            listType="races"
            borderBottomColor={checkIfSailed({
              race,
              sailed: "green.400",
              unsailed: "blue.400",
              postponed: "blue.200",
              cancelled: useColorModeValue("gray.100", "gray.400"),
            })}
          >
            <SiteListText
              item={race}
              setStorage={setRaceId}
              forward="result"
              action={() => {
                route(`/result/${seriesId}/${race.id}/${race.data().name}`);
              }}
              textItems={{
                head: race.data().name,
                sub: checkIfSailed({
                  race: race,
                  sailed: (
                    <Text color="green.400" display="flex">
                      <Icon as={CheckIcon} />
                      Sailed
                    </Text>
                  ),
                  unsailed: (
                    <Text color="blue.400" display="flex">
                      <Icon as={AddIcon} />
                      Un-Sailed
                    </Text>
                  ),
                  postponed: (
                    <Text color="blue.400" display="flex">
                      <Icon as={RemoveIcon} />
                      Postponed
                    </Text>
                  ),
                  cancelled: (
                    <Text color="gray.400" display="flex">
                      <Icon as={CloseIcon} />
                      Cancelled
                    </Text>
                  ),
                }),
                foot: `${race.data().date} - ${race.data().time}`,
              }}
            >
              <SiteListButtons
                setStorage={setRaceId}
                item={race}
                listType={`races/${seriesId}`}
                disclosure={startTheRaceDisclosure}
              >
                <Box>This will delete the race and is not undo-able</Box>
                <Box>You will loose any work you have done with this Race</Box>
              </SiteListButtons>
            </SiteListText>
          </SiteListItem>
        ))}
      </SiteList>
    </Page>
  );
}

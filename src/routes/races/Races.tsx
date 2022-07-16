import { Fragment, h } from "preact";
import { route } from "preact-router";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  Icon,
  IconButton,
  List,
  ListItem,
  Spinner,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { collection } from "firebase/firestore";
import { db } from "../../util/firebase-config";
import { useCollection } from "react-firebase-hooks/firestore";
import useStorage from "../../hooks/useStorage";
import { formatDate } from "../../util/formatters";
import { FadeInSlideLeft, FadeInSlideRight } from "../../components/animations/FadeSlide";
import style from "./style.css";
// Icons
import AddIcon from "@mui/icons-material/Add";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutline";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EditIcon from "@mui/icons-material/Edit";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RaceItem from "./racesView/RaceItem";

export default function Races({ setHeaderTitle }) {
  setHeaderTitle("Races");
  const [seriesId, setSeriesId] = useStorage("seriesId");
  const [raceId, setRaceId] = useStorage("raceId", { initVal: "1" });
  const seriesRef = collection(db, `/series/${seriesId}/races`);
  const [races, racesLoading] = useCollection(seriesRef);

  return (
    <Fragment>
      <Container>
        <FadeInSlideRight>
          <Heading as="h3" color="blue.400" w="100%" mt={2}>
            Select a race
          </Heading>
          <Divider my={2} />
        </FadeInSlideRight>

        <Box mt={2}>
          {/* Loading Spinner */}
          {racesLoading ? (
            <Flex justifyContent=" center" alignItems="center">
              <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
            </Flex>
          ) : (
            <Fragment>
              {races && races.docs.map((race) => <RaceItem key={race.id} race={race} setRaceId={setRaceId}></RaceItem>)}
            </Fragment>
          )}
        </Box>
      </Container>
    </Fragment>
  );
}

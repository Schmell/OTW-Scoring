import { Fragment, h } from "preact";
import { route } from "preact-router";
import {
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  IconButton,
  List,
  ListItem,
  Spinner,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { collection } from "firebase/firestore";
import { db } from "../../util/firebase-config";
import { useCollection } from "react-firebase-hooks/firestore";
import useStorage from "../../hooks/useStorage";
import { formatDate } from "../../util/formatters";
import {
  FadeInSlideLeft,
  FadeInSlideRight,
} from "../../components/animations/FadeSlide";
import style from "./style.css";
// Icons
import AddIcon from "@mui/icons-material/Add";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutline";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EditIcon from "@mui/icons-material/Edit";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ___RacesList = ({ setHeaderTitle }) => {
  setHeaderTitle("Races");
  const [seriesId, setSeriesId] = useStorage("seriesId");
  const [raceId, setRaceId] = useStorage("raceId", { initVal: "1" });
  const seriesRef = collection(db, `/series/${seriesId}/races`);
  const [races, racesLoading] = useCollection(seriesRef);

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <Fragment>
      <Container>
        <FadeInSlideRight>
          <Heading
            color="blue.400"
            position={"fixed"}
            w="100%"
            mt={2}
            pb={3}
            zIndex="+1"
          >
            Select a race
          </Heading>
        </FadeInSlideRight>

        <List position={"relative"} top={14}>
          {/* Loading Spinner */}
          {racesLoading ? (
            <Flex justifyContent=" center" alignItems="center">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            </Flex>
          ) : (
            // Races loaded make a list
            races?.docs.map((race) => (
              <FadeInSlideLeft>
                {/* This is the list of races */}
                <ListItem key={race.id} className={style.selectList}>
                  <Flex alignItems="center" justifyContent="space-between">
                    <Flex alignItems="center">
                      {/* Icon for row */}
                      {race.data().sailed === "1" ? (
                        <Icon
                          as={CheckCircleIcon}
                          color="gray.400"
                          boxSize={3}
                        />
                      ) : race.data().sailed === "cancelled" ? (
                        <Icon
                          as={DoNotDisturbIcon}
                          color="gray.400"
                          boxSize={3}
                        />
                      ) : race.data().sailed === "postponed" ? (
                        <Icon as={CalendarIcon} color="gray.400" boxSize={3} />
                      ) : (
                        <Icon as={AddIcon} color="gray.400" boxSize={3} />
                      )}

                      {/* If Name else R+N */}
                      <Text px={3}>
                        {race.data().name
                          ? race.data().name
                          : `Race ${race.data().rank}`}
                      </Text>

                      <Text color="gray.400" px={3} fontSize="xs">
                        {/* Change the sailwave number to sailed or not and  */}
                        {race.data().sailed === "1" ? (
                          " - Sailed"
                        ) : race.data().sailed === "0" ? (
                          <Button
                            aria-label="Start Race"
                            colorScheme="green"
                            className={style.startRaceButton}
                            size="xs"
                            rightIcon={(<Icon as={ChevronRightIcon} />) as any}
                          >
                            Start race
                          </Button>
                        ) : (
                          capitalizeFirstLetter(race.data().sailed)
                        )}
                      </Text>
                    </Flex>

                    <Flex gap={2} alignContent="flex-end">
                      {/* Edit race button */}
                      <Tooltip
                        hasArrow
                        label="Edit race settings"
                        aria-label="Edit race settings"
                        placement="top-start"
                        bg="blue.300"
                      >
                        <span>
                          <IconButton
                            className={style.whiteIcon}
                            aria-label="Edit race settings"
                            colorScheme="blue"
                            size="xs"
                            _visited={{ color: "white" }}
                            icon={(<Icon as={EditIcon} boxSize={4} />) as any}
                            disabled={race.data().sailed === "1"}
                            onClick={() => {
                              setRaceId(race.id);
                              route("/races/edit");
                            }}
                          />
                        </span>
                      </Tooltip>

                      {/* View race results */}
                      <Tooltip
                        hasArrow
                        label="View race results"
                        aria-label="View race results"
                        placement="top-start"
                        bg="blue.300"
                      >
                        <span>
                          <IconButton
                            aria-label="View results "
                            colorScheme="blue"
                            size="xs"
                            icon={
                              (<Icon as={VisibilityIcon} boxSize={4} />) as any
                            }
                            disabled={race.data().sailed !== "1"}
                            onClick={({ target }) => {
                              route(
                                `/result/${race.data()._seriesid}/${
                                  race.data().raceid
                                }`
                              );
                            }}
                          />
                        </span>
                      </Tooltip>

                      {/* Race Date */}
                      <Text fontSize="xs" width={16} align="right">
                        {formatDate(race.data().date)}
                      </Text>
                    </Flex>
                  </Flex>
                </ListItem>
              </FadeInSlideLeft>
            ))
          )}
        </List>
      </Container>
    </Fragment>
  );
};

// export default RacesList;

import {
  AddIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  EditIcon,
  NotAllowedIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import {
  Button,
  Divider,
  Flex,
  Heading,
  IconButton,
  List,
  ListItem,
  Spinner,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { collection } from "firebase/firestore";
import { Fragment, h } from "preact";
import { route } from "preact-router";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  FadeInSlideLeft,
  FadeInSlideRight,
} from "../../components/animations/FadeSlide";
import useStorage from "../../hooks/useStorage";
import { db } from "../../util/firebase-config";
import { formatDate } from "../../util/formatters";
import style from "./scoring.css";

export const RacesList = ({ setHeaderTitle }) => {
  setHeaderTitle("Races");
  const [seriesId, setSeriesId] = useStorage("seriesId");
  const [raceId, setRaceId] = useStorage("raceId", { initVal: "1" });
  const seriesRef = collection(db, `/events/${seriesId}/races`);
  const [races, racesLoading] = useCollection(seriesRef);

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <Fragment>
      <FadeInSlideRight>
        <Heading as="h3" color="blue.400">
          Select a race
        </Heading>
      </FadeInSlideRight>
      <Divider />
      <List>
        {racesLoading ? (
          <Flex justifyContent=" center" alignItems="center" mt={8}>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Flex>
        ) : (
          races?.docs.map((race) => (
            <FadeInSlideLeft>
              <ListItem key={race.id} className="selectList" onClick={() => {}}>
                <Flex alignItems="center" justifyContent="space-between">
                  <Flex alignItems="center">
                    {race.data().sailed === "1" ? (
                      <CheckCircleIcon color="gray.400" boxSize={3} />
                    ) : race.data().sailed === "cancelled" ? (
                      <NotAllowedIcon color="gray.400" boxSize={3} />
                    ) : race.data().sailed === "postponed" ? (
                      <CalendarIcon color="gray.400" boxSize={3} />
                    ) : (
                      <AddIcon color="gray.400" boxSize={3} />
                    )}
                    <Text px={3}>
                      {race.data().name
                        ? race.data().name
                        : `Race ${race.data().rank}`}
                    </Text>
                    <Text color="gray.400" px={3} fontSize="xs">
                      {/* SHould be just a Tooltip
                      make a function that formats sailed output */}
                      {race.data().sailed === "1" ? (
                        " - Sailed"
                      ) : race.data().sailed === "0" ? (
                        <Button
                          aria-label="Start Race"
                          colorScheme="green"
                          className={style.startRaceButton}
                          size="xs"
                          rightIcon={<ChevronRightIcon />}
                        >
                          Start race
                        </Button>
                      ) : (
                        ` - ${capitalizeFirstLetter(race.data().sailed)}`
                      )}
                    </Text>
                  </Flex>
                  <Flex gap={2} alignContent="flex-end">
                    <Tooltip
                      label="Edit race settings"
                      aria-label="Edit race settings"
                    >
                      <IconButton
                        className={style.whiteIcon}
                        aria-label="Edit race settings"
                        colorScheme="blue"
                        size="xs"
                        _visited={{ color: "white" }}
                        icon={<EditIcon />}
                        disabled={race.data().sailed === "1"}
                        onClick={() => {
                          setRaceId(race.id);
                          route("/race-properties");
                        }}
                      />
                    </Tooltip>
                    <Tooltip
                      label="View race results"
                      aria-label="View race results"
                    >
                      <IconButton
                        aria-label="View results "
                        colorScheme="blue"
                        size="xs"
                        icon={<ViewIcon />}
                        disabled={race.data().sailed !== "1"}
                        onClick={({ target }) => {
                          route(
                            `/results/${race.data()._seriesid}/${
                              race.data().raceid
                            }`
                          );
                        }}
                      />
                    </Tooltip>
                    <Text fontSize="xs" width={16}>
                      {formatDate(race.data().date)}
                    </Text>
                  </Flex>
                </Flex>
              </ListItem>
            </FadeInSlideLeft>
          ))
        )}
      </List>
    </Fragment>
  );
};

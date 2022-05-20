import {
  CheckCircleIcon,
  EditIcon, NotAllowedIcon, ViewIcon
} from "@chakra-ui/icons";
import {
  Divider, Flex, Heading, IconButton, List,
  ListItem, Text, Tooltip
} from "@chakra-ui/react";
import { collection } from "firebase/firestore";
import { Fragment, h } from "preact";
import { route } from "preact-router";
import { useState } from "preact/hooks";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../../util/firebase-config";
import { formatDate } from "../../util/formatters";
import style from "./scoring.css";

export const RacesList = (props) => {
console.log(props);
  // const [user] = useAuthState(auth);
  const [path, setPath] = useState(props.eventPath)
  
  const seriesRef = collection(db, `/events/${path}/races`);
  const [races] = useCollection(seriesRef);

  return (
    <Fragment>
      <Heading as="h3" color="blue.400">
        Select a race
      </Heading>
      <Divider />
      <List>
        {races?.docs.map((race) => (
          <ListItem
            key={race.id}
            className="selectList"
            onClick={() => {
              // setRace(race.ref);
            }}
          >
            <Flex alignItems="center" justifyContent="space-between">
              <Flex alignItems="center">
                {race.data().sailed == "1" ? (
                  <NotAllowedIcon color="gray.400" />
                ) : (
                  <CheckCircleIcon color="green.500" />
                )}
                <Text px={3}>
                  {race.data().name
                    ? race.data().name
                    : `Race ${race.data().rank}`}
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
                      // Either use context here or maybe save to db as state
                      props.setRacePath(`/events/${props.navPath}/races/${race.data().raceid}`)
                      route("/race-properties");
                      // setRace(race.ref);
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
                    disabled={race.data().sailed === "0"}
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
        ))}
      </List>
    </Fragment>
  );
};

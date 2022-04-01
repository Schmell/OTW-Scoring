import { NotAllowedIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { Heading, Divider, List, ListItem, Flex, Text } from "@chakra-ui/react";
import { collection } from "firebase/firestore";
import { Fragment, h } from "preact";
import { useState } from "preact/hooks";
import { useCollection } from "react-firebase-hooks/firestore";
import style from "./scoring.css";

export const RacesList = ({ event, setRace }) => {
  const racesRef = collection(event, "/races");
  const [races] = useCollection(racesRef);
  const [sailed, setSailed] = useState();

  // console.log("races: ", races?.docs);

  return (
    <Fragment>
      <Heading as="h3">Select a race</Heading>
      <Divider />
      <List>
        {races?.docs.map((race) => (
          <ListItem
            key={race.id}
            className={style.seriesList}
            onClick={() => {
              setRace(race.ref);
            }}
          >
            <Flex alignItems="center" justifyContent="space-between">
              <Flex alignItems="center">
                {race.data().sailed == "1" ? (
                  <NotAllowedIcon color="gray.800" />
                ) : (
                  <CheckCircleIcon color="green.500" />
                )}
                <Text px={3}>
                  {race.data().name
                    ? race.data().name
                    : `Race ${race.data().rank}`}
                </Text>
              </Flex>
              <Text fontSize="sm">{race.data().date}</Text>
            </Flex>
          </ListItem>
        ))}
      </List>
    </Fragment>
  );
};

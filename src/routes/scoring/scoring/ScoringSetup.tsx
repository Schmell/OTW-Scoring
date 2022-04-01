import {
  Container,
  Box,
  Flex,
  Heading,
  Divider,
  FormLabel,
  RadioGroup,
  Stack,
  Radio,
  FormControl,
  Input,
  FormHelperText,
  FormErrorMessage,
  Checkbox,
  Button,
  Text,
} from "@chakra-ui/react";
import { getDoc } from "firebase/firestore";
import { Fragment, h } from "preact";
import { useState, useEffect } from "preact/hooks";

export const ScoringSetUp = ({ event, race, setRaceProperties }) => {
  // This form should set up the race
  // Scoring style. ie: rank , elapsed, finish, maybe even corrected
  // Date/time maybe can be adjusted *time bieng first s
  // starts

  interface IcurrentRace {
    // Obviously terrible typing
    [key: string | number]: any;
  }

  const [currentRace, setCurrentRace] = useState<IcurrentRace>({
    rank: "1",
    // date: null,
  });

  useEffect(() => {
    const currentRace = async () => {
      const r = await getDoc(race);
      setCurrentRace(r.data() as any); // Why???
    };
    currentRace();
  }, []);
  // console.log("event: ", eve as ant);

  const formatDate = (date: string) => {
    // this Obviously has holes in its theroy
    // I hate dates and i would encourage people to update there sailwave files or
    // just as the scorer just input the date at this stage
    if (date) {
      if (date.toString().includes("/")) {
        const rearrange = date.toString().split("/");
        // console.log("rearrange: ", rearrange);
        // When i try to not mutate i get undefined randomly
        // let year;
        // let month;
        // let day;
        // Add "20" to 2 digit years
        if (rearrange[2].startsWith("0")) {
          rearrange[2] = `20${rearrange[2]}`;
        }
        // Add missing zero to month and day
        if (rearrange[1].length < 2) {
          rearrange[1] = `0${rearrange[1]}`;
        }
        if (rearrange[0].length < 2) {
          rearrange[0] = `0${rearrange[0]}`;
        }

        const sorted = `${rearrange[2]}-${rearrange[1]}-${rearrange[0]}`;
        console.log("sorted: ", sorted);
        return sorted;
      } else {
        // console.log("date: ", date);
        return date;
      }
    }
  };
  // const isError = (): boolean | undefined => {
  //   return false;
  // };
  // const isError = true === false;
  const isError = () => {
    return true;
  };

  return (
    <Fragment>
      <Container>
        <Box>
          <Flex justifyContent="space-between" alignItems="center">
            <Heading as="h5">
              {currentRace.name ? currentRace.name : `Race ${currentRace.rank}`}
            </Heading>
            <Text fontSize="sm" color="lightgray">
              id: {currentRace.raceid}
            </Text>
          </Flex>
          <Divider />

          <form>
            <FormLabel htmlFor="resultType">Scoring type</FormLabel>
            <RadioGroup defaultValue="finish">
              <Stack spacing={4} direction="row">
                <Radio value="position">Position</Radio>
                <Radio value="elapsed">Elapsed</Radio>
                <Radio value="finish">Finishes</Radio>
              </Stack>
            </RadioGroup>
            <Divider />
            <Box d="flex" justifyContent="space-between">
              <Box>
                <FormControl isInvalid={isError()}>
                  <FormLabel htmlFor="date">Date: </FormLabel>
                  <Input
                    name="date"
                    type="date"
                    value={formatDate(currentRace.date)}
                  />

                  {!isError ? (
                    <FormHelperText></FormHelperText>
                  ) : (
                    <FormErrorMessage>Date is required.</FormErrorMessage>
                  )}
                </FormControl>
              </Box>
              <Box>
                <FormLabel htmlFor="sailed">Sailed</FormLabel>
                <Checkbox
                  name="sailed"
                  type="checkbox"
                  isChecked={currentRace.sailed == "1" ? true : false}
                />
              </Box>
            </Box>
            <FormLabel htmlFor="time">First gun</FormLabel>
            <Box d="flex" justifyContent="space-between">
              <Input name="time" type="text" value={currentRace.time} />
              <Button
                onClick={(e) => {
                  // console.log("e: ", e);
                  // currentRace.time = Date.now();
                }}
              >
                Use current time
              </Button>
            </Box>
            <Divider />
            <FormLabel htmlFor="starts">Starts</FormLabel>
            <Divider />

            {currentRace.starts &&
              currentRace.starts.map((item) => {
                return (
                  <Box ml={4}>
                    {/* <div>{JSON.stringify(item)}</div> */}
                    <FormLabel>{item.fleet}</FormLabel>
                    <Input type="text" value={item.start} />
                  </Box>
                );
              })}

            <Button type="submit" w="100%" my={4}>
              Submit
            </Button>
          </form>
        </Box>
      </Container>
    </Fragment>
  );
};

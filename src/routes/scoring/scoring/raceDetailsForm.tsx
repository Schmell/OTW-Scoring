import {
  Box,
  Button,
  Checkbox,
  Container,
  FormLabel,
  Heading,
  // FormGroup,
  Input,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { getDoc } from "firebase/firestore";
import { Fragment, h } from "preact";
// import List from "preact-material-components/List";
import "preact-material-components/List/style.css";
import "preact-material-components/Typography/style.css";
import { useEffect, useState } from "preact/hooks";

export function raceDetailsForm({ race }) {
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

    return (
      <Container>
        <Box>
          <Box d="flex" justifyContent="space-between">
            <Heading as="h5" className="underlined">
              {currentRace.name
                ? currentRace.name
                : `Race #${currentRace.rank}`}
            </Heading>
            <Box>{currentRace.raceid}</Box>
          </Box>
          <form>
            <Box d="flex" justifyContent="space-between">
              <div>
                <FormLabel htmlFor="date">Date: </FormLabel>
                <Input
                  name="date"
                  type="date"
                  value={currentRace.date && formatDate(currentRace.date)}
                />
              </div>
              <div>
                <FormLabel htmlFor="sailed">Sailed</FormLabel>
                <Checkbox
                  name="sailed"
                  type="checkbox"
                  isChecked={currentRace.sailed}
                />
              </div>
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
            <FormLabel htmlFor="starts" className="underlined">
              Starts
            </FormLabel>

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

            <FormLabel htmlFor="resultType">Scoring type</FormLabel>
            <RadioGroup defaultValue="finish">
              <Stack spacing={4} direction="row">
                <Radio value="position">Position</Radio>
                <Radio value="elapsed">Elapsed</Radio>
                <Radio value="finish">Finishes</Radio>
              </Stack>
            </RadioGroup>

            <Button type="submit" w="100%" my={4}>
              Submit
            </Button>
          </form>
        </Box>
      </Container>
    );
  };
}

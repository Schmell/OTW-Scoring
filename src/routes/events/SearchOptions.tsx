import {
  Button,
  useDisclosure,
  Text,
  Box,
  Flex,
  Checkbox,
  Stack,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Select,
} from "@chakra-ui/react";
import { collection } from "firebase/firestore";
import { Fragment, h } from "preact";
import { Link } from "preact-router";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../util/firebase-config";

interface SearchOptionsProps {}

export default function SearchOptions(props) {
  const { getDisclosureProps, getButtonProps } = useDisclosure();
  const orgsRef = collection(db, "organizations");
  const [orgs, orgsLoading] = useCollection(orgsRef);
  // This could come from a db using org adresses
  // good opp for external api
  const countries = [
    { name: "USA" },
    { name: "Canada" },
    { name: "Argentina" },
    { name: "The Computer" },
  ];
  const countryOnChange = (e) => {
    console.log("countryOnChange ", e.target.value);
  };

  const orgOnChange = (e) => {
    console.log("orgOnChange ", e.target.value);
  };

  const buttonProps = getButtonProps();
  const disclosureProps = getDisclosureProps();
  return (
    <Fragment>
      <Button {...buttonProps} ml={4}>
        Filter
      </Button>
      <Box {...disclosureProps} mt={4} mx={6}>
        <Text>Country:</Text>
        <Select
          placeholder="Select Organization"
          mb={2}
          onChange={countryOnChange}
        >
          {!orgsLoading &&
            countries.map((org) => (
              <option value={org.name}>{org.name}</option>
            ))}
        </Select>
        <Text>Organization:</Text>
        <Select placeholder="Select Organization" mb={2} onChange={orgOnChange}>
          {!orgsLoading &&
            orgs?.docs.map((org) => (
              <option value={org.id}>{org.data().orgName}</option>
            ))}
        </Select>
        <Text>Year Range:</Text>
        <RangeSlider
          aria-label={["min", "max"]}
          defaultValue={[80, 100]}
          onChangeEnd={(val) => console.log(val)}
        >
          <Flex justifyContent={"space-evenly"} mb={6}>
            <Text fontSize="xs">1970</Text>
            <Text fontSize="xs">1980</Text>
            <Text fontSize="xs">1990</Text>
            <Text fontSize="xs">2000</Text>
            <Text fontSize="xs">2010</Text>
            <Text fontSize="xs">2020</Text>
          </Flex>
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} />
          <RangeSliderThumb index={1} />
        </RangeSlider>
      </Box>
    </Fragment>
  );
}

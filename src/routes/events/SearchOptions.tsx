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
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { collection } from "firebase/firestore";
import { Fragment, h } from "preact";
import { Link } from "preact-router";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../util/firebase-config";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useState } from "preact/hooks";

interface SearchOptionsProps {}

export default function SearchOptions(props) {
  const { setCountry, setOrg, ...rest } = props;
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
    setCountry(e.target.value);
  };

  const orgOnChange = (e) => {
    console.log("orgOnChange ", e.target.value);
    setOrg(e.target.value);
  };

  const buttonProps = getButtonProps();
  const disclosureProps = getDisclosureProps();

  return (
    <Fragment>
      <Flex ml={4} {...buttonProps} color="blue.400" alignItems="center">
        {disclosureProps.hidden ? (
          <Fragment>
            <Icon as={ChevronRightIcon} boxSize={5} />
            <Text fontSize="sm">Filter options</Text>
          </Fragment>
        ) : (
          <Fragment>
            <Icon as={ChevronLeftIcon} boxSize={5} />
            <Text fontSize="sm">Close options</Text>
          </Fragment>
        )}
      </Flex>
      <Box {...disclosureProps} mt={2} mx={6}>
        <Text>Country:</Text>
        <Select
          placeholder="Select Country"
          bg={useColorModeValue("white", "blackAlpha.400")}
          mb={2}
          onChange={(e) => setCountry(e.target.value)}
        >
          {!orgsLoading &&
            countries.map((org) => (
              <option value={org.name}>{org.name}</option>
            ))}
        </Select>

        <Text>Organization:</Text>
        <Select
          placeholder="Select Organization"
          bg={useColorModeValue("white", "blackAlpha.400")}
          mb={2}
          onChange={orgOnChange}
        >
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
          <Flex justifyContent={"space-evenly"} mb={8} fontSize="xs">
            <Text>1970</Text>
            <Text>1980</Text>
            <Text>1990</Text>
            <Text>2000</Text>
            <Text>2010</Text>
            <Text>2020</Text>
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

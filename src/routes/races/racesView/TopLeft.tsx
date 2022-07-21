import { Box, Divider, Flex, LinkBox, LinkOverlay, Text, useColorModeValue } from "@chakra-ui/react";
import { Fragment, h } from "preact";
//Icons

export default function TopLeft({ race, action }) {
  return (
    <Fragment>
      <LinkBox
        as={Flex}
        alignItems={"center"}
        color="gray.500"
        onClick={() => {
          action(race);
        }}
      >
        <LinkOverlay as={Box} w="100%">
          <Text px={3} fontSize={22} fontWeight={"semibold"} color={useColorModeValue("gray.600", "whiteAlpha.700")}>
            {race.data().name ? race.data().name : `Race ${race.data().rank}`}
          </Text>
          <Divider />
        </LinkOverlay>
      </LinkBox>
    </Fragment>
  );
}

import { Box, Divider, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { Fragment, h } from "preact";
//Icons

export default function TopLeft({ race, action }) {
  return (
    <Fragment>
      <Flex
        alignItems={"center"}
        color="gray.500"
        onClick={() => {
          action(race);
        }}
      >
        <Box w="100%">
          <Text px={3} fontSize={22} fontWeight={"semibold"} color={useColorModeValue("gray.600", "whiteAlpha.700")}>
            {race.data().name ? race.data().name : `Race ${race.data().rank}`}
          </Text>
          <Divider />
        </Box>
      </Flex>
    </Fragment>
  );
}

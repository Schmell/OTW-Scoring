import { Flex, Text } from "@chakra-ui/react";
import { Fragment } from "preact";
// Icons

export default function BottomEnd({ race }) {
  return (
    <Fragment>
      <Flex py={4} color="gray.400" justifyContent={"end"} pr={2}>
        <Text fontSize={16}>{race.data().date} - </Text>
        <Text>{race.data().time}</Text>
      </Flex>
    </Fragment>
  );
}

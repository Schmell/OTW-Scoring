import { Tooltip, IconButton, Icon, Button, Box, Text, Flex } from "@chakra-ui/react";
import { Fragment, h } from "preact";
// Icons
import SailingIcon from "@mui/icons-material/Sailing";

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

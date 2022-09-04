import {
  Box,
  Flex,
  Text,
  Heading,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { h } from "preact";
import { Link } from "preact-router/match";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Notfound() {
  return (
    <Box m={8}>
      <Heading color={useColorModeValue("blue.400", "blue.200")}>
        Error 404
      </Heading>
      <Text as="h3" color="gray.400">
        That page doesn&apos;t exist.
      </Text>
      <Link
        href="#"
        onClick={() => {
          history.back();
        }}
      >
        <Flex alignItems="center" my={4} gap={2}>
          <Icon as={ArrowBackIcon} />
          <Heading size="sm" p={0} m={0}>
            Back
          </Heading>
        </Flex>
      </Link>
    </Box>
  );
}

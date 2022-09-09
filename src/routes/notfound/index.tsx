import { Box, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router/match";
// import { MdChevronLeft } from "react-icons/md";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const Notfound: FunctionalComponent = () => {
  return (
    <Box m={16}>
      <Heading color={"blue.400"}>Error 404</Heading>
      <Text as={"p"}>That page doesn&apos;t exist.</Text>
      <Link
        href="#"
        onClick={() => {
          history.back();
        }}
      >
        <Flex>
          <Heading size={"sm"} color="black" my={4}>
            <Icon as={ChevronLeftIcon} mr={2} />
            Back
          </Heading>
        </Flex>
      </Link>
    </Box>
  );
};

export default Notfound;

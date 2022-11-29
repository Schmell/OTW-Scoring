import {
  Box,
  Flex,
  Heading,
  Progress,
  useColorModeValue,
} from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { FadeInSlideLeft, FadeInSlideRight } from "../animations/FadeSlide";

export default function PageHead(props) {
  const { title, children, loading, noSpace } = props;
  return (
    <Fragment>
      {!noSpace && <Box my={14}>{""}</Box>}
      <Flex
        justifyContent="space-between"
        alignItems="center"
        px={4}
        py={4}
        w="100%"
        boxShadow="md"
        position="relative"
        borderBottomWidth={4}
        borderColor={useColorModeValue("gray.200", "blackAlpha.600")}
        borderBottomEndRadius="2em"
        bgGradient={useColorModeValue(
          "linear(to-b, whiteAlpha.200, white)",
          "linear(to-b, blackAlpha.50, blackAlpha.600)"
        )}
      >
        <FadeInSlideRight>
          <Heading
            fontSize={title && title.length < 24 ? "4xl" : "2xl"}
            color="blue.400"
          >
            {title}
          </Heading>
        </FadeInSlideRight>
        {children && (
          <FadeInSlideLeft>
            <Flex gap={2}>{children}</Flex>
          </FadeInSlideLeft>
        )}
      </Flex>
      {loading && (
        <Progress
          isIndeterminate
          size="xs"
          w="90%"
          top={-1}
          zIndex={20}
          bg="gray.200"
        />
      )}
    </Fragment>
  );
}

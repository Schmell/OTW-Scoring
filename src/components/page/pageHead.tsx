import { Flex, Heading, Progress, useColorModeValue } from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { FadeInSlideLeft, FadeInSlideRight } from "../animations/FadeSlide";

export default function PageHead(props) {
  const { title, children, loading } = props;
  return (
    <Fragment>
      <Flex
        justifyContent="space-between"
        px={4}
        py={6}
        mt={12}
        w="100%"
        bgGradient={useColorModeValue(
          "linear(to-b, gray.50, white)",
          "linear(to-b, blackAlpha.100, blackAlpha.600)"
        )}
        boxShadow="md"
        position="relative"
        borderBottomWidth={4}
        borderColor="gray.200"
        borderBottomEndRadius="2em"
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
          w="full"
          top={-1}
          zIndex={20}
          bg="gray.200"
        />
      )}
    </Fragment>
  );
}

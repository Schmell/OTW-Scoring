import { Flex, Heading, Progress } from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { FadeInSlideLeft, FadeInSlideRight } from "../animations/FadeSlide";

export default function PageHead(props) {
  const { title, children, loading } = props;
  return (
    <Fragment>
      <Flex
        justifyContent="space-between"
        alignItems="end"
        px={4}
        py={6}
        mt={10}
        w="100%"
        // bg="white"
        bgGradient="linear(to-b, whiteAlpha.100, white)"
        boxShadow="lg"
        position="relative"
        borderBottomWidth={4}
        borderColor="gray.200"
      >
        <FadeInSlideRight>
          <Heading fontSize="4xl" color="blue.400">
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

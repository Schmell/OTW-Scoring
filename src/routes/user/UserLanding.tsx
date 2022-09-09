import { Fragment, h } from "preact";
import { Box, Container, Heading } from "@chakra-ui/react";
import {
  FadeInSlideRight,
  FadeIn,
} from "../../components/animations/FadeSlide";

const UserLanding = () => {
  return (
    <Fragment>
      <Container>
        <FadeInSlideRight>
          <Heading
            as="h3"
            color="blue.400"
            // position={"fixed"}
            w="100%"
            mt={2}
            pb={3}
            // height={"20px"}
            // bg={"white"}
            // zIndex="+1"
          >
            User area
          </Heading>
        </FadeInSlideRight>
        <FadeIn>
          <Box mx={4}></Box>
        </FadeIn>
      </Container>
    </Fragment>
  );
};
export default UserLanding;

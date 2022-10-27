import { Box, Container, Heading } from "@chakra-ui/react";
import { Fragment, h } from "preact";
import {
  FadeIn,
  FadeInSlideRight,
} from "../../components/animations/FadeSlide";

const UserLanding = () => {
  return (
    <Fragment>
      <Container>
        <FadeInSlideRight>
          <Heading as="h3" color="blue.400" w="100%" mt={2} pb={3}>
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

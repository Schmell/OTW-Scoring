import { Fragment, h } from "preact";
import { Box, Container, Heading } from "@chakra-ui/react";
import {
  FadeInSlideRight,
  FadeIn,
} from "../../components/animations/FadeSlide";

export default function UserLanding() {
  return (
    <Fragment>
      <Container>
        <FadeInSlideRight>
          <Heading color="blue.400" w="100%" mt={2} pb={3}>
            User area
          </Heading>
        </FadeInSlideRight>
        <FadeIn>
          <Box mx={4}></Box>
        </FadeIn>
      </Container>
    </Fragment>
  );
}
// export default UserLanding;

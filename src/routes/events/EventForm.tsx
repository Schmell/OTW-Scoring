import { Divider, Flex, Heading, IconButton } from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { FadeInSlideRight } from "../../components/animations/FadeSlide";
import { MdLibraryAdd } from "react-icons/md";

const EventForm = ({ user, setHeaderTitle }) => {
  setHeaderTitle("New Event");
  //   console.log("EventForm - user: ", user);
  return (
    <Fragment>
      <Flex justifyContent="space-between" alignItems="end">
        <FadeInSlideRight>
          <Heading as="h4" color="blue.400">
            Select event
          </Heading>
        </FadeInSlideRight>

        <IconButton
          aria-label="Add Event"
          icon={<MdLibraryAdd />}
          colorScheme={"blue"}
          variant={"outline"}
          boxShadow={"md"}
        ></IconButton>
      </Flex>

      <Divider mt={3} />
    </Fragment>
  );
};
export default EventForm;

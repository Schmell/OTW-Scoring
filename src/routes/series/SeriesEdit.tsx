import { Fragment, h } from "preact";
import { route } from "preact-router";
import { Divider, Flex, Heading, IconButton } from "@chakra-ui/react";
import { MdOutlineAddToPhotos, MdOutlineFileUpload } from "react-icons/md";
import { FadeInSlideLeft, FadeInSlideRight } from "../../components/animations/FadeSlide";


const SeriesEdit = ({setHeaderTitle}) => {
  setHeaderTitle('Edit Series')

  return (
    <Fragment>
      <Flex justifyContent="space-between" alignItems="end">
        <FadeInSlideRight>
          <Heading as="h4" color="blue.400">
            Edit Series
          </Heading>
        </FadeInSlideRight>

        {/* Sub header buttons */}
        <FadeInSlideLeft>
          <IconButton
            aria-label="upload"
            colorScheme="blue"
            variant="outline"
            boxShadow="md"
            mr={2}
            _visited={{ color: "blue" }}
            onClick={() => route("/upload")}
            icon={<MdOutlineFileUpload />}
          />

          <IconButton
            aria-label="add series"
            colorScheme="blue"
            variant="outline"
            boxShadow="md"
            _visited={{ color: "blue" }}
            // onClick={() => route("/series/edit")}
            icon={<MdOutlineAddToPhotos />}
          />
        </FadeInSlideLeft>
      </Flex>

      <Divider mt={3} border="8px" />
    
 
    </Fragment>
  )
}

export default SeriesEdit
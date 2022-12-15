import {
  Box,
  Checkbox,
  Flex,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import {
  collection,
  doc,
  DocumentData,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Fragment, h } from "preact";
import { useState } from "preact/hooks";
import { useCollection } from "react-firebase-hooks/firestore";
import { FadeInSlideLeft } from "../../components/animations/FadeSlide";
import PriBtn from "../../components/generic/PriBtn";
import { db } from "../../util/firebase-config";

type AddSeriesModalProps = {
  disclosure: any;
  eventId?: string;
  event: DocumentData | undefined;
  user: User;
};

const AddSeriesModal = (props: AddSeriesModalProps) => {
  const { disclosure, event, user, ...rest } = props;

  const [seriesList, setSeriesList] = useState([] as any);

  // Can or should we be able to add series to multiple events?
  const seriesRef = collection(db, "series");
  const seriesQuery = query(
    seriesRef,
    where("__owner", "==", user.uid),
    where("__event", "in", [event?.id, ""])
  );

  const [series, seriesLoading] = useCollection(seriesQuery);

  const handleAddSeries = () => {
    seriesList.forEach(async (series) => {
      const docRef = doc(db, "series", series);
      await updateDoc(docRef, {
        __event: event?.id,
        __eventName: event?.data()?.name,
      });
      // const q = query(serRef, where("id", "==", series ))
      // const docs = await getDocs(q)
    });
  };

  return (
    <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add series to Event</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <List>
            {seriesLoading ? (
              <Flex justifyContent="center" alignItems="center" mt={8}>
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
              </Flex>
            ) : (
              series?.docs.map((series) => (
                <Fragment>
                  <FadeInSlideLeft>
                    <ListItem key={series.id}>
                      <Flex justifyContent="space-between">
                        <Box>
                          <Text>{series.data().event}</Text>

                          <Text fontSize="xs" color="gray.400">
                            {series.id}
                          </Text>
                        </Box>

                        <Box>
                          <Checkbox
                            onChange={() => {
                              setSeriesList([...seriesList, series.id]);
                            }}
                          />
                        </Box>
                      </Flex>

                      <Text fontSize="xs" color="gray.400">
                        {series.data().venue}
                      </Text>
                    </ListItem>
                  </FadeInSlideLeft>
                </Fragment>
              ))
            )}
          </List>
        </ModalBody>

        <ModalFooter>
          <PriBtn
            w="100%"
            onClick={() => {
              handleAddSeries();
              disclosure.onClose();
            }}
          >
            Add series list to event
          </PriBtn>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddSeriesModal;

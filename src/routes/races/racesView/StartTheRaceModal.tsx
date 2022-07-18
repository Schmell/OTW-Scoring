import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  useColorModeValue,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Box,
} from "@chakra-ui/react";
import { collection, doc, DocumentData, query, QueryDocumentSnapshot, where } from "firebase/firestore";
import { ComponentChildren, Fragment, h } from "preact";
import { useDocumentData } from "react-firebase-hooks/firestore";
import useStorage from "../../../hooks/useStorage";
import { db } from "../../../util/firebase-config";
import { formatDate, formatRelativeDate, formatTime } from "../../../util/formatters";

interface SartTheRaceProps {
  disclosure: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onToggle: () => void;
    isControlled: boolean;
    getButtonProps: (props?: any) => any;
    getDisclosureProps: (props?: any) => any;
  };
  race: any;
  callback?: (id: string) => Promise<void>;
  children?: ComponentChildren;
}
export default function StartTheRaceModal({ disclosure, race, callback }: SartTheRaceProps) {
  const { isOpen, onOpen, onClose } = disclosure;

  const timeDifference = () => {
    // const thenTime =
    console.log("date: ", formatDate(race!.data().date));
    console.log("time: ", `${formatDate(race!.data().date)} ${formatTime(race!.data().time)}`);

    const then = new Date(`${formatDate(race.data().date)} ${formatTime(race.data().time)}`);
    console.log("then: ", then);
    const now = new Date();
    const newThen = new Date(formatDate(race!.data().date));
    console.log("newThen: ", formatDate(race!.data().date));
    // console.log("now: ", now);
    // const diff = diffMinutes(then, now);
    // console.log("diff: ", diff);
    // console.log("relative date: ", formatRelativeDate(then, now));

    // return formatRelativeDate(then);
  };

  return (
    <Fragment>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2px" />
        <ModalContent>
          <ModalHeader bgColor={useColorModeValue("blackAlpha.200", "blackAlpha.500")}>
            <Text fontSize="2xl">Start the Race</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Text>{race.data().name}</Text>
              <Text>This Race is scheduled to start at {race.data().time}</Text>
              <Text>on {new Date(formatDate(race.data().date)).toDateString()}</Text>
            </Box>
            <Box>
              <Text>{race && race.data() && timeDifference()}</Text>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              bgColor={"green.500"}
              mr={3}
              onClick={() => {
                // callback?.(itemId);
                onClose();
              }}
            >
              Start the race now?
            </Button>
            <Button colorScheme="blue" variant="outline" onClick={onClose}>
              Use scheduled time
            </Button>
            <Button colorScheme="blue" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Fragment>
  );
}

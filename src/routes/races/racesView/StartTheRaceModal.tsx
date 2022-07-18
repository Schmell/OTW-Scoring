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
  IconButton,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { collection, doc, DocumentData, query, QueryDocumentSnapshot, where } from "firebase/firestore";
import { ComponentChildren, Fragment, h } from "preact";
import { useDocumentData } from "react-firebase-hooks/firestore";
import useStorage from "../../../hooks/useStorage";
import { db } from "../../../util/firebase-config";
import { formatDate, formatRelativeDate, formatTime } from "../../../util/formatters";
import CloseIcon from "@mui/icons-material/Close";

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
    const then = new Date(`${formatDate(race.data().date)} ${formatTime(race.data().time)}`);
    return formatRelativeDate(then);
  };

  return (
    <Fragment>
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2px" />
        <ModalContent>
          <ModalHeader bgColor={useColorModeValue("blackAlpha.200", "blackAlpha.500")}>
            <Text fontSize="2xl">Start the Race</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Text>{race.data().name}</Text>
              <Text>
                This Race is scheduled to start{" "}
                <Text fontWeight={"bold"}>{race && race.data() && timeDifference()}</Text> at {race.data().time}
              </Text>
              <Text>on {new Date(formatDate(race.data().date)).toDateString()}</Text>
            </Box>
            <Box></Box>
          </ModalBody>

          <ModalFooter>
            <Flex gap={2}>
              <Button
                color={"white"}
                bgColor={"green.500"}
                onClick={() => {
                  // callback?.(itemId);
                  onClose();
                }}
              >
                Now
              </Button>
              <Button colorScheme="blue" variant="outline" onClick={onClose}>
                Scheduled
              </Button>
              <IconButton
                aria-label="cancel"
                icon={(<Icon as={CloseIcon} />) as any}
                colorScheme="blue"
                variant="outline"
                onClick={onClose}
              />
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Fragment>
  );
}

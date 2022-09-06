import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ComponentChildren, Fragment } from "preact";
import {
  formatDate,
  formatRelativeDate,
  formatTime,
} from "../../../util/formatters";

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
export default function StartTheRaceModal({
  disclosure,
  race,
  callback,
}: SartTheRaceProps) {
  const { isOpen, onClose } = disclosure;

  const timeDifference = () => {
    if (!race.data().date || !race.data().time) {
      return;
    }
    const then = new Date(
      `${formatDate(race.data().date)} ${formatTime(race.data().time)}`
    );
    return formatRelativeDate(then);
  };

  return (
    <Fragment>
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2px" />
        <ModalContent>
          <ModalHeader
            bgColor={useColorModeValue("blackAlpha.200", "blackAlpha.500")}
          >
            <Text fontSize="2xl">Start the Race</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Text fontSize="2xl">{race.data().name}</Text>
              <Text>
                This Race is scheduled to start{" "}
                <Text fontWeight={"bold"}>
                  {race && race.data() && timeDifference()}
                </Text>
                <Text>
                  {" "}
                  at {race.data().time} on{" "}
                  {new Date(formatDate(race.data().date)).toDateString()}
                </Text>
                <Text>
                  To use the On the Water Scoring App select one from below
                </Text>
              </Text>
            </Box>
            <Flex gap={2} justify={"end"}>
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
              <Button onClick={onClose}>Scheduled</Button>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" onClick={onClose}>
              Enter results manually
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Fragment>
  );
}

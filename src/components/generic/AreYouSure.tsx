import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { deleteDoc, doc } from "firebase/firestore";
import { ComponentChildren, Fragment, h } from "preact";
import { db } from "../../util/firebase-config";

interface AreYouSureProps {
  disclosure: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onToggle: () => void;
    isControlled: boolean;
    getButtonProps: (props?: any) => any;
    getDisclosureProps: (props?: any) => any;
  };
  callback?: (id: string) => Promise<void>;
  itemId: string;
  children: ComponentChildren;
  title?: string;
  colPath?: string;
  risk?: "low" | "medium" | "high";
}

export function AreYouSure({ disclosure, callback, itemId, children, title, colPath, risk }: AreYouSureProps) {
  /* Modal component for deleting documents
   *
   */
  // destructure the useDisclosure prop passed in
  const { isOpen, onClose } = disclosure;

  if (!callback) {
    callback = async () => {
      if (!colPath) return;
      await deleteDoc(doc(db, colPath, itemId));
    };
  }
  const riskColor = () => {
    if (risk && risk !== "high") {
      if (risk === "low") return useColorModeValue("green.500", "green.400");
      if (risk === "medium") return useColorModeValue("orange.500", "orange.400");
    }
    return useColorModeValue("red.500", "red.900");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xs">
      <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2px" />
      <ModalContent>
        <ModalHeader bgColor={useColorModeValue("blackAlpha.200", "blackAlpha.500")}>
          <Text fontSize="2xl">{title ? title : "Are you sure?"}</Text>
          <Text fontSize="xs" color={riskColor()}>
            The risk level is <b>{risk ? risk.toUpperCase() : "HIGH"}</b> for this operation
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Fragment>{children}</Fragment>
        </ModalBody>

        <ModalFooter>
          <Button
            bgColor={riskColor()}
            mr={3}
            onClick={() => {
              callback?.(itemId);
              onClose();
            }}
          >
            Delete
          </Button>
          <Button colorScheme="blue" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

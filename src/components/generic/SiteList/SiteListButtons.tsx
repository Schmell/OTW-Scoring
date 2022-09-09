import {
  Flex,
  Tooltip,
  IconButton,
  Icon,
  Box,
  useDisclosure,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { route } from "preact-router";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { AreYouSure } from "../AreYouSure";
// import { Lorem } from "@faker-js/faker/modules/lorem";

interface SiteListButtonProps {
  item: QueryDocumentSnapshot<DocumentData>;
  listType: string;
  setStorage: (id: string) => void;
  disclosure: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onToggle: () => void;
    isControlled: boolean;
    getButtonProps: (props?: any) => any;
    getDisclosureProps: (props?: any) => any;
  };
  children?: any;
}

export function SiteListButtons(props: SiteListButtonProps) {
  const { setStorage, item, listType, children, ...rest } = props;
  const disclosure = useDisclosure();

  return (
    <Fragment>
      <Flex gap={3}>
        <Tooltip
          label={`Edit ${listType}`}
          hasArrow
          bg="blue.300"
          placement="bottom-start"
        >
          <IconButton
            aria-label={`Edit ${listType}`}
            icon={(<Icon as={EditIcon} boxSize={7} />) as any}
            size={"sm"}
            variant="ghost"
            onClick={() => {
              setStorage(item.id);
              route(`/${listType}/edit`);
            }}
          />
        </Tooltip>

        <Tooltip
          label={`Delete ${listType}`}
          hasArrow
          bg="blue.300"
          placement="bottom-start"
        >
          <IconButton
            aria-label={`Delete ${listType}`}
            icon={(<Icon as={CloseIcon} boxSize={7} />) as any}
            size={"sm"}
            variant="ghost"
            // onClick={disclosure.onOpen}
            onClick={disclosure.onOpen}
          />
        </Tooltip>
      </Flex>
      {/* {item.id} */}
      {/* {children} */}
      <AreYouSure itemId={item.id} disclosure={disclosure} colPath={listType}>
        {children}
      </AreYouSure>
    </Fragment>
  );
}

const OpenModal = ({ item, disclosure, children }) => {
  return (
    <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={disclosure.onClose}>
            Close
          </Button>
          <Button variant="ghost">Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

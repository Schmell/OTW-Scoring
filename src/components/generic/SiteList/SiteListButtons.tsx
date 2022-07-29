import { Flex, Tooltip, IconButton, Icon } from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { route } from "preact-router";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

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
  // children: any;
}

export function SiteListButtons({ setStorage, item, disclosure, listType }: SiteListButtonProps) {
  return (
    <Fragment>
      <Flex gap={3}>
        <Tooltip label={`Edit ${listType}`} hasArrow bg="blue.300" placement="bottom-start">
          <IconButton
            aria-label={`Edit ${listType}`}
            icon={(<Icon as={EditIcon} boxSize={7} />) as any}
            size={"sm"}
            variant="ghost"
            colorScheme={"blue"}
            onClick={() => {
              setStorage(item.id);
              route(`/${listType}/edit`);
            }}
          />
        </Tooltip>

        <Tooltip label={`Delete ${listType}`} hasArrow bg="blue.300" placement="bottom-start">
          <IconButton
            aria-label={`Delete ${listType}`}
            icon={(<Icon as={CloseIcon} boxSize={7} />) as any}
            size={"sm"}
            variant="ghost"
            colorScheme={"blue"}
            onClick={disclosure.onOpen}
          />
        </Tooltip>
      </Flex>
    </Fragment>
  );
}

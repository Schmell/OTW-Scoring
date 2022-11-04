import { Flex, useDisclosure } from "@chakra-ui/react";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { Fragment, h } from "preact";
import { route } from "preact-router";
import { AreYouSure } from "../AreYouSure";
import ToolIconButton from "../ToolIconButton";

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
        <ToolIconButton
          aria-label={`Edit ${listType}`}
          icon={EditIcon}
          size={"sm"}
          variant="ghost"
          onClick={() => {
            setStorage(item.id);
            route(`/${listType}/edit`);
          }}
        />

        <ToolIconButton
          aria-label={`Delete ${listType}`}
          icon={CloseIcon}
          size={"sm"}
          variant="ghost"
          onClick={disclosure.onOpen}
        />
      </Flex>

      <AreYouSure itemId={item.id} disclosure={disclosure} colPath={listType}>
        {children}
      </AreYouSure>
    </Fragment>
  );
}

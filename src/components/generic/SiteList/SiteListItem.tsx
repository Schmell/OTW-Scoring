import { Box, ListItem, useColorModeValue } from "@chakra-ui/react";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { Fragment, h } from "preact";
import { FadeInSlideLeft } from "../../animations/FadeSlide";
import { AreYouSure } from "../AreYouSure";

interface SiteListProps {
  item: QueryDocumentSnapshot<DocumentData>;
  listType: string;
  disclosure: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onToggle: () => void;
    isControlled: boolean;
    getButtonProps: (props?: any) => any;
    getDisclosureProps: (props?: any) => any;
  };
  children: any;
}

export function SitelIstItem({ item, disclosure, listType, children }: SiteListProps) {
  return (
    <Fragment>
      <FadeInSlideLeft>
        <ListItem
          key={item.id}
          p={4}
          my={6}
          borderWidth="1px"
          borderBottomWidth={4}
          borderColor={useColorModeValue("gray.200", "gray.600")}
          borderBottomRightRadius={18}
          shadow={"md"}
        >
          {children}
          <AreYouSure disclosure={disclosure} colPath={listType} itemId={item.id}>
            <Box>{`This will delete the ${listType} and is not undo-able`}</Box>
            <Box>{`You will loose any work you have done with this ${listType}`}</Box>
          </AreYouSure>
        </ListItem>
      </FadeInSlideLeft>
    </Fragment>
  );
}

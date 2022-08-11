import { ListItem, useColorModeValue } from "@chakra-ui/react";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { Fragment, h } from "preact";
import { SiteListAnimation } from "../../animations/FadeSlide";

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

export function SiteListItem({ item, children }: SiteListProps) {
  return (
    <Fragment>
      <SiteListAnimation>
        <ListItem
          key={item.id}
          p={4}
          my={6}
          borderWidth="1px"
          borderBottomWidth={4}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          borderBottomColor={useColorModeValue("gray.100", "gray.400")}
          borderBottomRightRadius={18}
          shadow={"md"}
          bgColor={useColorModeValue("white", "blackAlpha.300")}
        >
          {children}
          {/* <AreYouSure disclosure={disclosure} colPath={listType} itemId={item.id}>
            <Box>{`This will delete the ${listType} and is not undo-able`}</Box>
            <Box>{`You will loose any work you have done with this ${listType}`}</Box>
          </AreYouSure> */}
        </ListItem>
      </SiteListAnimation>
    </Fragment>
  );
}

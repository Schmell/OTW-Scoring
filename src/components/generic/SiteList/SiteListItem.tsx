import { ListItem, useColorModeValue } from "@chakra-ui/react";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { Fragment, h } from "preact";
import { SiteListAnimation } from "../../animations/FadeSlide";

interface SiteListProps {
  item: QueryDocumentSnapshot<DocumentData> | any;
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
  [x: string]: any;
}

export function SiteListItem({ item, children, ...rest }: SiteListProps) {
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
          borderBottomRightRadius="2em"
          borderTopLeftRadius={18}
          shadow={"md"}
          bgColor={useColorModeValue("white", "blackAlpha.300")}
          minHeight={32}
          {...rest}
        >
          {children}
        </ListItem>
      </SiteListAnimation>
    </Fragment>
  );
}

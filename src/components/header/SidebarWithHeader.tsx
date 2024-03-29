import { Box, Drawer, DrawerContent, useDisclosure } from "@chakra-ui/react";
import { h } from "preact";
import MobileNav from "./MobileNav";
import SidebarContent from "./SidebarContent";

export default function SidebarWithHeader({ children, headerTitle }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    // This is the Content Area
    <Box maxW="1000px" m="auto" className="mainPane">
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
        headerTitle={headerTitle}
      />

      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} headerTitle={headerTitle} />
        </DrawerContent>
      </Drawer>

      {/* mobilenav */}
      <MobileNav onOpen={onOpen} headerTitle={headerTitle} />

      {/* This is where content lives */}
      <Box ml={{ base: 0, md: 60 }} py={1}>
        {children}
      </Box>
    </Box>
  );
}

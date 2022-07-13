import { h } from "preact";
import { Box, Drawer, DrawerContent, useColorModeValue, useDisclosure } from "@chakra-ui/react";
//
import MobileNav from "./MobileNav";
import SidebarContent from "./sideBarContent";

export default function SidebarWithHeader({ children, headerTitle }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    // This is the Content Area
    <Box minH="100vh" maxW="1000px" m="auto" bg={useColorModeValue("white", "gray.900")}>
      <SidebarContent onClose={() => onClose} display={{ base: "none", md: "block" }} headerTitle={headerTitle} />

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
      <Box ml={{ base: 0, md: 60 }} p={4}>
        {children}
      </Box>
    </Box>
  );
}

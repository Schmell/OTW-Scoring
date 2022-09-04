import {
  BoxProps,
  Box,
  useColorModeValue,
  Flex,
  CloseButton,
  Text,
} from "@chakra-ui/react";
import { h } from "preact";
import { Link as PLink } from "preact-router";
// import { IconType } from "react-icons";

import Home from "@mui/icons-material/Home";
import MdPeople from "@mui/icons-material/People";
import MdCloudUpload from "@mui/icons-material/CloudUpload";
import MdCalendarToday from "@mui/icons-material/CalendarToday";
import MdOutlineMediation from "@mui/icons-material/Mediation";
import MdSailing from "@mui/icons-material/Sailing";
import MdSettings from "@mui/icons-material/Settings";
import NavItem from "./NavItem";

interface SidebarProps extends BoxProps {
  onClose: () => void;
  headerTitle: string;
}

export default function SidebarContent({
  onClose,
  headerTitle,
  ...rest
}: SidebarProps) {
  const LinkItems = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Import", icon: MdCloudUpload, href: "/import" },
    { name: "Events", icon: MdCalendarToday, href: "/events" },
    { name: "Series", icon: MdOutlineMediation, href: "/series" },
    { name: "Races", icon: MdSailing, href: "/races" },
    { name: "Competiors", icon: MdPeople, href: "/competitors" },
    { name: "Settings", icon: MdSettings, href: "/settings" },
  ];

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: 80, md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      {/* Drawer Header */}
      <Flex
        h={14}
        alignItems="center"
        justifyContent="space-between"
        bg={useColorModeValue("blue.500", "blue.900")}
        borderBottom={1}
        borderBottomColor={useColorModeValue("gray.200", "gray.700")}
        borderBottomLeftRadius={16}
        color={"white"}
        w={"100%"}
        mb={4}
      >
        <Text fontSize="2xl" fontWeight="semibold" mx={8}>
          {headerTitle}
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>

      {/* Add links to Menu */}
      {LinkItems.map((link) => (
        // there is a name conflict betwwen chakra and the router
        <PLink href={link.href} onClick={() => onClose()}>
          <NavItem key={link.name} icon={link.icon}>
            {link.name}
          </NavItem>
        </PLink>
      ))}
    </Box>
  );
}

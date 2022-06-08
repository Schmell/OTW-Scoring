import {
  Avatar,
  Box,
  BoxProps,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  HStack,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Portal,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { h } from "preact";
import { Link as PLink } from "preact-router";
import { useAuthState } from "react-firebase-hooks/auth";
import { IconType } from "react-icons";
import {
  BsChevronDown,
  BsFillCalendarEventFill,
  BsFillDiagram3Fill,
  BsFillPeopleFill,
  BsWind,
} from "react-icons/bs";
import { FiBell, FiHome, FiMenu, FiSettings } from "react-icons/fi";
import { auth } from "../../util/firebase-config";
import ColorModeToggle from "../generic/ColorToggleMode";

// This needs to get in line with routing
interface LinkItemProps {
  name: string;
  icon: IconType;
  href?: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome, href: "/" },
  { name: "Events", icon: BsFillCalendarEventFill, href: "/series" },
  { name: "Series", icon: BsFillDiagram3Fill, href: "/series" },
  { name: "Races", icon: BsWind, href: "/races" },
  { name: "Competiors", icon: BsFillPeopleFill, href: "/competiotrs" },
  { name: "Settings", icon: FiSettings, href: "/settings" },
];

export default function SidebarWithHeader({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    // This is the Content Area
    <Box
      minH="100vh"
      maxW="1000px"
      m="auto"
      bg={useColorModeValue("white", "gray.900")}
    >
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
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
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>

      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />

      {/* This is where content lives */}
      <Box ml={{ base: 0, md: 60 }} p={4}>
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
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
        color={"white"}
        w={"100%"}
        mb={4}
      >
        <Text fontSize="2xl" mx={8}>
          Blw Me
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
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: string | number;
}

const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  // Individual nav items
  // maybe include the router comp in here?
  // there is a name conflict betwwen chakra and the router
  return (
    <Link style={{ textDecoration: "none" }} _focus={{ boxShadow: "none" }}>
      <Flex
        align="center"
        p={4}
        mx={4}
        borderRadius="lg"
        role="group"
        cursor="pointer"
        color={useColorModeValue("gray.900", "gray.100")}
        _hover={{
          bg: useColorModeValue("blue.400", "blue.800"),
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr={4}
            fontSize={16}
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const [user] = useAuthState(auth);

  return (
    // This is the Header
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height={14}
      alignItems="center"
      position={"fixed"}
      zIndex="100"
      w="100%"
      maxW="760px"
      bg={useColorModeValue("blue.500", "blue.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      borderBottomRightRadius="1em"
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <Flex alignItems={"center"}>
        {/* Animate size on the hover and active here */}
        <IconButton
          aria-label="open menu"
          display={{ base: "flex", md: "none" }}
          variant="ghost"
          size="lg"
          color={"white"}
          fontSize="2em"
          _hover={{
            bgcolor: "blue.400",
          }}
          _active={{
            bgcolor: "blue.700",
          }}
          icon={<FiMenu />}
          onClick={onOpen}
        />

        <Text
          display={{ base: "flex", md: "none" }}
          fontSize="2xl"
          // fontWeight="bold"
          color="white"
          ml={4}
        >
          BlwMe
        </Text>
      </Flex>

      <HStack spacing={{ base: "0", md: "6" }}>
        {/* This is the right menu */}
        <ColorModeToggle
          color={"white"}
          variant="ghost"
          // need oolorMode values for hover
          _hover={{ bgColor: "blue.400" }}
        />

        <IconButton
          aria-label="Notifications"
          color={"white"}
          size="lg"
          variant="ghost"
          // need oolorMode values for hover
          _hover={{ bgColor: "blue.400" }}
          icon={<FiBell />}
        />

        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar
                  size={"sm"}
                  name={user?.displayName ? user.displayName : "Unknown"}
                  src={
                    user?.photoURL
                      ? user.photoURL
                      : "../assets/icons/favicon-16x16.png"
                  }
                />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm" color={"white"}>
                    {user?.displayName}
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    Admin
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }} color={"white"}>
                  <BsChevronDown />
                </Box>
              </HStack>
            </MenuButton>

            {/* User Menu */}
            <Box>
              {/* need the portal to put menu on top */}
              <Portal>
                <MenuList
                  bg={useColorModeValue("white", "gray.700")}
                  borderColor={useColorModeValue("gray.700", "gray.100")}
                >
                  <MenuItem>
                    <Link
                      href="/user/profile"
                      _visited={{
                        color: useColorModeValue("gray.700", "gray.100"),
                      }}
                    >
                      Profile
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      href="/user/settings"
                      _visited={{
                        color: useColorModeValue("gray.700", "gray.100"),
                      }}
                    >
                      Settings
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      href="/billing"
                      _visited={{
                        color: useColorModeValue("gray.700", "gray.100"),
                      }}
                    >
                      Billing
                    </Link>
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem>
                    <Link
                      onClick={() => auth.signOut()}
                      _visited={{
                        color: useColorModeValue("gray.700", "gray.100"),
                      }}
                      href="/"
                    >
                      Sign out
                    </Link>
                  </MenuItem>
                </MenuList>
              </Portal>
            </Box>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

import {
  FlexProps,
  Flex,
  useColorModeValue,
  IconButton,
  HStack,
  Menu,
  MenuButton,
  Avatar,
  VStack,
  Box,
  Portal,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  Link,
} from "@chakra-ui/react";
// Preact
import { h } from "preact";
//Firebase
import { DocumentReference, DocumentData, doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { auth, db } from "../../util/firebase-config";
// Generic
import ColorModeToggle from "../generic/ColorToggleMode";
// Icons
import MdMenu from "@mui/icons-material/Menu";
import MdExpandMore from "@mui/icons-material/ExpandMore";
import MdNotificationsNone from "@mui/icons-material/NotificationsNone";
interface MobileProps extends FlexProps {
  onOpen: () => void;
  headerTitle: string;
}

export default function MobileNav({
  onOpen,
  headerTitle,
  ...rest
}: MobileProps) {
  // Need to get user from the db instead
  const [user, userLoading] = useAuthState(auth);

  let userQuery: DocumentReference<DocumentData> | null | undefined;

  if (!userLoading && user) {
    userQuery = doc(db, "user", user.uid);
  }
  const [userInfo, userInfoLoading] = useDocumentData(userQuery);

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
          color="white"
          size="xs"
          _hover={{
            bgcolor: "blue.400",
          }}
          _active={{
            bgcolor: "blue.700",
            border: "none",
          }}
          icon={(<MdMenu />) as any}
          onClick={onOpen}
        />

        <Text
          display={{ base: "flex", md: "none" }}
          fontSize="2xl"
          fontWeight="semibold"
          color="white"
          ml={4}
        >
          {headerTitle}
        </Text>
      </Flex>

      <HStack>
        <Flex alignItems={"center"}>
          {/* This is the right menu */}
          <ColorModeToggle
            aria-label="Color Mode"
            color="white"
            variant="ghost"
            _hover={{ bgColor: "transparent" }}
            _active={{ bgColor: "transparent" }}
            _focus={{ bgColor: "transparent" }}
            mr={-4}
          />

          <IconButton
            aria-label="Notifications"
            color={"white"}
            size="lg"
            variant="ghost"
            _hover={{ bgColor: "transparent" }}
            _active={{ bgColor: "transparent" }}
            _focus={{ bgColor: "transparent" }}
            icon={(<MdNotificationsNone />) as any}
            onClick={() => {}}
          />
        </Flex>

        {/* user header stuff */}
        {userInfo && (
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
                    name={userInfo?.nickname ? userInfo.nickname : "Unknown"}
                    src={
                      userInfo?.photoURL
                        ? userInfo.photoURL
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
                      {userInfo?.nickname}
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      Admin
                    </Text>
                  </VStack>
                  <Box display={{ base: "none", md: "flex" }} color={"white"}>
                    <MdExpandMore />
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
                    <Link
                      href="/user/profile"
                      _hover={{
                        color: useColorModeValue("gray.700", "gray.100"),
                        textDecor: "none",
                      }}
                    >
                      <MenuItem
                        _hover={{
                          color: useColorModeValue("gray.700", "gray.100"),
                        }}
                      >
                        Profile
                      </MenuItem>
                    </Link>

                    <Link
                      href="/user/settings"
                      _hover={{
                        color: useColorModeValue("gray.700", "gray.100"),
                        textDecor: "none",
                      }}
                    >
                      <MenuItem>Settings</MenuItem>
                    </Link>

                    <Link
                      href="/billing"
                      _visited={{
                        color: useColorModeValue("gray.700", "gray.100"),
                      }}
                      _hover={{
                        color: useColorModeValue("gray.700", "gray.100"),
                        textDecor: "none",
                      }}
                    >
                      <MenuItem>Billing</MenuItem>
                    </Link>
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
        )}
      </HStack>
    </Flex>
  );
}

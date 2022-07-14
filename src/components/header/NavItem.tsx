import { h } from "preact";
import { Flex, useColorModeValue, Icon, Link } from "@chakra-ui/react";

export default function NavItem({ icon, children, ...rest }) {
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
}

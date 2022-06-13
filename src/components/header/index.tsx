import { ChevronRightIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { route } from "preact-router";
import { Link } from "preact-router";
import { FadeIn } from "../animations/FadeSlide";
import style from "./style.css";

const Header = ({ headerTitle }) => {
  return (
    <header class={style.header}>
      <FadeIn>
        <Heading as="h1">{headerTitle}</Heading>
      </FadeIn>

      <Menu>
        {({ isOpen }) => (
          <Fragment>
            <MenuButton
              colorScheme={"blue"}
              aria-label="Menu"
              isActive={isOpen}
              size="lg"
              as={IconButton}
              icon={<HamburgerIcon />}
            />
            <MenuList>
              <MenuItem onClick={() => route("/")}>Home</MenuItem>
              <MenuItem onClick={() => route("/series")}>Series</MenuItem>
              <MenuItem onClick={() => route("/upload")}>Upload</MenuItem>
            </MenuList>
          </Fragment>
        )}
      </Menu>
    </header>
  );
};

export default Header;

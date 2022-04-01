import { Fragment, FunctionalComponent, h } from "preact";
import Button from "preact-material-components/Button";
import Drawer from "preact-material-components/Drawer";
import List from "preact-material-components/List";
// import ItemIcon from "preact-material-components/ItemIcon";
import "preact-material-components/Drawer/style.css";
import "preact-material-components/List/style.css";
import "preact-material-components/Button/style.css";

import { useState } from "preact/hooks";

export default function ScoringMenu() {
  const [drawerOpened, setDrawerOpened] = useState(false);
  return (
    <div>
      <Button
        onClick={() => {
          setDrawerOpened(true);
        }}
      >
        Open Drawer
      </Button>
      <Drawer
        modal
        open={drawerOpened}
        onClose={() => {
          setDrawerOpened(false);
        }}
      >
        <Drawer.DrawerHeader>Components</Drawer.DrawerHeader>
        <Drawer.DrawerContent>
          <Drawer.DrawerItem>Home</Drawer.DrawerItem>
        </Drawer.DrawerContent>
      </Drawer>
    </div>
  );
}

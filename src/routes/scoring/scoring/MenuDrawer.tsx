import { h, Component } from "preact";
import Drawer from "preact-material-components/Drawer";
import List from "preact-material-components/List";
import Button from "preact-material-components/Button";
import "preact-material-components/Drawer/style.css";
import "preact-material-components/List/style.css";
import "preact-material-components/Button/style.css";

export default class MenuDrawer extends Component<
  {},
  { drawerOpened: boolean }
> {
  constructor() {
    super();
    this.state = {
      drawerOpened: false,
    };
  }
  render() {
    return (
      <div>
        <Button
          onClick={() => {
            this.setState({
              drawerOpened: !this.state.drawerOpened,
            });
          }}
        >
          Open Drawer
        </Button>
        <Drawer
          modal
          open={this.state.drawerOpened}
          onClose={() => {
            this.setState({
              drawerOpened: false,
            });
          }}
        >
          <Drawer.DrawerHeader className="mdc-theme--primary-bg">
            Components
          </Drawer.DrawerHeader>
          <Drawer.DrawerContent>
            <Drawer.DrawerItem>
              {/* <List.ItemIcon>home</List.ItemIcon> */}
              Home
            </Drawer.DrawerItem>
          </Drawer.DrawerContent>
        </Drawer>
      </div>
    );
  }
}

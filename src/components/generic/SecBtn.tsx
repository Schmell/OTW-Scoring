import { Button } from "@chakra-ui/react";
import { FunctionalComponent, h } from "preact";

interface SecBtnProps {
  onClick?: any;
  [x: string | number]: any;
}

const SecBtn: FunctionalComponent<SecBtnProps> = ({ children, onClick }) => {
  return (
    <Button
      colorScheme={"blue"}
      variant="outline"
      boxShadow="md"
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default SecBtn;

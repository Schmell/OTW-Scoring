import { Button } from "@chakra-ui/react";
import { FunctionalComponent, h } from "preact";

interface SecBtnProps {
  onClick?: any;
  [x: string | number]: any;
}

const SecBtn: FunctionalComponent<SecBtnProps> = ({ children, onClick, width, type }) => {
  return (
    <Button type={type} width={width} onClick={onClick}>
      {children}
    </Button>
  );
};

export default SecBtn;

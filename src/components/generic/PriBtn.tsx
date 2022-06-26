import { Button } from "@chakra-ui/react";
import { FunctionalComponent, h } from "preact";

interface SecBtnProps {
  onClick?: any;
  [x: string | number]: any;
}

const PriBtn: FunctionalComponent<SecBtnProps> = ({
  children,
  onClick,
  width,
}) => {
  return (
    <Button
      colorScheme={"blue"}
      //   variant="outline"
      boxShadow="md"
      width={width}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default PriBtn;

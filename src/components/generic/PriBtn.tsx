import { Button } from "@chakra-ui/react";
import { FunctionalComponent, h } from "preact";

interface PriBtnProps {
  onClick?: () => void;
  [x: string | number]: any;
}

export default function PriBtn(props) {
  const { children, onClick, width, type } = props;
  return (
    <Button
      {...props}
      variant="solid"
      boxShadow="md"
      // width={width}
      // type={type}
      // onClick={() => {
      //   onClick?.();
      // }}
    >
      {children}
    </Button>
  );
}

// export default PriBtn;

import { Button, ButtonProps } from "@chakra-ui/react";
import { FunctionalComponent, h } from "preact";

export default function PriBtn(props: ButtonProps) {
  return (
    <Button {...props} variant="solid" boxShadow="md">
      {props.children}
    </Button>
  );
}

// export default PriBtn;

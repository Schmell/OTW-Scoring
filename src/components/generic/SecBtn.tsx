import { Button } from "@chakra-ui/react";
import { FunctionalComponent, h } from "preact";

interface SecBtnProps {
  onClick?: any;
  [x: string | number]: any;
}

export default function SecBtn(props: SecBtnProps) {
  const { children, onClick, width, type, ...rest } = props;
  return (
    // <Button type={type} width={width} onClick={onClick}>
    //   {children}
    // </Button>
    <Button {...props}>{children}</Button>
  );
}

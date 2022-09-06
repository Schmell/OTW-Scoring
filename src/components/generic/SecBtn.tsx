import { Button } from "@chakra-ui/react";
import { h } from "preact";

interface SecBtnProps {
  onClick?: any;
  width?: any;
  type?: string;
  children?: any;
  [x: string]: any;
}

export default function SecBtn({
  children,
  onClick,
  width,
  type,
}: SecBtnProps) {
  return (
    <Button type={type} width={width} onClick={onClick}>
      {children}
    </Button>
  );
}

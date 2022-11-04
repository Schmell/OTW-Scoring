import { Tooltip, IconButton, Icon, IconButtonProps } from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

interface ToolIconButtonProps extends IconButtonProps {
  icon: any; // not sure why i need this
}

export default function ToolIconButton(props: ToolIconButtonProps) {
  const { "aria-label": ariaLabel, icon, ...rest } = props;

  // const [mounted, setMounted] = useState(false);
  const toolRef = useRef();

  // useEffect(() => {
  //   setMounted(true);
  //   return () => {
  //     setMounted(false);
  //   };
  // }, []);

  return (
    <Fragment>
      {/* {mounted && ( */}
      <Tooltip
        ref={toolRef.current}
        label={ariaLabel}
        hasArrow
        bg="blue.300"
        placement="bottom-start"
      >
        <IconButton
          aria-label={ariaLabel}
          icon={(<Icon as={icon} boxSize={7} />) as any}
          {...rest}
        />
      </Tooltip>
      {/* )} */}
    </Fragment>
  );
}

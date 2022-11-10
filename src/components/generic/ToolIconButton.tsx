import { Icon, IconButton, IconButtonProps, Tooltip } from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { useRef } from "preact/hooks";

interface ToolIconButtonProps extends IconButtonProps {
  icon: any; // not sure why i need this
}

export default function ToolIconButton(props: ToolIconButtonProps) {
  const { "aria-label": ariaLabel, icon, ...rest } = props;

  const toolRef = useRef();

  return (
    <Fragment>
      {/* {mounted && ( */}
      <Tooltip
        label={ariaLabel}
        hasArrow
        bg="blue.300"
        placement="bottom-start"
      >
        <IconButton
          ref={toolRef.current}
          aria-label={ariaLabel}
          icon={(<Icon as={icon} boxSize={7} />) as any}
          {...rest}
        />
      </Tooltip>
      {/* )} */}
    </Fragment>
  );
}

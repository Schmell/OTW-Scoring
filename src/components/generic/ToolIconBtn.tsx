import { Tooltip, IconButton, Icon, Box } from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

interface ToolIconBtnProps {
  action: () => {};
  icon: any;
  label: string;
  disabled?: boolean;
}

export default function ToolIconBtn<ToolIconBtnProps>(props) {
  const { action, icon, label, disabled } = props;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  return (
    <Fragment>
      {mounted && (
        <Tooltip label={label} hasArrow bg="blue.300" placement="bottom-start">
          <IconButton
            disabled={disabled}
            aria-label={label}
            icon={(<Icon as={icon} boxSize={7} />) as any} // not sure why??
            onClick={action}
          />
        </Tooltip>
      )}
    </Fragment>
  );
}

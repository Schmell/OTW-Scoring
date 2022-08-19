import { Tooltip, IconButton, Icon, Box } from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

export default function ToolIconBtn({ action, icon, label }) {
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
            aria-label={label}
            icon={(<Icon as={icon} boxSize={7} />) as any} // not sure why??
            onClick={action}
          />
        </Tooltip>
      )}
    </Fragment>
  );
}

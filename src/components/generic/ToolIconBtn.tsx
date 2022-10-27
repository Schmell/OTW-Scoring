import {
  Tooltip,
  IconButton,
  Icon,
  ComponentWithAs,
  IconButtonProps,
} from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { useEffect, useState } from "preact/hooks";

interface ToolIconBtnProps extends IconButtonProps {
  action: React.MouseEventHandler<HTMLButtonElement> | undefined;
  icon: any;
  label: string;
  // disabled?: boolean;
  // variant?: string;
}

export default function ToolIconBtn(props) {
  // action should go and just pass onClick
  // I think i could just use IconButtonProps and make aria-label as label
  const { action, icon, label, disabled, ...rest } = props;
  const [mounted, setMounted] = useState(false);
  // const buttonRef = useRef();

  useEffect(() => {
    setMounted(true);
    return () => {
      // buttonRef.current
      setMounted(false);
    };
  }, []);

  return (
    <Fragment>
      {mounted && (
        <Tooltip label={label} hasArrow bg="blue.300" placement="bottom-start">
          <IconButton
            // ref={buttonRef}
            disabled={disabled}
            aria-label={label}
            icon={(<Icon as={icon} boxSize={7} />) as any} // not sure why??
            onClick={action}
            {...rest}
          />
        </Tooltip>
      )}
    </Fragment>
  );
}

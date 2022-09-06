import { HStack, Stack, useRadioGroup } from "@chakra-ui/react";
import { IconRadio } from "./IconRadio";
// Icons
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SaveIcon from "@mui/icons-material/Save";

export function DuplicateOptions({ item, setCopy }) {
  // const [copy, setVal] = importTypeState;

  const handleChange = (value) => {
    // setVal(value);
    if (value === "overwrite") {
      setCopy(false);
    }
    if (value === "copy") {
      setCopy(true);
    }
  };

  const { value, getRadioProps, getRootProps } = useRadioGroup({
    defaultValue: "copy",
    onChange: handleChange,
  });

  return (
    <Stack {...(getRootProps() as any)}>
      <HStack>
        <IconRadio
          label="Make a copy"
          name="copy"
          icon={ContentCopyIcon}
          {...getRadioProps({ value: "copy" })}
        />
        <IconRadio
          label="Overwrite existing"
          name="overwrite"
          icon={SaveIcon}
          {...getRadioProps({ value: "overwrite" })}
        />
      </HStack>
    </Stack>
  );
}

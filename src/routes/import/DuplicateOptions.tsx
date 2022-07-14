import { h } from "preact";
import { HStack, Stack, useRadioGroup } from "@chakra-ui/react";
import { useState } from "preact/hooks";
import { IconRadio } from "./IconRadio";
// Icons
import MdContentCopy from "@mui/icons-material/ContentCopy";
import SaveIcon from "@mui/icons-material/Save";

export function DuplicateOptions({ item }) {
  const [val, setVal] = useState();

  const handleChange = (value) => {
    // setVal(value);
    if (value === "overwrite") {
      item.copy = false;
    }
    if (value === "copy") {
      item.copy = true;
    }
  };

  const { value, getRadioProps, getRootProps } = useRadioGroup({
    defaultValue: "copy",
    onChange: handleChange,
  });

  return (
    <Stack {...getRootProps()}>
      <HStack>
        <IconRadio label="Make a copy" name="copy" icon={MdContentCopy} {...getRadioProps({ value: "copy" })} />
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

import { HStack, Stack, useRadioGroup } from "@chakra-ui/react";
import { h } from "preact";
import { useState } from "preact/hooks";
import { MdClear, MdContentCopy, MdDone, MdWebStories } from "react-icons/md";
import { CustomRadio } from "./CustomRadio";

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
        <CustomRadio
          label="Make a copy"
          name="copy"
          icon={MdContentCopy}
          {...getRadioProps({ value: "copy" })}
        />
        <CustomRadio
          label="Overwrite existing"
          name="overwrite"
          icon={MdWebStories}
          {...getRadioProps({ value: "overwrite" })}
        />
      </HStack>
    </Stack>
  );
}

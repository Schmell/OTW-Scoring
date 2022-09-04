import { h } from "preact";
import { useRadio, chakra, Input, Icon, Tooltip } from "@chakra-ui/react";

export function IconRadio(props) {
  const { image, icon, label, ...radioProps } = props;
  const { state, getInputProps, htmlProps, getLabelProps } =
    useRadio(radioProps);

  return (
    <Tooltip label={label} hasArrow bg="blue.300" placement="bottom-start">
      <chakra.label {...htmlProps} cursor="pointer">
        <Input {...getInputProps({})} hidden />

        <Icon
          as={icon}
          color={state.isChecked ? "limegreen" : "gray.400"}
          bg={state.isChecked ? "green:100" : ""}
          {...getLabelProps()}
        />
      </chakra.label>
    </Tooltip>
  );
}

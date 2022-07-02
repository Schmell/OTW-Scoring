import { useRadio, chakra, Input, Icon, Tooltip } from "@chakra-ui/react";
import { h } from "preact";

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
          bg={state.isChecked ? "green:100" : "white"}
          {...getLabelProps()}
          // fontSize={24}
        />
      </chakra.label>
    </Tooltip>
  );
}

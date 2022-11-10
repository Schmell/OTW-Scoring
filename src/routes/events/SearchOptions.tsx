import { Button, useDisclosure, Text } from "@chakra-ui/react";
import { Fragment, h } from "preact";

interface SearchOptionsProps {}

export default function SearchOptions(props) {
  const { getDisclosureProps, getButtonProps } = useDisclosure();

  const buttonProps = getButtonProps();
  const disclosureProps = getDisclosureProps();
  return (
    <>
      <Button {...buttonProps}>Toggle Me</Button>
      <Text {...disclosureProps} mt={4}>
        This text is being visibly toggled hidden and shown by the button.
        <br />
        (Inspect these components to see the rendered attributes)
      </Text>
    </>
  );
}

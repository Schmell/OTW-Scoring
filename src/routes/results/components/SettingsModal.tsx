import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Heading,
  RadioGroup,
  Stack,
  Radio,
  Divider,
  ModalFooter,
  Button,
  useRadio,
  chakra,
  Box,
  Image,
  Input,
} from "@chakra-ui/react";
import { Fragment, h } from "preact";

export default function SettingsModal({ isOpen, onClose, setRowTitle, rowTitle, setResultType, resultType }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Heading size={"sm"} pb={3}>
            View Columns
          </Heading>
          <RadioGroup onChange={setRowTitle} value={rowTitle}>
            <Stack direction="row">
              <Radio value="boat">Boat</Radio>
              <Radio value="helmname">Helm</Radio>
              <Radio value="sailno">SailNo.</Radio>
            </Stack>
          </RadioGroup>
          <Divider my={3} />
          <RadioGroup onChange={setResultType} value={resultType}>
            <Stack direction="row">
              <Radio value="points">Points</Radio>
              <Radio value="elapsed">Elapsed</Radio>
              <Radio value="corrected">Corrected</Radio>
              <Radio value="finish">Finish</Radio>
            </Stack>
          </RadioGroup>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function RadioButton(props) {
  const { value, children, ...radioProps } = props;
  const { state, getInputProps, getCheckboxProps, htmlProps, getLabelProps } = useRadio(radioProps);
  return (
    <Fragment>
      <chakra.label {...htmlProps} cursor="pointer">
        <Input {...getInputProps({})} hidden />
        <Box
          {...getCheckboxProps()}
          //   variant="outline"
          bg={state.isChecked ? "blue" : "gray"}
        >
          <Box {...getLabelProps()}>{children}</Box>
        </Box>
      </chakra.label>
    </Fragment>
  );
}

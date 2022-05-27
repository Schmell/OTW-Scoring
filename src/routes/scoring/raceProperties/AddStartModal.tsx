import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { arrayUnion, updateDoc } from "firebase/firestore";
import { Field, Form, Formik, useFormik } from "formik";
import { h } from "preact";

export const AddStartModal = ({ isOpen, onClose, docRef }) => {
  const upDate = async (start) => {
    await updateDoc(docRef, { starts: arrayUnion(start) });
  };

  const formik = useFormik({
    initialValues: {
      startName: "",
      startTime: "",
    },
    onSubmit: (values) => {
      upDate({ fleet: values.startName, start: values.startTime });
      // alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a Start</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Form onSubmit={formik.handleSubmit}>
            <Input
              type="text"
              name="startName"
              onChange={formik.handleChange}
              value={formik.values.startName}
            />

            <Divider mt={3} />

            <Input
              type="time"
              name="startTime"
              onChange={formik.handleChange}
              value={formik.values.startTime}
            />

            <Divider mt={3} />

            <Button
              type="submit"
              colorScheme="blue"
              mr={3}
              w="100%"
              onClick={onClose}
            >
              Add
            </Button>
          </Form>
        </ModalBody>

        <ModalFooter>
          {/* <Button variant='ghost' onClick={onClose}>Cancel</Button> */}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

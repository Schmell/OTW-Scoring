import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import fileDialog from "file-dialog";
import { Field, Form, Formik } from "formik";
import { h } from "preact";
import { route } from "preact-router";
import { useState } from "preact/hooks";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../util/firebase-config";
import { rePopulate } from "./re-populate";
import style from "./style.css";

const Upload = ({ setHeaderTitle }) => {
  setHeaderTitle("Upload");
  // user Auth should come from firbase config
  const [user] = useAuthState(auth);
  const [files, setFiles] = useState(File[""]);

  let importedFile: any;

  const showDialog = async () => {
    const fd = await fileDialog({ multiple: true, accept: ".blw" });
    const iterable = Array.from(fd);
    setFiles(iterable);
    iterable.forEach((item) => {
      rePopulate(user, item);
    });
  };

  return (
    <Box className={style.upload}>
      <Heading color="blue.400" mb={3}>
        Select File
      </Heading>
      <Formik
        initialValues={{
          file: "",
        }}
        onSubmit={() => {
          // console.log("target.files[0]: ", importedFile);
          rePopulate(user, importedFile);
          route("/series");
        }}
      >
        <Form>
          <Box>
            {/* <FormLabel htmlFor="file">Upload</FormLabel> */}
            <Field
              type="file"
              id="file"
              name="file"
              className={style.fileInput}
              onChange={({ target }) => {
                importedFile = target.files[0];
              }}
            />
          </Box>
          <Box mt={3}>
            <Button
              type="submit"
              variant="outline"
              colorScheme="blue"
              boxShadow="md"
            >
              Submit
            </Button>
          </Box>
        </Form>
      </Formik>

      <Divider my={4} />
      <Flex gap={4} border="solid 1px blue" p={2}>
        <Button
          variant={"outline"}
          boxShadow="lg"
          colorScheme={"blue"}
          onClick={showDialog}
        >
          Choose Files
        </Button>
        <List>
          {files &&
            files.map((file) => (
              <ListItem>
                <Text color={"blue.500"}>{file.name}</Text>
              </ListItem>
            ))}
        </List>
      </Flex>
    </Box>
  );
};

export default Upload;

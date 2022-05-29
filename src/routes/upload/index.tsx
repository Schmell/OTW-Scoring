import {
  Box,
  Button,
  Divider,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { Formik, Field, Form, FormikHelpers } from "formik";
import { h } from "preact";
import { route } from "preact-router";
import { useAuthState } from "react-firebase-hooks/auth";
import { fromInput } from "../../util/blw";
import { auth } from "../../util/firebase-config";
import { populate } from "./populate";
import { rePopulate } from "./re-populate";
import style from "./style.css";

const Upload = ({ setHeaderTitle }) => {
  setHeaderTitle("Upload");
  // user Auth should come from firbase config
  const [user] = useAuthState(auth);

  let importedFile;

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
    </Box>
  );
};

export default Upload;

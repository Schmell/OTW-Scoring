import { Fragment, h } from "preact";
import ToolIconButton from "../../components/generic/ToolIconButton";
import PageHead from "../../components/page/pageHead";

import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormLabel,
  Input,
  Switch,
  Textarea,
  useFocusEffect,
} from "@chakra-ui/react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import {
  collection,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../util/firebase-config";
import { Field, Form, Formik } from "formik";
import useStorage from "../../hooks/useStorage";
import EditIcon from "@mui/icons-material/Edit";
import { addOrganization } from "./addOrganization";
import * as yup from "yup";
import { useState } from "react";
import { useEffect } from "preact/hooks";

interface OrganizationEditProps {
  orgRef?: DocumentReference<DocumentData>;
  orgId: string;
  user: any;
}

export default function OrganizationEdit(props: OrganizationEditProps) {
  const { orgId, user } = props;

  const docRef = doc(db, "organizations", orgId);
  const [org, orgLoading] = useDocument(docRef);

  // const [orgId, setOrgId] = useStorage("orgId");
  const [isPublic, setIsPublic] = useState(org?.data()?.__public);
  // console.log("isPublic ", isPublic);
  useEffect(() => {
    setIsPublic(true);
  }, []);

  const handleSubmit = async (values) => {
    console.log("values ", values);
    // Remove undefined's
    Object.keys(values).forEach((key) =>
      values[key] === undefined ? delete values[key] : {}
    );
    await updateDoc(docRef, { ...values });
  };

  const validationSchema = yup.object({
    contactEmail: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
  });

  return (
    <Fragment>
      <PageHead title="Organization Edit">
        <ToolIconButton
          aria-label="Add Organization"
          icon={AddToPhotosOutlinedIcon}
          onClick={() => {
            user && addOrganization(user);
          }}
        />
      </PageHead>
      <Box m={4}>
        {!orgLoading && org && (
          <Formik
            enableReinitialize
            initialValues={{
              __public: isPublic,
              orgName: org.data()?.orgName,
              short: org.data()?.short,
              description: org.data()?.description,
              phone: org.data()?.phone,
              contactEmail: org.data()?.contactEmail,
              website: org.data()?.website,
              titlePhoto: org.data()?.titlePhoto,
              address: org.data()?.address,
              city: org.data()?.city,
              area: org.data()?.area,
              state: org.data()?.state,
              country: org.data()?.country,
            }}
            // validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <Flex justifyContent={"end"}>
                <FormLabel htmlFor="setPublicState" m={0} mr={2}>
                  Public:
                </FormLabel>
                <Field
                  name="setPublicState"
                  type="checkbox"
                  as={Switch}
                  isChecked={isPublic}
                  m={0}
                  onChange={() => {
                    setIsPublic(!isPublic);
                  }}
                />
              </Flex>

              <FormLabel htmlFor="orgName">Name:</FormLabel>
              <Field name="orgName" as={Input} errorBorderColor="red.300" />
              <Divider my={4} />

              <FormLabel htmlFor="short">Short name: </FormLabel>
              <Field name="short" as={Input} />
              <Divider my={4} />

              <FormLabel htmlFor="description">Description: </FormLabel>
              <Field name="description" as={Textarea} />
              <Divider my={4} />

              <FormLabel htmlFor="titlePhoto">Title Photo Url: </FormLabel>
              <Field name="titlePhoto" as={Input} />
              <Divider my={4} />

              <FormLabel htmlFor="phone">Phone Number: </FormLabel>
              <Field name="phone" as={Input} />
              <Divider my={4} />

              <FormLabel htmlFor="contactEmail">Contact Email: </FormLabel>
              <Field
                name="contactEmail"
                as={Input}
                errorBorderColor="red.300"
              />
              <Divider my={4} />

              <FormLabel htmlFor="website">Website: </FormLabel>
              <Field name="website" as={Input} />
              <Divider my={4} />

              <FormLabel htmlFor="address">Address: </FormLabel>
              <Field name="address" as={Input} />
              <Divider my={4} />

              <FormLabel htmlFor="city">City: </FormLabel>
              <Field name="city" as={Input} />
              <Divider my={4} />

              <FormLabel htmlFor="area">Area: </FormLabel>
              <Field name="area" as={Input} />
              <Divider my={4} />

              <FormLabel htmlFor="state">State: </FormLabel>
              <Field name="state" as={Input} />
              <Divider my={4} />

              <FormLabel htmlFor="country">Country: </FormLabel>
              <Field name="country" as={Input} />
              <Divider my={4} />

              <Button
                variant="solid"
                type="submit"
                w="100%"
                mb={8}
                onClick={() => {
                  history.back();
                }}
              >
                Submit
              </Button>
            </Form>
          </Formik>
        )}
      </Box>
    </Fragment>
  );
}

import {
  Box,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { Field } from "formik";
import { Fragment, h } from "preact";

interface WeatherProps {}

export default function Weather(props) {
  const {} = props;

  return (
    <Fragment>
      <Fragment>
        <Text>Weather</Text>
        <Divider mb={2} />
        <Flex gap={4}>
          <FormControl>
            <FormLabel htmlFor="windStrength" fontSize="xs" mb={0}>
              Wind Strength
            </FormLabel>
            <Field
              name="windStrength"
              as={Input}
              size="xs"
              placeHolder="15knts / F3"
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="windDirection" fontSize="xs" mb={0}>
              Wind Direction
            </FormLabel>
            <Field
              name="windDirection"
              as={Input}
              size="xs"
              placeHolder="355 / NNW"
            />
          </FormControl>
        </Flex>
        <Box my={2}>{""}</Box>
        <Flex gap={4}>
          <FormControl>
            <FormLabel htmlFor="seaState" fontSize="xs" mb={0}>
              Sea State
            </FormLabel>
            <Field name="seaState" as={Input} size="xs" placeHolder="> 1.5m" />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="additional" fontSize="xs" mb={0}>
              Additional
            </FormLabel>
            <Field name="additional" as={Input} size="xs" />
          </FormControl>
        </Flex>
      </Fragment>
    </Fragment>
  );
}

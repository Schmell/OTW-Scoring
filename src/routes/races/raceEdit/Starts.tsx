import {
  Box,
  Divider,
  Flex,
  FormLabel,
  Icon,
  IconButton,
  Input,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { updateDoc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { Field, FieldArray } from "formik";
import { formatTime } from "../../../util/formatters";
import { AddStartModal } from "./AddStartModal";
// Icons
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

export const Starts = ({ raceStarts, docRef, values }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [starts, setStarts] = useState<[{}]>();

  const [race] = useDocument(docRef);
  const [series] = useDocument(docRef.parent.parent);

  useEffect(() => {
    if (raceStarts?.length) {
      setStarts(raceStarts);
    } else {
      const groupValues = series?.get("pubgroupvalues").split("|");
      const seriesStarts = groupValues?.map((val) => {
        return { fleet: val, start: "" };
      });
      setStarts(seriesStarts);
    }
  }, [series]);

  return (
    <Fragment>
      <Box display="flex" justifyContent="space-between">
        <FormLabel htmlFor="starts">Starts</FormLabel>
        <Tooltip
          label="Add Start"
          hasArrow
          bg="blue.300"
          placement="bottom-start"
        >
          <IconButton
            aria-label="Add start"
            colorScheme="blue"
            variant="outline"
            boxShadow="md"
            icon={(<Icon as={AddIcon} />) as any}
            onClick={onOpen}
          />
        </Tooltip>
        <AddStartModal isOpen={isOpen} onClose={onClose} docRef={docRef} />
      </Box>
      <Divider my={3} />

      <FieldArray name="starts">
        {(helper) =>
          starts?.map((item: any, idx) => {
            const [start, setStart] = useState(formatTime(item.start));

            return (
              <Fragment>
                <FormLabel fontSize={12}>{item.fleet}</FormLabel>
                <Flex key={idx} alignItems="center" ml={2} mb={3}>
                  <Field
                    key={idx}
                    name={`starts.${idx}.${item.fleet}`}
                    type="time"
                    step="2"
                    border="none"
                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                      // add to values
                      if (values.starts) {
                        values.starts[idx].start = e.currentTarget.value;
                      }
                      setStart(e.currentTarget.value);
                    }}
                    value={start}
                    as={Input}
                  />
                  <IconButton
                    aria-label="Delete start"
                    icon={(<Icon as={CloseIcon} />) as any}
                    variant="ghost"
                    colorScheme="blue"
                    size="xs"
                    onClick={async () => {
                      // Filter out this object from raceStarts
                      const starts = raceStarts.filter((start, id) => {
                        return id !== idx;
                      });
                      await updateDoc(docRef, {
                        starts: starts,
                      });
                      // setRaceStarts(starts);
                    }}
                  />
                  {/* <pre>{JSON.stringify(helper, null, 2)}</pre> */}
                </Flex>
              </Fragment>
            );
          })
        }
      </FieldArray>
    </Fragment>
  );
};

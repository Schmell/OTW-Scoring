import {
  Box,
  FormLabel,
  IconButton,
  Divider,
  Flex,
  Input,
  useDisclosure,
  Tooltip,
  Icon,
} from "@chakra-ui/react";
import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { FieldArray, Field } from "formik";
import { Fragment, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { formatTime } from "../../../util/formatters";
import { AddStartModal } from "./AddStartModal";
// Icons
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

export function Starts({ raceStarts, docRef, values }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [starts, setStarts] = useState<[{ fleet: string; start: string }]>();

  useEffect(() => {
    (async () => {
      if (raceStarts) {
        setStarts(raceStarts);
      } else {
        const series = await getDoc(docRef.parent.parent);
        const data = series.data() as any;
        setStarts(data.starts);
      }
    })();
  }, []);

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
          starts?.map((item, idx) => {
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
}

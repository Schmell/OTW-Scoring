import { Button, ButtonGroup, useColorModeValue } from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { useState } from "preact/hooks";
// import "./button-group.css";
interface BtnGrpProps {
  labels: []; //
}

export default function BtnGrp({
  labels,
  selectedButton,
  setSelectedButton,
  ...rest
}) {
  //   const [selectedButton, setSelectedButton] = useState("");

  return (
    <>
      <ButtonGroup isAttached {...rest}>
        {labels.map((label, idx) => {
          // figure out first and last in array
          let firstLast = 0;
          const length = labels.length;
          if (label === labels[0]) {
            firstLast = 0;
          } else if (label === labels[length - 1]) {
            firstLast = 1;
          }

          return (
            <Button
              key={idx}
              id={idx}
              onClick={({ target }) => {
                setSelectedButton(label);
              }}
              borderRight={firstLast ? "" : "none"}
              isActive={selectedButton === label ? true : false}
              _active={{
                boxShadow: "none",
                background: "blue.100",
                color: "blue.600",
              }}
            >
              {label}
            </Button>
          );
        })}
      </ButtonGroup>
    </>
  );
}

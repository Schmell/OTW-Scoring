import { Box, Button, FormLabel, Input } from "@chakra-ui/react";
import { h } from "preact";
import { useAuthState } from "react-firebase-hooks/auth";
import { fromInput } from "../../util/blw";
import { auth } from "../../util/firebase-config";
import { populate } from "./populate";
import style from "./style.css";

const Upload = () => {
  // user Auth should come from firbase config
  const [user] = useAuthState(auth);

  const getFile = (e) => {
    fromInput(e);
    // populate();
  };

  return (
    <Box className={style.upload}>
      <Box>
        <FormLabel className={style.file}>
          <Input
            type="file"
            // id="file"
            className={style.file}
            data-ttle="Choose me"
            aria-label="select Sailwave file"
            onChange={(e) => {
              const fileList = e.target.files;
              Array.from(fileList!).forEach((file) => {
                console.dir(e.target);
                const display =
                  e.target.parentElement?.querySelector(".fileDiplay");
                if (display) {
                  display.textContent = file.name;
                }
                e.target.setAttribute("data-title", file.name);
              });
            }}
          ></Input>
          <span className={style.fileCustom}></span>
          <span className="fileDiplay">File...</span>
        </FormLabel>
      </Box>

      <Button
        mt="2"
        boxShadow="lg"
        colorScheme="blue"
        onClick={() => populate(user)}
      >
        Add Series to Database
      </Button>
    </Box>
  );
};

export default Upload;

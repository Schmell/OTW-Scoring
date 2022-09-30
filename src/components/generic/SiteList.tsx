import { Box, List, Progress } from "@chakra-ui/react";
import { Fragment, h } from "preact";
// Icons

interface SiteListProps {
  loading: boolean;
  children: any;
}

export function SiteList({ loading, children }: SiteListProps) {
  return (
    <Fragment>
      {/* {loading ? (
        <Box position="fixed" top="260px" zIndex={100}>
          <Progress size="xs" isIndeterminate top={-1} />
        </Box>
      ) : ( */}
      <List px={4} mb={16}>
        {children}
      </List>
      {/* )} */}
    </Fragment>
  );
}

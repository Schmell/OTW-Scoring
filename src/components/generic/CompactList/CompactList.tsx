import { Box, Stack } from "@chakra-ui/react";
import { h } from "preact";

type CompactListProps = {
  children: any;
  loading: boolean;
};

export default function CompactList(props: CompactListProps) {
  const { children, loading } = props;

  return <Box mt={4}>{!loading && <Stack align="left">{children}</Stack>}</Box>;
}

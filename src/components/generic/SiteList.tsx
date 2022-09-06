import { List, Progress } from "@chakra-ui/react";
import { Fragment, h } from "preact";
// Icons

interface SiteListProps {
  loading: boolean;
  children: any;
}

export function SiteList({ loading, children }: SiteListProps) {
  return (
    <Fragment>
      {loading ? (
        <Progress size="xs" isIndeterminate top={-1} />
      ) : (
        <List px={4} mb={16}>
          {children}
        </List>
      )}
    </Fragment>
  );
}

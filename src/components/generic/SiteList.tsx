import { List, Progress, Spinner } from "@chakra-ui/react";
import { Fragment, h } from "preact";
// Icons

interface SiteListProps {
  loading: boolean;
  children: any;
  [x: string]: any;
}

export function SiteList({ loading, children, ...rest }: SiteListProps) {
  return (
    <Fragment>
      {loading ? (
        <Progress size="xs" isIndeterminate />
      ) : (
        <List px={4} mb={16}>
          {children}
        </List>
      )}
    </Fragment>
  );
}

import { List, Skeleton } from "@chakra-ui/react";
import { Fragment, h } from "preact";
// Icons

interface SiteListProps {
  loading: boolean;
  children: any;
}

export function SiteList({ loading, children }: SiteListProps) {
  return (
    <Fragment>
      <List px={4}>
        <Skeleton isLoaded={!loading}>{children}</Skeleton>
      </List>
    </Fragment>
  );
}

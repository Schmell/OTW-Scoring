import { List, Progress, Spinner } from "@chakra-ui/react";
import { Fragment, h } from "preact";
// Icons

interface SiteListProps {
  loading?: boolean;
  children: h.JSX.Element[] | undefined;
  [x: string]: any;
}

export function SiteList(props: SiteListProps) {
  const { loading, children, ...rest } = props;
  return (
    <Fragment>
      <List px={4} mb={16} {...rest}>
        {children}
      </List>
    </Fragment>
  );
}

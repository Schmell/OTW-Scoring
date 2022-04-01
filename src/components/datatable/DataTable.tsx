import { h } from "preact";
import { FC } from "preact/compat";
import DataTable, { TableProps } from "react-data-table-component";

const sortIcon = "⬇";
const selectProps = {
  indeterminate: (isIndeterminate: boolean) => isIndeterminate,
};

function DataTableBase<T>(props: TableProps<T>): JSX.Element {
  return (
    <DataTable
      // pagination
      selectableRowsComponent={Checkbox}
      selectableRowsComponentProps={selectProps}
      sortIcon={sortIcon}
      dense
      {...props}
    />
  );
}

export default DataTableBase;

interface ICheckboxProps {
  checked: boolean;
}

export const Checkbox: FC<ICheckboxProps> = ({ checked }) => {
  return <input type="checkbox" {...(checked ? "checked" : null)} />;
};

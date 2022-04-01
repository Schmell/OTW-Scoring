export interface TableData {
  name: String;
  hours: number;
  startDate: Date;
  department: Department;
  // property?: string;
}

export enum Department {
  Marketing = "Marketing",
  Sales = "Sales",
  Engineering = "Engineering",
}

export const dataList = [
  {
    name: "Ryan H.",
    hours: 30,
    startDate: new Date("2019-01-14"),
    department: Department.Marketing,
  },
  {
    name: "Ariel P.",
    hours: 22,
    startDate: new Date("2017-03-12"),
    department: Department.Sales,
  },
  {
    name: "Ryan Y.",
    hours: 31,
    startDate: new Date("2015-09-12"),
    department: Department.Marketing,
  },
  {
    name: "Ed T.",
    hours: 22,
    startDate: new Date("2017-03-12"),
    department: Department.Engineering,
  },
  {
    name: "Matt G.",
    hours: 30,
    startDate: new Date("2017-03-12"),
    department: Department.Marketing,
  },
  {
    name: "Olivia H.",
    hours: 32,
    startDate: new Date("2018-05-10"),
    department: Department.Engineering,
  },
] as TableData[];

export const fetchData = () => {
  return dataList;
};

export interface importFileObj {
    seriesId?: string;
    name?: string;
    file: File;
    duplicate: boolean;
    copy?: boolean;
  }

  export interface importProps {
    listItems: importFileObj[];
    listState: importFileObj[];
    setListState: any;
    duplicates: boolean;
  }
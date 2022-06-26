export interface fileType extends File {
  fileName: string;
  name: string;
  serId: string;
  lastModified: number;
  lastModifiedDate: string;
  size: number;
  duplicate?: boolean;
}

export type importFileObj = {
  seriesId: string;
  name: string;
  file: File;
  duplicate: boolean;
};

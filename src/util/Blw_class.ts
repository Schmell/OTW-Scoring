import { User } from "firebase/auth";
import { parse } from "papaparse";
import { formatTime } from "./formatters";

<<<<<<< HEAD
interface IBlw{
    user: User | null | undefined
    file: chromeFile
}

interface chromeFile extends File {
    lastModifiedDate: string;
}

export class Blw {
    user: User | null | undefined
    file: chromeFile
    constructor(props: IBlw){
        this.user = props.user
        this.file = props.file
    }

   async getFileData(): Promise<string[]> {
    const file = this.file
    const data = await this.papaPromise(file)
    if(data instanceof Error){
        throw data
    }
    return data
  }


   papaPromise(file: any): Promise<string[]> | Error {
=======
interface IBlw {
  user: User | null | undefined;
  file: chromeFile;
}

interface chromeFile extends File {
  lastModifiedDate: string;
}

export class Blw {
  user: User | null | undefined;
  file: chromeFile;
  constructor(props: IBlw) {
    this.user = props.user;
    this.file = props.file;
  }

  async getFileData(): Promise<string[]> {
    const file = this.file;
    const data = await this.papaPromise(file);
    if (data instanceof Error) {
      throw data;
    }
    return data;
  }

  papaPromise(file: any): Promise<string[]> | Error {
>>>>>>> bba0015782d41309e2b4fa53740d1ca6f1b17d7c
    return new Promise((resolve, reject) => {
      parse(file, {
        complete(results) {
          resolve(results.data as string[]);
        },
        error(err: Error) {
          reject(err);
        },
      });
    });
<<<<<<< HEAD
  };
  
  async getComps(){
=======
  }

  async getComps() {
>>>>>>> bba0015782d41309e2b4fa53740d1ca6f1b17d7c
    let data = await this.getFileData();
    var compData: any = [];
    var compBoats = data.filter(function (item: any) {
      return item[0] === "comphigh";
    });
    // var sortedBoats = compBoats.sort();
    compBoats.sort().forEach(function (compBoat: any) {
      interface CompetitorObj {
        id: number;
        compid: string;
        [x: string | number | symbol]: unknown;
      }
<<<<<<< HEAD
  
=======

>>>>>>> bba0015782d41309e2b4fa53740d1ca6f1b17d7c
      let competitor: CompetitorObj = {
        id: 0,
        compid: "",
      };
<<<<<<< HEAD
  
=======

>>>>>>> bba0015782d41309e2b4fa53740d1ca6f1b17d7c
      competitor.id = parseInt(compBoat[2]);
      competitor.compid = compBoat[2];
      let compRows = data.filter((item: any) => {
        var regex = new RegExp(`^comp`, "g");
        return item[0].match(regex) && item[2] === compBoat[2];
      });
      compRows.forEach((item: any) => {
        const newName = item[0].replace("comp", "");
        competitor[newName] = item[1];
      });
      compData.push(competitor);
    }); //each compBoats
    var sorted = compData!.sort((a: any, b: any) => {
      return a.boat - b.boat;
    });
    //console.log(compData)
    return sorted!;
<<<<<<< HEAD
  }; // getComps

  async getResults(){
    const data = await this.getFileData();
    const resultsArr: any = [];
  
=======
  } // getComps

  async getResults() {
    const data = await this.getFileData();
    const resultsArr: any = [];

>>>>>>> bba0015782d41309e2b4fa53740d1ca6f1b17d7c
    const results = data.filter((item: any) => {
      return item[0] === "rdisc";
    });
    results.forEach((result: any) => {
      // Results in blw file have no prefix to speak of (just an r)
      // So we need to find each row individually
<<<<<<< HEAD
  
=======

>>>>>>> bba0015782d41309e2b4fa53740d1ca6f1b17d7c
      // I would like to see a differrent solution for undefined
      // we cannot pass undefined to firestore
      const resultRow = {
        id: `${result[3]}-${result[2]}`,
        compid: result[2],
        raceid: result[3],
        // I am trying to return empty string from resultHelp
        finish: this.resultHelp("rft", data, result),
<<<<<<< HEAD
  
=======

<<<<<<< HEAD
>>>>>>> bba0015782d41309e2b4fa53740d1ca6f1b17d7c
        start: this.resultHelp("rst", data, result)
          ? this.resultHelp("rst", data, result)
          : "",
        points: this.resultHelp("rpts", data, result)
          ? this.resultHelp("rpts", data, result)
          : "",
        position: this.resultHelp("rpos", data, result)
          ? this.resultHelp("rpos", data, result)
          : "",
        discard: this.resultHelp("rdisc", data, result)
          ? this.resultHelp("rdisc", data, result)
          : "",
        corrected: this.resultHelp("rcor", data, result)
          ? this.resultHelp("rcor", data, result)
          : "",
        rrestyp: this.resultHelp("rrestyp", data, result)
          ? this.resultHelp("rrestyp", data, result)
          : "",
        elapsed: this.resultHelp("rele", data, result)
          ? this.resultHelp("rele", data, result)
          : "",
        srat: this.resultHelp("srat", data, result)
          ? this.resultHelp("srat", data, result)
          : "",
        rewin: this.resultHelp("rewin", data, result)
          ? this.resultHelp("rewin", data, result)
          : "",
        rrwin: this.resultHelp("rrwin", data, result)
          ? this.resultHelp("rrwin", data, result)
          : "",
        rrset: this.resultHelp("rrset", data, result)
          ? this.resultHelp("rrset", data, result)
          : "",
=======
        start: this.resultHelp("rst", data, result) ? this.resultHelp("rst", data, result) : "",
        points: this.resultHelp("rpts", data, result) ? this.resultHelp("rpts", data, result) : "",
        position: this.resultHelp("rpos", data, result) ? this.resultHelp("rpos", data, result) : "",
        discard: this.resultHelp("rdisc", data, result) ? this.resultHelp("rdisc", data, result) : "",
        corrected: this.resultHelp("rcor", data, result) ? this.resultHelp("rcor", data, result) : "",
        rrestyp: this.resultHelp("rrestyp", data, result) ? this.resultHelp("rrestyp", data, result) : "",
        elapsed: this.resultHelp("rele", data, result) ? this.resultHelp("rele", data, result) : "",
        srat: this.resultHelp("srat", data, result) ? this.resultHelp("srat", data, result) : "",
        rewin: this.resultHelp("rewin", data, result) ? this.resultHelp("rewin", data, result) : "",
        rrwin: this.resultHelp("rrwin", data, result) ? this.resultHelp("rrwin", data, result) : "",
        rrset: this.resultHelp("rrset", data, result) ? this.resultHelp("rrset", data, result) : "",
>>>>>>> fixImport
      };
      resultsArr.push(resultRow);
    }); // forEach
<<<<<<< HEAD
  
    return resultsArr;
  };
=======

    return resultsArr;
  }
>>>>>>> bba0015782d41309e2b4fa53740d1ca6f1b17d7c

  resultHelp(resultTag: any, data: any, result: any) {
    let res = data.filter((item: any) => {
      return item[0] === resultTag && item[2] === result[2] && item[3] === result[3];
    });
    if (res[0]) {
      return res[0][1];
    } else {
      return "";
    }
<<<<<<< HEAD
  };
=======
  }
>>>>>>> bba0015782d41309e2b4fa53740d1ca6f1b17d7c

  // I don't think i use this
  // each race has fleets
  async getFleets() {
    const data = await this.getFileData();
    var fleetsRaw: any[] = data.filter((item: any) => {
      return item[0] === "serpubgroupvalues";
    });
    var fleets = fleetsRaw[0][1].match(/[^|]+/g);
<<<<<<< HEAD
  
    return fleets;
  };
  
  async getRaces(){
=======

    return fleets;
  }

  async getRaces() {
<<<<<<< HEAD
>>>>>>> bba0015782d41309e2b4fa53740d1ca6f1b17d7c
    /* 
    // @TODO
    // reutrn sailed as bool or int
    */
=======
>>>>>>> fixImport
    const data = await this.getFileData();
<<<<<<< HEAD
  
    // new object to be returned
    var raceData: any = [];
  
=======

    // new object to be returned
    var raceData: any = [];

>>>>>>> bba0015782d41309e2b4fa53740d1ca6f1b17d7c
    // Find all raceids by getting known csv row
    var races = data.filter((item: any) => {
      return item[0] === "racerank";
    });
<<<<<<< HEAD
  
=======

>>>>>>> bba0015782d41309e2b4fa53740d1ca6f1b17d7c
    // For each race push data to new object
    races.forEach((race: any) => {
<<<<<<< HEAD
      // interface RaceObj {
      //   raceid: string;
      //   // allow everything else (usually all strings from .blw)
      //   [x: string | number | symbol]: unknown;
      // }
<<<<<<< HEAD
  
=======

>>>>>>> bba0015782d41309e2b4fa53740d1ca6f1b17d7c
=======
>>>>>>> fixImport
      let raceObj = {
        raceid: "",
        starts: "",
      };
<<<<<<< HEAD
  
=======

>>>>>>> bba0015782d41309e2b4fa53740d1ca6f1b17d7c
      raceObj.raceid = race[3];
      let resultRows = data.filter((item: any) => {
        var regex = new RegExp(`^race`, "g");
        return item[0].match(regex) && item[3] === race[3];
      });
      // console.log("resultRows: ", resultRows);

      let raceStarts: any = [];

      resultRows.forEach((item) => {
<<<<<<< HEAD
        // Format the starts to object
        // this looks like helper functions will help
        // and guards
<<<<<<< HEAD
  
=======

>>>>>>> bba0015782d41309e2b4fa53740d1ca6f1b17d7c
=======

        // Format the starts to object
>>>>>>> fixImport
        if (item[0] === "racestart") {
          const stringToSplit = item[1].split("|");

          let start = stringToSplit[1];

          let fleet = stringToSplit[0].split("^")[1];

          // remove the undefined
          if (!fleet) fleet = "none";

          // This will stop undefined or null
          try {
            start = formatTime(start);
          }
          catch {
            start = "00:00:00";
          }

          raceStarts.push({ fleet, start });

        } else {
          // not racestart so just add to raceObj
          const newName = item[0].replace("race", "");

          raceObj[newName] = item[1];
        }
      });
<<<<<<< HEAD
  
      raceStarts.forEach((start: any) => {
        raceObj.starts = raceStarts;
      });
  
      raceData.push(raceObj);
    });
  
    return raceData!;
  };
  
  async getSeries(){
=======

      // now add the starts to raceObj
      raceStarts.forEach((start: any) => {
        raceObj.starts = raceStarts;
      });

      raceData.push(raceObj);
    });

    return raceData!;
  } // getRaces

  async getSeries() {
>>>>>>> bba0015782d41309e2b4fa53740d1ca6f1b17d7c
    const data = await this.getFileData();
    // add file info
    const seriesRows = data.filter((item: any) => {
      const regex = new RegExp(`^ser`, "g");
      return item[0].match(regex);
    });
<<<<<<< HEAD
  
=======

>>>>>>> bba0015782d41309e2b4fa53740d1ca6f1b17d7c
    // would be a long interface or type so just allow everything
    // maybe in the future we wont need everything from sailwave
    type SeriesObj = {
      event: string;
      __owner?: string;
      lastModifiedDate?: string;
      [x: string | number | symbol]: unknown;
    };
<<<<<<< HEAD
  
    let seriesObj: SeriesObj = { event: "" };
  
=======

    let seriesObj: SeriesObj = { event: "" };

>>>>>>> bba0015782d41309e2b4fa53740d1ca6f1b17d7c
    seriesRows.forEach((item: any) => {
      const newName = item[0].replace("ser", "");
      seriesObj[newName] = item[1];
    });

    // make an object for fileInfo to organize better
    // const fileInfo = this.file
    const __fileInfo = {} as any
    __fileInfo.fileName = this.file.name;
    __fileInfo.lastModified = this.file.lastModified;
    __fileInfo.lastModifiedDate = this.file.lastModifiedDate;
    __fileInfo.size = this.file.size;
    const returnObj = { ...seriesObj, __fileInfo };
    // return series object and fileinfo
    return returnObj;
<<<<<<< HEAD
<<<<<<< HEAD
  };
  
  downloadURL(url: any, name: any){
=======
  }
=======
  } // getSeries

>>>>>>> fixImport

  // Don't know if this works currently
  // These functions should be in an export class
  downloadURL(url: any, name: any) {
>>>>>>> bba0015782d41309e2b4fa53740d1ca6f1b17d7c
    const link = document.createElement("a");
    link.download = name;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // delete link;
<<<<<<< HEAD
  };
  
  downloadFile(){
=======
  }

  // Don't know if this works currently
  downloadFile() {
>>>>>>> bba0015782d41309e2b4fa53740d1ca6f1b17d7c
    const data = localStorage.getItem("savedFile");
    const blob = new Blob([data!], { type: "text/txt" });
    const url = window.URL.createObjectURL(blob);
    const using = JSON.parse(localStorage.getItem("using")!);
    // LL(using)
    this.downloadURL(url, using.name);
<<<<<<< HEAD
  };

    
=======
  }
>>>>>>> bba0015782d41309e2b4fa53740d1ca6f1b17d7c
}

import { User } from "firebase/auth";
import { parse } from "papaparse";
import { formatTime } from "./formatters";

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
  }

  async getComps() {
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

      let competitor: CompetitorObj = {
        id: 0,
        compid: "",
      };

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
  } // getComps

  async getResults() {
    const data = await this.getFileData();
    const resultsArr: any = [];

    const results = data.filter((item: any) => {
      return item[0] === "rdisc";
    });
    results.forEach((result: any) => {
      // Results in blw file have no prefix to speak of (just an r)
      // So we need to find each row individually

      // I would like to see a differrent solution for undefined
      // we cannot pass undefined to firestore
      const resultRow = {
        id: `${result[3]}-${result[2]}`,
        compid: result[2],
        raceid: result[3],
        // I am trying to return empty string from resultHelp
        finish: this.resultHelp("rft", data, result),

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
      };
      resultsArr.push(resultRow);
    }); // forEach

    return resultsArr;
  }

  resultHelp(resultTag: any, data: any, result: any) {
    let res = data.filter((item: any) => {
      return (
        item[0] === resultTag && item[2] === result[2] && item[3] === result[3]
      );
    });
    if (res[0]) {
      return res[0][1];
    } else {
      return "";
    }
  }

  async getFleets() {
    const data = await this.getFileData();
    var fleetsRaw: any[] = data.filter((item: any) => {
      return item[0] === "serpubgroupvalues";
    });
    var fleets = fleetsRaw[0][1].match(/[^|]+/g);

    return fleets;
  }

  async getRaces() {
    /* 
    // @TODO
    // reutrn sailed as bool or int
    */
    const data = await this.getFileData();

    // new object to be returned
    var raceData: any = [];

    // Find all raceids by getting known csv row
    var races = data.filter((item: any) => {
      return item[0] === "racerank";
    });

    // For each race push data to new object
    races.forEach((race: any) => {
      // interface RaceObj {
      //   raceid: string;
      //   // allow everything else (usually all strings from .blw)
      //   [x: string | number | symbol]: unknown;
      // }

      let raceObj = {
        raceid: "",
        starts: "",
      };

      raceObj.raceid = race[3];
      let resultRows = data.filter((item: any) => {
        var regex = new RegExp(`^race`, "g");
        return item[0].match(regex) && item[3] === race[3];
      });
      // console.log("resultRows: ", resultRows);
      let raceStarts: any = [];
      resultRows.forEach((item) => {
        // Format the starts to object
        // this looks like helper functions will help
        // and guards

        if (item[0] === "racestart") {
          const stringToSplit = item[1].split("|");
          let fleetStart = stringToSplit[1];
          // console.log("fleetStart: ", fleetStart);
          let fleetName = stringToSplit[0].split("^")[1];
          if (!fleetName) {
            fleetName = "";
          }
          if (!fleetStart) {
            fleetStart = "0";
          } else {
            fleetStart = formatTime(fleetStart);
          }
          raceStarts.push({ fleet: fleetName, start: fleetStart });
        } else {
          const newName = item[0].replace("race", "");
          raceObj[newName] = item[1];
        }
      });

      raceStarts.forEach((start: any) => {
        raceObj.starts = raceStarts;
      });

      raceData.push(raceObj);
    });

    return raceData!;
  }

  async getSeries() {
    const data = await this.getFileData();
    // add file info
    const seriesRows = data.filter((item: any) => {
      const regex = new RegExp(`^ser`, "g");
      return item[0].match(regex);
    });

    // would be a long interface or type so just allow everything
    type SeriesObj = {
      event: string;
      __owner?: string;
      [x: string | number | symbol]: unknown;
    };

    let seriesObj: SeriesObj = { event: "" };

    seriesRows.forEach((item: any) => {
      const newName = item[0].replace("ser", "");
      seriesObj[newName] = item[1];
    });
    // make an object for fileInfo to organize better
    const __fileInfo = {} as any;
    __fileInfo.fileName = this.file.name;
    __fileInfo.lastModified = this.file.lastModified;
    __fileInfo.lastModifiedDate = this.file.lastModifiedDate;
    __fileInfo.size = this.file.size;
    const returnObj = { ...seriesObj, __fileInfo };
    // return series object and fileinfo
    return returnObj;
  }

  downloadURL(url: any, name: any) {
    const link = document.createElement("a");
    link.download = name;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // delete link;
  }

  downloadFile() {
    const data = localStorage.getItem("savedFile");
    const blob = new Blob([data!], { type: "text/txt" });
    const url = window.URL.createObjectURL(blob);
    const using = JSON.parse(localStorage.getItem("using")!);
    // LL(using)
    this.downloadURL(url, using.name);
  }
}

import { parse, unparse } from "papaparse";
// fromUrl is not implemented
export const fromInput = (e: { target: HTMLInputElement }) => {
  /*
  // @TODO 
  // this does not work from a cold start
  // Need to deal with the fact that there is nothing in the local storage
  // Maybe check currentFIle first and if no then write current and using
  */

  let file: any;
  if (e.target.files && e.target.files.length === 1) {
    file = e.target.files[0];
    console.log("file: ", file);
  }

  const usingFile = localStorage.getItem("using");
  if (!usingFile) {
    console.log("no using file");
    const using = {
      name: file.name,
      lastModified: file.lastModified,
      lastModifiedDate: file.lastModifiedDate,
      size: file.size,
    };
    localStorage.setItem("using", JSON.stringify(using));
    // return;
  }
  let last = JSON.parse(usingFile!); // bang
  if (!last) {
    console.log("no last");
    last.name = "nofile";
    last.lastModified = Date.now();
  }

  if (
    (file && file.name !== last.name) ||
    (file.lastModified !== last.lastModified && last)
  ) {
    console.log("File has been changed, using new file");
    // @TODO: backup old files text to a new file ????
    let oldFile = localStorage.getItem("currentFile");
    let notUsing = localStorage.getItem("using");

    if (oldFile) {
      localStorage.setItem("oldFile", oldFile);
    }
    if (notUsing) {
      localStorage.setItem("notUsing", notUsing);
    }

    localStorage.removeItem("currentFile");
    localStorage.removeItem("using");

    parse(file, {
      complete: (results) => {
        const unParsed = unparse(results.data, {
          quotes: true,
          quoteChar: '"',
        });
        const fileArr = {
          name: file.name,
          lastModified: file.lastModified,
          lastModifiedDate: file.lastModifiedDate,
          size: file.size,
        };
        // console.log("unParsed: ", unParsed);
        localStorage.setItem("using", JSON.stringify(fileArr));
        localStorage.setItem("currentFile", unParsed);
      },
    });
  } else {
    console.log("File not changed, using file from storage");
    console.log("using:", JSON.parse(localStorage.getItem("using")!));
  }
}; // fromInput

export const papaPromise = (file: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    parse(file, {
      complete(results, file) {
        resolve(results.data);
      },
      error(err) {
        reject(err);
      },
    });
  });
};

export const getFileData = async (): Promise<any> => {
  const file = localStorage.getItem("currentFile");
  // const f = await Csv.getLocalStorageItem("currentFile");
  // console.log("f: ", f);
  // console.log("file: ", file);
  let parsed = await papaPromise(file);
  // console.log("parsed: ", parsed);
  return parsed;
};

export const getComps = async () => {
  // let parsed = Papa.parse(this.getFile());
  let data = await getFileData();
  // console.log("data: ", data);
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
}; // getComps

export const getResults = async () => {
  const data = await getFileData();
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
      finish: resultHelp("rft", data, result),

      start: resultHelp("rst", data, result)
        ? resultHelp("rst", data, result)
        : "",
      points: resultHelp("rpts", data, result)
        ? resultHelp("rpts", data, result)
        : "",
      position: resultHelp("rpos", data, result)
        ? resultHelp("rpos", data, result)
        : "",
      discard: resultHelp("rdisc", data, result)
        ? resultHelp("rdisc", data, result)
        : "",
      corrected: resultHelp("rcor", data, result)
        ? resultHelp("rcor", data, result)
        : "",
      rrestyp: resultHelp("rrestyp", data, result)
        ? resultHelp("rrestyp", data, result)
        : "",
      elapsed: resultHelp("rele", data, result)
        ? resultHelp("rele", data, result)
        : "",
      srat: resultHelp("srat", data, result)
        ? resultHelp("srat", data, result)
        : "",
      rewin: resultHelp("rewin", data, result)
        ? resultHelp("rewin", data, result)
        : "",
      rrwin: resultHelp("rrwin", data, result)
        ? resultHelp("rrwin", data, result)
        : "",
      rrset: resultHelp("rrset", data, result)
        ? resultHelp("rrset", data, result)
        : "",
    };
    resultsArr.push(resultRow);
  }); // forEach

  return resultsArr;
};

const resultHelp = (resultTag: any, data: any, result: any) => {
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
};
export const getFleets = async () => {
  const data = await getFileData();
  var fleetsRaw: any[] = data.filter((item: any) => {
    return item[0] === "serpubgroupvalues";
  });
  var fleets = fleetsRaw[0][1].match(/[^|]+/g);
  return fleets;
};

export const getRaces = async () => {
  /* 
  // @TODO
  // reutrn sailed as bool or int
  */
  let data = await getFileData();
  var raceData: any = [];

  var races = data.filter((item: any) => {
    return item[0] === "racerank";
  });

  races.forEach((race: any) => {
    interface RaceObj {
      raceid: string;
      // allow everything else (usually all strings from .blw)
      [x: string | number | symbol]: unknown;
    }

    let raceObj: RaceObj = {
      raceid: "",
    };

    raceObj.raceid = race[3];
    let resultRows = data.filter(function (item: any) {
      var regex = new RegExp(`^race`, "g");
      return item[0].match(regex) && item[3] === race[3];
    });

    let raceStarts: any = [];
    resultRows.forEach((item: any) => {
      if (item[0] === "racestart") {
        let stringToSplit = item[1].split("|");
        let fleetStart = stringToSplit[1];
        let fleetName = stringToSplit[0].split("^")[1];
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
};

export const getSeries = async () => {
  const data = await getFileData();
  const seriesRows = data.filter((item: any) => {
    const regex = new RegExp(`^ser`, "g");
    return item[0].match(regex);
  });

  interface SeriesObj {
    [x: string | number | symbol]: unknown;
  }

  let seriesObj: SeriesObj = {};

  seriesRows.forEach((item: any) => {
    const newName = item[0].replace("ser", "");
    seriesObj[newName] = item[1];
  });

  return seriesObj;
};

export const downloadURL = (url: any, name: any) => {
  const link = document.createElement("a");
  link.download = name;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // delete link;
};

export const downloadFile = () => {
  const data = localStorage.getItem("savedFile");
  const blob = new Blob([data!], { type: "text/txt" });
  const url = window.URL.createObjectURL(blob);
  const using = JSON.parse(localStorage.getItem("using")!);
  // LL(using)
  downloadURL(url, using.name);
};

// const getLocalStorageItem = async (item: string) => {
//   // this was to try to make localStorage items a promise
//   // didnt work
//   new Promise((resolve, reject) => {
//     const f = localStorage.getItem(item);
//     // console.log("f: ", f);
//     if (f) {
//       // console.log("f again: ", f);
//       resolve(f);
//     } else {
//       reject();
//     }
//   });
// };
// EXPORT
//

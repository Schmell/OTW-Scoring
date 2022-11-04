// Database Configuration
export const idbConfig = {
    databaseName: "otw",
    version: 1,
    stores: [
      {
        name: "user-params",
        id: { keyPath: "id", autoIncrement: true },
        indices: [
          { name: "uid", keyPath: "uid" },
          { name: "currentPage", keyPath: "currentPage" },
          { name: "headerTitle", keyPath: "headerTitle" },
          { name: "raceId", keyPath: "raceId" },
          { name: "compId", keyPath: "compId" },
          { name: "resultId", keyPath: "resultId" },
          { name: "seriesId", keyPath: "seriesId" },
        ],
      },
    ],
  };
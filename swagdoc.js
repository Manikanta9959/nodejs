const swaggerDoc = {
    openapi: "3.0.0",
    info: {
      title: "CSV to JSON Converter API",
      description: "API for converting CSV files to JSON and uploading to a MYSQL database.",
      contact: {
        name: "CSV API Support",
        email: "sivachallano1@gmail.com",
      },
      version: "1.0.0",
    },
    tags: [
      {
        name: "CSV Operations",
        description: "Endpoints for CSV parsing and database operations",
      },
    ],
    paths: {
      "/api/v1/upload": {
        post: {
          tags: ["CSV Operations"],
          summary: "Upload CSV file and insert records into the database",
          description: "Parses a CSV file and uploads the data into the MYSQL database.",
          operationId: "uploadCSV",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    filePath: {
                      type: "string",
                      description: "Path to the CSV file on the server.",
                      example: "./data/input.csv",
                    },
                  },
                  required: ["filePath"],
                },
              },
            },
          },
          responses: {
            200: {
              description: "Data uploaded successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "CSV data uploaded successfully!" },
                    },
                  },
                },
              },
            },
            500: {
              description: "Server error during CSV upload",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string", example: "Error uploading CSV data" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/age-distribution": {
        get: {
          tags: ["CSV Operations"],
          summary: "Get age group distribution",
          description: "Calculates and returns the age group distribution of users in the database.",
          operationId: "getAgeDistribution",
          responses: {
            200: {
              description: "Age group distribution retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      "<20": { type: "integer", example: 50 },
                      "20-40": { type: "integer", example: 150 },
                      "40-60": { type: "integer", example: 80 },
                      ">60": { type: "integer", example: 20 },
                    },
                  },
                },
              },
            },
            500: {
              description: "Server error during age distribution calculation",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string", example: "Error calculating age distribution" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
  
  export default swaggerDoc;
  
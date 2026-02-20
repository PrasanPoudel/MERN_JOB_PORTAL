const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Kaamsetu Job Portal API",
      version: "1.0.0",
      description: "MERN Stack Job Portal API with ML-based job matching",
      contact: {
        name: "Kaamsetu Team",
      },
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js", "./docs/*.js"],
};

module.exports = swaggerJsdoc(options);

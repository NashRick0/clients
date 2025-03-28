import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            version: "1.0.0",
            title: "Docu API",
            description: "API Documentation for use",
            servers: [
                {
                    url: "http://localhost:5002",
                    description: "Local server"
                }
            ]
        }
    },
    apis: ["src/routes/*.js"]
};

export default swaggerJsdoc(swaggerOptions);
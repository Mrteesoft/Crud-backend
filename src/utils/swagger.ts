import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BNPL API',
      version: '1.0.0',
      description: 'Buy Now Pay Later backend with auth, merchants, purchases, installments',
    },
    servers: [{ url: 'http://localhost:5000/api/v1', description: 'Local dev' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
          },
        },
        AuthUser: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/AuthUser' },
            token: { type: 'string' },
          },
        },
        MerchantInput: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string' },
            category: { type: 'string' },
            contactEmail: { type: 'string', format: 'email' },
          },
        },
        PurchaseStatus: {
          type: 'string',
          enum: ['pending', 'approved', 'active', 'completed', 'defaulted'],
        },
        PurchaseInput: {
          type: 'object',
          required: ['merchantId', 'itemName', 'amount', 'tenureMonths'],
          properties: {
            merchantId: { type: 'string' },
            itemName: { type: 'string' },
            amount: { type: 'number', minimum: 0 },
            tenureMonths: { type: 'integer', minimum: 1 },
            interestRate: { type: 'number', minimum: 0 },
            status: { $ref: '#/components/schemas/PurchaseStatus' },
            startDate: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

 BNPL CRUD API (Node.js,  Express, TypeScript  MongoDB)

  Setup
1) Copy  .env.example to .env (the example values work for local Mongo at mongodb://127.0.0.1:27017/bnpl_app`).
2) Install deps: npm install
4) Run dev: npm run dev |  Build: npm run build  |  Prod: npm start
5) Health check: GET http://localhost:5000/health

 Auth (roles)
- POST /api/v1/auth/register { name, email, password, role?: user|merchant } — defaults to user,
- POST  /api/v1/auth/login -> { user, token }
- GET /api/v1/auth/me` (Bearer token)

 Merchants (merchant/admin token)
- POST /api/v1/merchants { name, category?, contactEmail? }
- GET /api/v1/merchants
- GET /api/v1/merchants/:id
- PATCH /api/v1/merchants/:id
- DELETE /api/v1/merchants/:id

 Purchases (user token)
Fields: merchantId, itemName, amount, tenureMonths, interestRate?, status, startDate.
- POST /api/v1/purchases
- GET /api/v1/purchases (optional ?status=)
- GET /api/v1/purchases/:id
- PATCH /api/v1/purchases/:id
- DELETE /api/v1/purchases/:id
- GET /api/v1/purchases/:id/installments
- POST /api/v1/purchases/:id/pay

 Swagger / Docs
- Swagger UI: http://localhost:5000/api/docs
- Base API: http://localhost:5000/api/v1

## Postman
Import postman_collection.json. Login to set {{token}}(user) or {{merchantToken}} (merchant), then run requests. Create Merchant captures merchantId; Create Purchase captures purchaseId.

 Notes
- MongoDB required at MONGO_URI (the example .env.example points to local Mongo and works for testing).
- Validation via Zod, errors return { errors: [{ path, message }] } with 400.

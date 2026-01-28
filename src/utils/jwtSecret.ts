const SECRET = process.env.JWT_SECRET || "dummy-secret";

export const getJwtSecret = () => SECRET;

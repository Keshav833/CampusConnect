// Role middleware
export const authorize = (...roles) => (req, res, next) => { next(); };

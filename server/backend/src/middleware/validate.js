export function validateBody(requiredFields) {
  return (req, res, next) => {
    const missing = requiredFields.filter((field) => {
      const value = req.body[field];
      return value === undefined || value === null || value === "";
    });

    if (missing.length) {
      return res.status(400).json({
        message: "Eksik veya gecersiz alanlar var.",
        missing,
      });
    }

    next();
  };
}

export const validateInputProducts = (req, res, next) => {
  const { title, description, code, price, status, stock, category } = req.body;

  // Validar presencia de campos y tipos de datos en un solo paso
  if (
    !title || typeof title !== "string" ||
    !description || typeof description !== "string" ||
    !code || typeof code !== "number" ||
    price === undefined || typeof price !== "number" ||
    status === undefined || typeof status !== "boolean" ||
    stock === undefined || typeof stock !== "number" ||
    !category || typeof category !== "string"
    
  ) {
    return res.status(400).send({ message: "Faltan algunos parámetros obligatorios o tienen tipos de datos inválidos" });
  }

  next();
};
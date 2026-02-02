const asyncHandler = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export { asyncHandler };



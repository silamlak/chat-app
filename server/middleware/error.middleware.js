const errorMiddleware = (err, req, res, next) => {
  try {
    
    let error = { ...err };
    error.message = err.message;
    // console.log(error);

    //mongoose bad object id
    if (err.name === "CastError") {
      const message = `Resource not found with id of ${err?.value}`;
      error = new Error(message);
      error.statusCode = 404;
    }

    //mongoose duplicate key
    if (err.code === 11000) {
      const message = "Duplicate field value enteredd";
      error = new Error(message);
      error.statusCode = 400;
    }

    //mongoose validation error
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((value) => value.message);
      error = new Error(message.join(", "));
      error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Server Error",
    });

  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;

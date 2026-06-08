export const globalError = ({
  message = "something went wrong",
  status = 400,
  extra = undefined,
} = {}) => {
  throw new Error(message, { cause: { status, extra } });
};

export const badRequest = ({ message = "bad request", extra }) => {
  return globalError({ message, status: 400, extra });
};

export const unathorized = ({ message = "unauthorized", extra }) => {
  return globalError({ message, status: 401, extra });
};

export const forbidden = ({ message = "forbidden", extra }) => {
  return globalError({ message, status: 403, extra });
};

export const notFoundError = ({ message = "User not found", extra }) => {
  return globalError({ message, status: 404, extra });
};

export const conflictError = ({ message = "user already exist", extra }) => {
  return globalError({ message, status: 409, extra });
};

export const catchError = (err, req, res, next) => {
  return res.status(err.cause?.status || 500).json({
    message: err.message,
  });
};

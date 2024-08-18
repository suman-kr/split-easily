import { Response } from "express";

export const sendResponse = (
  res: Response,
  httpCode: number,
  data = {},
  message = ""
) => {
  res.statusCode = httpCode;
  return res.json({
    data,
    message,
    code: httpCode.toString(),
  });
};

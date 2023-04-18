import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

const validateInputs = (rules: any): any[] => {
  return [
    ...rules,
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        return next();
      }

      const extractedErrors = [];
      errors
        .array()
        .map((err) => extractedErrors.push({ [err.param]: err.msg }));

      return res.status(422).json({
        errors: extractedErrors,
      });
    },
  ];
};

export default validateInputs;

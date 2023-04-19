import { Request, Response, NextFunction } from "express";
import {
  getUserById,
  getUserByUsername,
  createUser,
  updateUser,
} from "../models/encryption";

export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getUserById(req.query.page));
  } catch (err) {
    console.error(`Error while getting to-do/ notes`, err.message);
    next(err);
  }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getUserByUsername(req.body));
  } catch (err) {
    console.error(`Error while creating to-do/ note`, err.message);
    next(err);
  }
};

export const patch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await updateUser(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating to-do/ note`, err.message);
    next(err);
  }
};

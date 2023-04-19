import { Request, Response, NextFunction } from "express";

import { getToDoById, createToDo, updateToDo } from "../models/db";
import {
  comparePassword,
  // token? here usually jwt?
} from "../models/encryption";

// user data

// todo/ note data
export const getToDo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await getToDoById(req.query.page));
  } catch (err) {
    console.error(`Error while getting to-do/ notes`, err.message);
    next(err);
  }
};

export const postToDO = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await createToDo(req.body));
  } catch (err) {
    console.error(`Error while creating to-do/ note`, err.message);
    next(err);
  }
};

export const patchToDo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await updateToDo(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating to-do/ note`, err.message);
    next(err);
  }
};

export const removeToDo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await removeToDo(req.params.id));
  } catch (err) {
    console.error(`Error while deleting to-do/ note`, err.message);
    next(err);
  }
};

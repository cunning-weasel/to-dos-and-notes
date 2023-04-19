import { Request, Response, NextFunction } from "express";
import { getToDoById, getOwnerById, createToDo, updateToDo } from "../models/app";

export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getToDoById(req.query.page));
  } catch (err) {
    console.error(`Error while getting to-do/ notes`, err.message);
    next(err);
  }
}

export const post = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await createToDo(req.body));
  } catch (err) {
    console.error(`Error while creating to-do/ note`, err.message);
    next(err);
  }
}

export const patch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await updateToDo(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating to-do/ note`, err.message);
    next(err);
  }
}

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await auth_user.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting to-do/ note`, err.message);
    next(err);
  }
}

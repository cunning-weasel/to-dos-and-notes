import { Request, Response, NextFunction } from "express";
import auth_user from "../models/todos";

async function get(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await auth_user.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting to-do/ notes`, err.message);
    next(err);
  }
}

async function post(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await auth_user.post(req.body));
  } catch (err) {
    console.error(`Error while creating to-do/ note`, err.message);
    next(err);
  }
}

async function put(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await auth_user.put(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating to-do/ note`, err.message);
    next(err);
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await auth_user.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting to-do/ note`, err.message);
    next(err);
  }
}

export default { get, post, put, remove };

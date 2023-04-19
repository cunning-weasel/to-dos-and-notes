import { Request, Response, NextFunction } from "express";
import {
  getToDoById,
  getOwnerById,
  createToDo,
  updateToDo,
} from "../models/db";

// user data
export const getUserById = async (id: string) => {
  return getUserByIdC(id);
};

export const getUserByUsername = async (username: string) => {
  return getUserByUsernameC(username);
};

export const createUser = async (user) => {
  // encrypt the user's password before creating the user
  user.password = encryption_lib.encrypt(user.password, user.something);
  return createUserC(user);
};

export const updateUser = async (id, updates) => {
  // encrypt the user's new password before updating the user
  if (updates.password) {
    updates.password = encryption_lib.encrypt(id, updates.password);
  }

  return updateUserC(id, updates);
};

// todo/ note data
export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getToDoById(req.query.page));
  } catch (err) {
    console.error(`Error while getting to-do/ notes`, err.message);
    next(err);
  }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await createToDo(req.body));
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
    res.json(await updateToDo(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating to-do/ note`, err.message);
    next(err);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await auth_user.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting to-do/ note`, err.message);
    next(err);
  }
};

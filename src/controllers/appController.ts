import { Request, Response, NextFunction } from "express";

import { getUserId } from "../models/db";
import {
  comparePassword,
  // token? here usually jwt?
} from "../models/encryption";

// todo/ note data
export const getToDo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await getUserId(req.user.id));
    let rows, todos;
    todos = rows.map((row) => {
      return {
        id: row.id,
        title: row.title,
        completed: row.completed == 1 ? true : false,
        url: "/app" + row.id,
      };
    });
    res.locals.todos = todos;
    res.locals.activeCount = todos.filter(function (todo) {
      return !todo.completed;
    }).length;
    res.locals.completedCount = todos.length - res.locals.activeCount;
    next();
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

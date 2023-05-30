import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { Store, SessionData, Session } from "express-session";

import ffi from "ffi-napi";

// function signatures
const db_lib = ffi.Library("modules/sqlite/sqlite_wrapper_libc.so", {
  open_db: ["int", ["void"]],
  close_db: ["int", ["void"]],
  show_data_db: ["int", ["void"]],
  // user ops
  create_user: ["int", ["string", "string", "string"]],
  username_get: ["int", ["string"]],
  get_by_owner_id: ["int", ["int"]],
  // todo ops
  insert_data_into_todos: ["int", ["int", "string", "int"]],
  update_todo: ["int", ["string", "int", "int", "int"]],
  remove_todo: ["int", ["int", "int"]],
  remove_completed_todo: ["int", ["int", "int"]],
  // store ops
  pull_session: ["void", ["string"]],
  upsert_session: ["void", ["string", "string"]],
  update_session: ["void", ["string", "int"]],
  delete_session: ["void", ["string"]],
});

// db ops
export const openDb = async (): Promise<number> => {
  try {
    await db_lib.open_db();
  } catch (err) {
    return err;
  }
};

export const closeDb = async (): Promise<number> => {
  try {
    await db_lib.close_db();
  } catch (err) {
    return err;
  }
};

export const showDbData = async (): Promise<number> => {
  try {
    await db_lib.show_data_db();
  } catch (err) {
    return err;
  }
};

// user ops
export const createUser = async (
  username: string,
  hashedPassWord: string,
  salt: string
): Promise<number> => {
  try {
    await db_lib.create_user(username, hashedPassWord, salt);
  } catch (err) {
    return err;
  }
};

export const getUserName = async (username: string): Promise<number> => {
  try {
    await db_lib.username_get(username);
  } catch (err) {
    return err;
  }
};

export const getUserId = async (id: number): Promise<number> => {
  try {
    await db_lib.get_by_owner_id(id);
  } catch (err) {
    return err;
  }
};

// todo ops
export const insertIntoToDos = async (
  id: number,
  title: string,
  completed: number
): Promise<number> => {
  try {
    await db_lib.insert_data_into_todos(id, title, completed);
  } catch (err) {
    return err;
  }
};

export const updateToDo = async (
  title: string,
  completed: number,
  id: number,
  owner_id: number
): Promise<number> => {
  try {
    await db_lib.update_todo(title, completed, id, owner_id);
  } catch (err) {
    return err;
  }
};

export const removeToDo = async (
  id: number,
  owner_id: number
): Promise<number> => {
  try {
    await db_lib.remove_todo(id, owner_id);
  } catch (err) {
    return err;
  }
};

export const removeCompletedToDo = async (
  id: number,
  completed: number
): Promise<number> => {
  try {
    await db_lib.remove_completed_todo(id, completed);
  } catch (err) {
    return err;
  }
};

// store ops
// need all methods for custom store impl. thank gawd for ts auto-everything
export class customSqLiteStore implements Store {
  // start custom impl
  get = async (sid: string, callback: any): Promise<void> => {
    // should generate sid here?
    try {
      await db_lib.pull_session(sid);
      callback?.();
    } catch (err) {
      callback?.(err);
    }
  };

  set = async (
    sid: string,
    session: any, // SessionData
    callback: any
  ): Promise<void> => {
    try {
      await db_lib.upsert_session(sid, session);
      callback?.();
    } catch (err) {
      callback(err);
    }
  };

  touch = async (
    // const options {
    //   checkPeriod: 20 * 60 * 1000, // check for expired sessions every 20 minutes
    //   maxAge: 50 * 60 * 1000, // sessions expire after 50 minutes
    // };
    sid: string,
    session: any, // SessionData
    callback: any
  ): Promise<void> => {
    // update session, resets timer
    try {
      await db_lib.update_session(sid, session);
      callback();
    } catch (err) {
      callback(err);
    }
  };

  destroy = async (
    sid: string,
    callback?: (err?: any) => void
  ): Promise<void> => {
    // delete session
    try {
      await db_lib.delete_session(sid);
      callback?.();
    } catch (err) {
      callback?.(err);
    }
  };
  // end custom impl methods

  // ...
  // ...
  // ...

  // other methods need at least an empty implementations
  regenerate(
    req: Request<ParamsDictionary, any, any, any>,
    callback: (err?: any) => void
  ): void {}
  load(
    sid: string,
    callback: (err: any, session?: SessionData) => void
  ): void {}
  createSession(
    req: Request<ParamsDictionary, any, any, any>,
    session: SessionData
  ): Session & SessionData {
    return {} as Session & SessionData;
  }
  addListener(
    eventName: string | symbol,
    listener: (...args: any[]) => void
  ): this {
    return this;
  }
  on(eventName: string | symbol, listener: (...args: any[]) => void): this {
    return this;
  }
  once(eventName: string | symbol, listener: (...args: any[]) => void): this {
    return this;
  }
  removeListener(
    eventName: string | symbol,
    listener: (...args: any[]) => void
  ): this {
    return this;
  }
  off(eventName: string | symbol, listener: (...args: any[]) => void): this {
    return this;
  }
  removeAllListeners(event?: string | symbol): this {
    return this;
  }
  setMaxListeners(n: number): this {
    return this;
  }
  getMaxListeners(): number {
    return 0;
  }
  listeners(event: string | symbol): Function[] {
    return [];
  }
  rawListeners(event: string | symbol): Function[] {
    return [];
  }
  emit(eventName: string | symbol, ...args: any[]): boolean {
    return false;
  }
  listenerCount(event: string | symbol): number {
    return 0;
  }
  prependListener(
    eventName: string | symbol,
    listener: (...args: any[]) => void
  ): this {
    return this;
  }
  prependOnceListener(
    eventName: string | symbol,
    listener: (...args: any[]) => void
  ): this {
    return this;
  }
  eventNames(): (string | symbol)[] {
    return [];
  }
}

// note to self - function returns an int and takes two args, a string and a pointer: ["int", ["string", "pointer"]]
// c_func: ["int", ["string", "pointer"]],

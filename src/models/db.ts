import { error } from "console";
import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { Store, SessionData, Session } from "express-session";

import ffi from "ffi-napi";
import { ParsedQs } from "qs";
// function signatures
const db_lib = ffi.Library("../modules/sqlite/output_sqlite_libc.so", {
  open_db: ["int", ["void"]],
  close_db: ["int", ["pointer"]],
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
  load_session: ["void", ["string"]],
  upsert_session: ["void", ["string", "int"]],
  update_session: ["void", ["string", "int"]],
  delete_session: ["void", ["string"]],
});

// db ops
export const openDb = (): number => {
  return db_lib.open_db();
};

export const closeDb = (pointer: any): number => {
  return db_lib.close_db(pointer);
};

export const showDbData = (): number => {
  return db_lib.show_data_db();
};

// user ops
export const createUser = (
  username: string,
  hashedPassWord: string,
  salt: string
): number => {
  return db_lib.create_user(username, hashedPassWord, salt);
};

export const getUserName = (username: string) => {
  return db_lib.username_get(username);
};

export const getUserId = (id: number): number => {
  return db_lib.get_by_owner_id(id);
};

// todo ops
export const insertIntoToDos = (
  id: number,
  title: string,
  completed: number
): number => {
  return db_lib.insert_data_into_todos(id, title, completed);
};

export const updateToDo = (
  title: string,
  completed: number,
  id: number,
  owner_id: number
): number => {
  return db_lib.update_todo(title, completed, id, owner_id);
};

export const removeToDo = (id: number, owner_id: number): number => {
  return db_lib.remove_todo(id, owner_id);
};

export const removeCompletedToDo = (id: number, completed: number): number => {
  return db_lib.remove_completed_todo(id, completed);
};

// store ops
// need almost all for custom store impl. thank gawd for .ts auto-everything
export class customSqLiteStore implements Store {
  // start custom impl
  get = async (
    sid: string,
    callback: (err: any, session?: SessionData | null) => void
  ): Promise<void> => {
    try {
      const session = await db_lib.load_session(sid);
      callback(session);
    } catch (err) {
      callback(err);
    }
  };

  set = async (
    sid: string,
    session: SessionData,
    callback?: (err?: any) => void
  ): Promise<void> => {
    // update && insert session
    try {
      await db_lib.upsert_session(sid, session.cookie.maxAge);
      callback?.();
    } catch (err) {
      callback?.(err);
    }
  };

  touch = async (
    sid: string,
    session: SessionData,
    callback?: (err?: any) => void
  ): Promise<void> => {
    // update session, resets timer
    try {
      await db_lib.update_session(sid, session.cookie.maxAge);
      callback?.();
    } catch (err) {
      callback?.(err);
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

  clear?(callback?: (err?: any) => void): void {
    throw new Error("Method not implemented.");
  }
  all?(
    callback: (
      err: any,
      obj?: SessionData[] | { [sid: string]: SessionData }
    ) => void
  ): void {
    throw new Error("Method not implemented.");
  }
  length?(callback: (err: any, length?: number) => void): void {
    throw new Error("Method not implemented.");
  }
  regenerate(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    callback: (err?: any) => any
  ): void {
    throw new Error("Method not implemented.");
  }
  load(sid: string, callback: (err: any, session?: SessionData) => any): void {
    throw new Error("Method not implemented.");
  }
  createSession(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    session: SessionData
  ): Session & SessionData {
    throw new Error("Method not implemented.");
  }
  addListener(
    eventName: string | symbol,
    listener: (...args: any[]) => void
  ): this {
    throw new Error("Method not implemented.");
  }
  on(eventName: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error("Method not implemented.");
  }
  once(eventName: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error("Method not implemented.");
  }
  removeListener(
    eventName: string | symbol,
    listener: (...args: any[]) => void
  ): this {
    throw new Error("Method not implemented.");
  }
  off(eventName: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error("Method not implemented.");
  }
  removeAllListeners(event?: string | symbol): this {
    throw new Error("Method not implemented.");
  }
  setMaxListeners(n: number): this {
    throw new Error("Method not implemented.");
  }
  getMaxListeners(): number {
    throw new Error("Method not implemented.");
  }
  listeners(eventName: string | symbol): Function[] {
    throw new Error("Method not implemented.");
  }
  rawListeners(eventName: string | symbol): Function[] {
    throw new Error("Method not implemented.");
  }
  emit(eventName: string | symbol, ...args: any[]): boolean {
    throw new Error("Method not implemented.");
  }
  listenerCount(eventName: string | symbol): number {
    throw new Error("Method not implemented.");
  }
  prependListener(
    eventName: string | symbol,
    listener: (...args: any[]) => void
  ): this {
    throw new Error("Method not implemented.");
  }
  prependOnceListener(
    eventName: string | symbol,
    listener: (...args: any[]) => void
  ): this {
    throw new Error("Method not implemented.");
  }
  eventNames(): (string | symbol)[] {
    throw new Error("Method not implemented.");
  }
}

// note to self - function returns an int and takes two args, a string and a pointer: ["int", ["string", "pointer"]]
// c_func: ["int", ["string", "pointer"]],

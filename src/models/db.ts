import ffi from "ffi-napi";
// function signatures
const db_lib = ffi.Library("../modules/sqlite/output_sqlite_libc.so", {
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
});

// db ops
export const openDb = (): number => {
  return db_lib.open_db();
};

export const closeDb = (): number => {
  return db_lib.close_db();
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

// note to self - function returns an int and takes two args, a string and a pointer: ["int", ["string", "pointer"]]
// c_func: ["int", ["string", "pointer"]],

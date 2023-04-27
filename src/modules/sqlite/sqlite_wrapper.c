#include <stdio.h>
#include <sqlite3.h>

sqlite3 *db;
char *zErrMsg = 0;
int return_code;
char *sql;
char *users_table = "users";
char *todos_table = "to-dos";
char *sessions_table = "sessions";
char *user_name = "";

// print out name and val for each col on the row
static int row_callback(void *NotUsed, int numCols, char **valEachCol, char **azColName)
{
    for (int i = 0; i < numCols; i++)
    {
        printf("%s = %s\n", azColName[i], valEachCol[i] ? valEachCol[i] : "NULL");
    }
    printf("\n");
    return 0;
};

// open db connection and init schema
int open_db(void)
{
    return_code = sqlite3_open("cunning-to-dos.db", &db);
    if (return_code != SQLITE_OK)
    {
        fprintf(stderr, "Can't open_db master weasel: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        return 1;
    }
    // create users table
    sql = "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, hashed_password BLOB, salt BLOB);";
    return_code = sqlite3_exec(db, sql, 0, 0, &zErrMsg);
    if (return_code != SQLITE_OK)
    {
        fprintf(stderr, "SQL users create table error master weasel: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
        sqlite3_close(db);
        return 1;
    }
    printf("'%s' table created successfully master weasel\n", users_table);

    // create todos table
    sql = "CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY, owner_id INTEGER NOT NULL, title TEXT NOT NULL, completed INTEGER);";
    return_code = sqlite3_exec(db, sql, 0, 0, &zErrMsg);
    if (return_code != SQLITE_OK)
    {
        fprintf(stderr, "todos create table error master weasel: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
        sqlite3_close(db);
        return 1;
    }
    printf("'%s' table created successfully master weasel\n", todos_table);

    // create sessions table
    sql = "CREATE TABLE IF NOT EXISTS sessions (sid TEXT PRIMARY KEY, session TEXT NOT NULL, expire TIMESTAMP NOT NULL);";
    return_code = sqlite3_exec(db, sql, 0, 0, &zErrMsg);
    if (return_code != SQLITE_OK)
    {
        fprintf(stderr, "sessions create table error master weasel: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
        sqlite3_close(db);
        return 1;
    }
    printf("'%s' table created successfully master weasel\n", sessions_table);

    return 0;
}

// sessions ops
void load_session(char sid)
{
    sql = sqlite3_mprintf("INSERT OR IGNORE INTO sessions ='%q';", sid);
    return_code = sqlite3_exec(db, sql, row_callback, 0, &zErrMsg);
    if (return_code != SQLITE_OK)
    {
        fprintf(stderr, "SQL sid_insert_error master weasel: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    }
    else
    {
        fprintf(stdout, "Data sid_insert success master weasel\n");
    }
    return 0;
}

void upsert_session(char sid, char session)
{
    sql = sqlite3_mprintf("UPDATE sessions SET session ='%q' WHERE sid ='%q';", sid, session);
    return_code = sqlite3_exec(db, sql, row_callback, 0, &zErrMsg);
    if (return_code != SQLITE_OK)
    {
        fprintf(stderr, "SQL upsert_error master weasel: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    }
    else
    {
        fprintf(stdout, "Data upsert_success master weasel\n");
    }
    return 0;
}

void update_session(char sid, char session)
{
    // INSERT INTO sessions (sid, expires, data) VALUES (?, ?, ?);
    // SELECT data FROM sessions WHERE sid = ? AND expires > datetime('now');
    // UPDATE sessions SET data = ?, expires = ? WHERE sid = ?;
}

void delete_session(char sid)
{
    // DELETE FROM sessions WHERE sid = ?;
}

// create an initial user (username: alice, password: inwonderland) with added salt
int create_user(char *user_name, char *hashed_password, char *salt[])
{
    // char *salt; - add to model to expidite db op? change data type too!
    sql = sqlite3_mprintf("INSERT OR IGNORE INTO users (username, hashed_password, salt) VALUES ('%q', '%q', '%q');", user_name, hashed_password, salt);
    // run crypto ops in models to add pw, salt to db put op
    return_code = sqlite3_exec(db, sql, 0, 0, &zErrMsg);
    // run crypto ops in models to add password, salt to db put op
    if (return_code != SQLITE_OK)
    {
        fprintf(stderr, "insert_error master weasel: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
        sqlite3_close(db);
        return 1;
    }
    printf("'%s' alice with pw added successfully to db master weasel\n", todos_table);
    return 0;
}

// get username
int username_get(char *user_name)
{
    sql = sqlite3_mprintf("SELECT * FROM users WHERE username='%q';", user_name);
    return_code = sqlite3_exec(db, sql, NULL, NULL, &zErrMsg);
    sqlite3_free(sql);
    if (return_code != SQLITE_OK)
    {
        fprintf(stderr, "select users_error master weasel: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
        sqlite3_close(db);
        return 1;
    }
    return 0;
}

// getId
int get_by_owner_id(int *owner_id)
{
    sql = sqlite3_mprintf("SELECT * FROM todos WHERE owner_id ='%q';", owner_id);
    return_code = sqlite3_exec(db, sql, row_callback, 0, &zErrMsg);
    if (return_code != SQLITE_OK)
    {
        fprintf(stderr, "SQL write error master weasel: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    }
    else
    {
        fprintf(stdout, "get_owner_id success master weasel\n");
    }
    return 0;
}

// patch/ put ops
int update_todo(char *title, int *completed, int *id, int *owner_id)
{
    sql = sqlite3_mprintf("UPDATE todos SET title ='%q', completed ='%q' WHERE id ='%q' AND owner_id ='%q';", title, completed, id, owner_id);
    return_code = sqlite3_exec(db, sql, row_callback, 0, &zErrMsg);
    if (return_code != SQLITE_OK)
    {
        fprintf(stderr, "SQL todo_update_error master weasel: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    }
    else
    {
        fprintf(stdout, "Data todo_update success master weasel\n");
    }
    return 0;
}

int insert_data_into_todos(int *owner_id, char *title, int *completed)
{
    sql = sqlite3_mprintf("INSERT INTO to-dos (owner_id, title, completed) VALUES ('%q', '%q', '%q')", owner_id, title, completed);
    return_code = sqlite3_exec(db, sql, row_callback, 0, &zErrMsg);
    if (return_code != SQLITE_OK)
    {
        fprintf(stderr, "SQL insert error master weasel: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    }
    else
    {
        fprintf(stdout, "Data insert success master weasel\n");
    }
    return 0;
}

// rm ops
int remove_todo(int *id, int *owner_id)
{
    sql = sqlite3_mprintf("DELETE FROM todos WHERE id ='%q' AND owner_id ='%q';", id, owner_id);
    return_code = sqlite3_exec(db, sql, row_callback, 0, &zErrMsg);
    if (return_code != SQLITE_OK)
    {
        fprintf(stderr, "SQL write error master weasel: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    }
    else
    {
        fprintf(stdout, "Data delete success master weasel\n");
    }
    return 0;
}

int remove_completed_todo(int *owner_id, int *completed_todo)
{
    sql = sqlite3_mprintf("DELETE FROM todos WHERE owner_id ='%q' AND completed ='%q';", owner_id, completed_todo);
    return_code = sqlite3_exec(db, sql, row_callback, 0, &zErrMsg);
    if (return_code != SQLITE_OK)
    {
        fprintf(stderr, "SQL write error master weasel: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    }
    else
    {
        fprintf(stdout, "Data delete success master weasel\n");
    }
    return 0;
}

// show table
int show_data_db(void)
{
    // sql = "SELECT * FROM to-dos";
    sql = "SELECT * FROM users";
    return_code = sqlite3_exec(db, sql, row_callback, 0, &zErrMsg);
    if (return_code != SQLITE_OK)
    {
        fprintf(stderr, "SQL select error master weasel: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    }
    return 0;
}

// final shutdown db
int close_db(db)
{
    return sqlite3_close(db);
    return 0;
}

// compile and link: gcc -o output_sqlite_wrapper sqlite_wrapper.c -lsqlite3
// run comiled file: ./output_sqlite_wrapper

// install sqlite stuff linux
// sudo apt-get install sqlite3 libsqlite3-dev

// compile to shared library for ffi call - no need to export
// gcc -shared -o mylib.so sqlite.c encryption.c -lsqlite3

// ...

// OG sqlite ops
// static int row_callback(void *NotUsed, int numCols, char **valEachCol, char **azColName)
// {
//     for (int i = 0; i < numCols; i++)
//     {
//         printf("%s = %s\n", azColName[i], valEachCol[i] ? valEachCol[i] : "NULL");
//     }
//     printf("\n");
//     return 0;
// };

// int main()
// {
//     sqlite3 *db;
//     char *zErrMsg = 0;
//     int return_code;
//     char *sql;
//     char *userTableName = "users";
//     char *todoTableName = "to-dos";

//     // open db connection
//     return_code = sqlite3_open("test_Cqlite.db", &db);
//     if (return_code != SQLITE_OK)
//     {
//         fprintf(stderr, "Can't open_db master weasel: %s\n", sqlite3_errmsg(db));
//         sqlite3_close(db);
//         return (1); // status code of 1
//     }

//     // grab table and free mem routine
//     sql = sqlite3_mprintf("SELECT name FROM sqlite_master WHERE type='table' AND name='%q';", userTableName);
//     return_code = sqlite3_exec(db, sql, NULL, NULL, &zErrMsg);
//     sqlite3_free(sql);
//     if (return_code != SQLITE_OK)
//     {
//         fprintf(stderr, "error master weasel: %s\n", zErrMsg);
//         sqlite3_free(zErrMsg);
//         sqlite3_close(db);
//         return 1;
//     }

//     // check for changes in db - rows modified
//     if (sqlite3_changes(db) == 0)
//     {
//         // create table
//         // drill down on schema for use in other parts of app
//         sql = "CREATE TABLE test_table (id integer NOT NULL, name text NOT NULL, userPreference text NOT NULL, length integer NOT NULL);";
//         return_code = sqlite3_exec(db, sql, 0, 0, &zErrMsg);
//         if (return_code != SQLITE_OK)
//         {
//             fprintf(stderr, "SQL create table error master weasel: %s\n", zErrMsg); // should throw sqlite error right?
//             sqlite3_free(zErrMsg);
//             sqlite3_close(db);
//             return 1;
//         }
//         printf("No changes, assuming table '%s' does not exist... has now been created successfully master weasel\n", userTableName);
//     }
//     else
//     {
//         printf("Table '%s' already exists master weasel!(assuming, actually)\n", userTableName);
//     }

//     // insert data
//     sql = "INSERT INTO test_table VALUES (1, 'foo', 'weasel', 300), (2, 'bar', 'cat', 1), (3, 'potato', 'poodle', 16)";
//     return_code = sqlite3_exec(db, sql, row_callback, 0, &zErrMsg);
//     if (return_code != SQLITE_OK)
//     {
//         fprintf(stderr, "SQL write error master weasel: %s\n", zErrMsg);
//         sqlite3_free(zErrMsg);
//     }
//     else
//     {
//         fprintf(stdout, "Data insert success master weasel\n");
//     }
//     // TODO should create another table and join for to-dos & notes?
//     // update tables etc

//     // show all data from table
//     sql = "SELECT * FROM test_table";
//     return_code = sqlite3_exec(db, sql, row_callback, 0, &zErrMsg);
//     if (return_code != SQLITE_OK)
//     {
//         fprintf(stderr, "SQL select error master weasel: %s\n", zErrMsg);
//         sqlite3_free(zErrMsg);
//     }

//     // TODO
//     // PATCH/ PUT ops

//     // TODO remove entries

//     // final shutdown db
//     sqlite3_close(db);
//     return 0;
// };

// docs: https://www.sqlite.org/quickstart.html

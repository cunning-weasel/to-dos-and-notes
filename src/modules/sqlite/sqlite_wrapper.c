#include <stdio.h>
#include <sqlite3.h>

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

sqlite3 *db;
char *zErrMsg = 0;
int return_code;
char *sql;
char *users_table = "users";
char *todos_table = "to-dos";
char *user_name = "";

// open db connection and init schema
int open_db()
{
    return_code = sqlite3_open("cunning-todos.db", &db);
    if (return_code != SQLITE_OK)
    {
        fprintf(stderr, "Can't open_db master weasel: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        return 1;
    }
    // create users table
    char sql = "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, hashed_password BLOB, salt BLOB);";
    return_code = sqlite3_exec(db, sql, 0, 0, &zErrMsg);
    if (return_code != SQLITE_OK)
    {
        fprintf(stderr, "SQL users create table error master weasel: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
        sqlite3_close(db);
        return 1;
    }
    printf("No changes, assuming '%s' table does not exist... has now been created successfully master weasel\n", users_table);

    // create todos table
    char sql = "CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY, owner_id INTEGER NOT NULL, title TEXT NOT NULL, completed INTEGER);";
    return_code = sqlite3_exec(db, sql, 0, 0, &zErrMsg);
    if (return_code != SQLITE_OK)
    {
        fprintf(stderr, "SQL todos create table error master weasel: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
        sqlite3_close(db);
        return 1;
    }
    printf("No changes, assuming '%s' table does not exist... has now been created successfully master weasel\n", todos_table);

    return 0;
}

// create an initial user (username: alice, password: thisiswonderland) with added salt
int create_user() {}

// get username
int username_get(char *user_name)
{
    sql = sqlite3_mprintf("SELECT * FROM users WHERE username='%q';", user_name);
    return_code = sqlite3_exec(db, sql, NULL, NULL, &zErrMsg);
    sqlite3_free(sql);
    if (return_code != SQLITE_OK)
    {
        fprintf(stderr, "select error master weasel: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
        sqlite3_close(db);
        return 1;
    }
    return 0;
}

// password check

// PATCH/ PUT ops
// insert data
int insert_data()
{
    sql = "INSERT INTO test_table VALUES (1, 'foo', 'weasel', 300), (2, 'bar', 'cat', 1), (3, 'potato', 'poodle', 16)";
    return_code = sqlite3_exec(db, sql, row_callback, 0, &zErrMsg);
    if (return_code != SQLITE_OK)
    {
        fprintf(stderr, "SQL write error master weasel: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    }
    else
    {
        fprintf(stdout, "Data insert success master weasel\n");
    }
        return 0;
}

// show table
int show_data()
{
    sql = "SELECT * FROM test_table";
    return_code = sqlite3_exec(db, sql, row_callback, 0, &zErrMsg);
    if (return_code != SQLITE_OK)
    {
        fprintf(stderr, "SQL select error master weasel: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    }
        return 0;
}

// TODO remove entries
int remove() {}

// final shutdown db
void close_db(sqlite3 *db)
{
    return sqlite3_close(db);
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

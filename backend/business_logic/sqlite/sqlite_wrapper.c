#include <stdio.h>
#include <sqlite3.h>

// export funcs
// #if defined(WIN32) || defined(_WIN32)
// #else
// #define EXPORT
// #endif

// EXPORT int32_t c_fib(int x)
// {};

// print out name and val for each col on the row
static int row_callback(int numCols, char **valEachCol, char **azColName)
{
    for (int i = 0; i < numCols; i++)
    {
        printf("%s = %s\n", azColName[i], valEachCol[i] ? valEachCol[i] : "NULL");
    }
    printf("\n");
    return 0;
};

int main(int argc, char **argv)
{
    // store connection to sqlite in pointer to var db
    sqlite3 *db;
    char *zErrMsg = 0;
    // return code
    int rc;
    char *sql;
    char *tableName = "test_table";

    // open db connection
    rc = sqlite3_open("test_Cqlite.db", &db);
    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "Can't open Db master weasel: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        return (1); // status code of 1
    }

    // grab table and free mem routine
    sql = sqlite3_mprintf("SELECT name FROM sqlite_master WHERE type='table' AND name='%q';", tableName);
    rc = sqlite3_exec(db, sql, NULL, NULL, &zErrMsg);
    sqlite3_free(sql);
    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "error master weasel: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
        sqlite3_close(db);
        return 1;
    }

    // check for changes in db
    if (sqlite3_changes(db) == 0)
    {
        // create table
        // drill down on schema for use in other parts of app
        //  "CREATE TABLE test_table 
        //  (id integer NOT NULL, name text NOT NULL, userPreference text NOT NULL, length integer NOT NULL);";
        sql = "CREATE TABLE test_table (id integer NOT NULL, name text NOT NULL, userPreference text NOT NULL, length integer NOT NULL);";
        rc = sqlite3_exec(db, sql, 0, 0, &zErrMsg);
        if (rc != SQLITE_OK)
        {
            fprintf(stderr, "SQL create table error master weasel: %s\n", zErrMsg); // should throw sqlite error right?
            sqlite3_free(zErrMsg);
            sqlite3_close(db);
            return 1;
        }
        printf("No changes, assuming table '%s' does not exist... has now been created successfully master weasel\n", tableName);
    }
    else
    {
        printf("Table '%s' already exists master weasel!(assuming, actually)\n", tableName);
    }

    // insert data
    const char *insert_data_sql = "INSERT INTO test_table VALUES (1, 'foo', 'weasel', 300), (2, 'bar', 'cat', 1), (3, 'potato', 'poodle', 16)";
    rc = sqlite3_exec(db, insert_data_sql, row_callback, 0, &zErrMsg);
    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL write error master weasel: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    }
    else
    {
        fprintf(stdout, "Data insert success master weasel\n");
    }

    // select data
    const char *select_data_sql = "SELECT * FROM test_table";
    rc = sqlite3_exec(db, select_data_sql, row_callback, 0, &zErrMsg);
    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL select error master weasel: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    }

    // remove entries with similar ids
    // DELETE FROM test_table WHERE age <= 200;

    // final shutdown db
    sqlite3_close(db);
    return 0;
};

// terminal command for compiling and linking code with sqlite3 lib
// compile: gcc -o output_sqlite_wrapper sqlite_wrapper.c -lsqlite3
// run comiled file: ./output_sqlite_wrapper

// install sqlite stuff linux
// sudo apt-get install sqlite3 libsqlite3-dev

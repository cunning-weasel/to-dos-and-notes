#include <stdio.h>
#include <sqlite3.h>

// call func for rows
static int row_callback(void *NotUsed, int numCols, char **valEachCol, char **azColName)
{
    // print out name and val for each col on the row
    for (int i = 0; i < numCols; i++)
    {
        printf("%s = %s\n", azColName[i], valEachCol[i] ? valEachCol[i] : "NULL");
    }
    printf("\n");
    return 0;
};

int main(int argc, char **argv)
{
    // store connection in sqlite pointer var db
    sqlite3 *db;
    char *zErrMsg = 0;
    // return code
    int rc;

    // open db connection / create if doesn't exist
    rc = sqlite3_open("test_Cqlite.db", &db);
    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "Can't open Db master weasel: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        return (1); // status code of 1
    }

    // create table and sql var
    const char *create_table_sql = "CREATE TABLE test_table (id integer NOT NULL, name text NOT NULL, userPreference text NOT NULL, length integer NOT NULL);";

    rc = sqlite3_exec(db, create_table_sql, row_callback, 0, &zErrMsg);
    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL create error master weasel: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    }
    else
    {
        fprintf(stdout, "Table created successfully master weasel\n");
    }

    // insert data
    const char *insert_data_sql = "INSERT INTO test_table VALUES (1, 'foo', 'weasel', 300), (2, 'bar', 'cat', 1), (3, 'potato', 'poodle', 16)";

    rc = sqlite3_exec(db, insert_data_sql, row_callback, 0, &zErrMsg);
    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL write error: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    }
    else
    {
        fprintf(stdout, "Data inserted successfully master weasel\n");
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

    sqlite3_close(db);
    return 0;
};

// terminal command for compiling and linking code with sqlite3 lib
// compile: gcc -o output_sqlite_wrapper sqlite_wrapper.c -lsqlite3
// run comiled file: ./output_sqlite_wrapper

// install sqlite stuff linux
// sudo apt-get install sqlite3 libsqlite3-dev

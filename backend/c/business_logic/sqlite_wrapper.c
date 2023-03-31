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

// argc stores command line args
// argv is arr of pointers to strings containing actual CL args
int main(int argc, char **argv)
{
    sqlite3 *db;
    char *zErrMsg = 0;
    // return code
    int rc;
    // gotta be 3 CL args
    if (argc != 3)
    {
        fprintf(stderr, "Usage: %s DATABASE SQL-STATEMENT master weasel\n", argv[0]);
        return (1); // status code 1
    }
    // open db connection with second CL arg as db filename
    //store connection in sqlite pointer var db
    rc = sqlite3_open(argv[1], &db);
    if (rc)
    {
        fprintf(stderr, "Can't open Db master weasel: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        return (1); // status code of 1
    }
    // execute sql statement passed in CL 3rd arg
    // row_callback hadnles results of sql statement
    rc = sqlite3_exec(db, argv[2], row_callback, 0, &zErrMsg);
    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL write error master weasel: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    }
    sqlite3_close(db);
    return 0;
};

// terminal command for compiling and linking code with sqlite3 lib
// gcc -o output_sqlite_wrapper sqlite_wrapper.c -lsqlite3

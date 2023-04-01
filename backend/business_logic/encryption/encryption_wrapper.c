// geez bruh..
#include <openssl/conf.h>
#include <openssl/evp.h>
#include <openssl/err.h>

int main(int argc, char **argv)
{
    /* Load the human readable error strings for libcrypto */
    ERR_load_crypto_strings();

    /* Load all digest and cipher algorithms */
    OpenSSL_add_all_algorithms();

    /* Load config file, and other important initialisation */
    OPENSSL_config(NULL);

    /* ... Do some crypto stuff here ... */

    /* Clean up */
    // notes to self - error handling will be a beast

    /* Removes all digests and ciphers */
    EVP_cleanup();

    /* if you omit the next, a small leak may be left when you make use of the BIO (low level API) for e.g. base64 transformations */
    CRYPTO_cleanup_all_ex_data();

    /* Remove error strings */
    ERR_free_strings();

    return 0;
}

// compile: gcc -o client client.c -lssl -lcrypto  ???

// https://www.openssl.org/docs/man3.0/man7/crypto.html
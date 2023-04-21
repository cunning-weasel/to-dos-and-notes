#include <stdio.h>
#include <openssl/evp.h>
#include <openssl/bio.h>
#include <openssl/err.h>
#include <openssl/rand.h>
#include <string.h>             /* strlen               */
#include <openssl/core_names.h> /* OSSL_KDF_*           */
#include <openssl/params.h>     /* OSSL_PARAM_*         */
#include <openssl/thread.h>     /* OSSL_set_max_threads */
#include <openssl/kdf.h>        /* EVP_KDF_*            */

// generate random initialization vector to ensure that each encrypted message is different
int generate_random_iv(unsigned char *iv, size_t iv_len)
{
    if (RAND_bytes(iv, iv_len) != 1)
    {
        return -1;
    }
    return 0;
}

// Argon2 hashes
// derive a key from a password using a salt and iteration count
int argon_go_vroom(void)
{
    int retval = 1;
    EVP_KDF *kdf = NULL;
    EVP_KDF_CTX *kctx = NULL;
    OSSL_PARAM params[6], *p = params;
    /* argon2 params, please refer to RFC9106 for recommended defaults */
    uint32_t lanes = 2, threads = 2, memcost = 65536;
    char pwd[] = "1234567890", salt[] = "saltsalt";
    /* derive result */
    size_t outlen = 128;
    unsigned char result[outlen];

    /* required if threads > 1 */
    if (OSSL_set_max_threads(NULL, threads) != 1)
    {
        goto fail
    };

    p = params;
    *p++ = OSSL_PARAM_construct_uint32(OSSL_KDF_PARAM_THREADS, &threads);
    *p++ = OSSL_PARAM_construct_uint32(OSSL_KDF_PARAM_ARGON2_LANES, &lanes);
    *p++ = OSSL_PARAM_construct_uint32(OSSL_KDF_PARAM_ARGON2_MEMCOST, &memcost);
    *p++ = OSSL_PARAM_construct_octet_string(OSSL_KDF_PARAM_SALT, salt, strlen((const char *)salt));
    *p++ = OSSL_PARAM_construct_octet_string(OSSL_KDF_PARAM_PASSWORD, pwd, strlen((const char *)pwd));
    *p++ = OSSL_PARAM_construct_end();

    if ((kdf = EVP_KDF_fetch(NULL, "ARGON2D", NULL)) == NULL)
    {
        goto fail
    };
    if ((kctx = EVP_KDF_CTX_new(kdf)) == NULL)
    {
        goto fail
    };
    if (EVP_KDF_derive(kctx, &result[0], outlen, params) != 1)
    {
        goto fail
    };

    printf("Output = %s\n", OPENSSL_buf2hexstr(result, outlen));
    retval = 0;

fail:
    EVP_KDF_free(kdf);
    EVP_KDF_CTX_free(kctx);
    OSSL_set_max_threads(NULL, 0);

    return retval;
}

// encryption
// TODO add the param and make do_crypt with
// param as flag instead?
int encrypt(const char *in, char *out)
{
    /* Allow enough space in output buffer for additional block */
    unsigned char inbuf[1024], outbuf[1024 + EVP_MAX_BLOCK_LENGTH];
    int inlen, outlen;
    EVP_CIPHER_CTX *ctx;
    /*
     * set these from generate_random_iv
     * and Argon2 algo
     */
    unsigned char key[] = "0123456789abcdeF";
    unsigned char iv[] = "1234567887654321";

    /* Don't set key or IV right away; we want to check lengths */
    ctx = EVP_CIPHER_CTX_new();
    if (!EVP_CipherInit_ex2(ctx, EVP_aes_128_cbc(), NULL, NULL, 1, NULL))
    {
        /* Error */
        EVP_CIPHER_CTX_free(ctx);
        return 0;
    }
    OPENSSL_assert(EVP_CIPHER_CTX_get_key_length(ctx) == 16);
    OPENSSL_assert(EVP_CIPHER_CTX_get_iv_length(ctx) == 16);

    /* Now we can set key and IV */
    if (!EVP_CipherInit_ex2(ctx, NULL, key, iv, 1, NULL))
    {
        /* Error */
        EVP_CIPHER_CTX_free(ctx);
        return 0;
    }

    while (true)
    {
        inlen = fread(inbuf, 1, 1024, in);
        if (inlen <= 0)
        {
            break
        };
        if (!EVP_CipherUpdate(ctx, outbuf, &outlen, inbuf, inlen))
        {
            /* Error */
            EVP_CIPHER_CTX_free(ctx);
            return 0;
        }
        fwrite(outbuf, 1, outlen, out);
    }
    if (!EVP_CipherFinal_ex(ctx, outbuf, &outlen))
    {
        /* Error */
        EVP_CIPHER_CTX_free(ctx);
        return 0;
    }
    fwrite(outbuf, 1, outlen, out);

    EVP_CIPHER_CTX_free(ctx);
    return 1;
}

int decrypt(const char *in, char *out)
{
    /* Allow enough space in output buffer for additional block */
    unsigned char inbuf[1024], outbuf[1024 + EVP_MAX_BLOCK_LENGTH];
    int inlen, outlen;
    EVP_CIPHER_CTX *ctx;
    /*
     * set these from generate_random_iv
     * and Argon2 algo
     */
    unsigned char key[] = "0123456789abcdeF";
    unsigned char iv[] = "1234567887654321";

    /* Don't set key or IV right away; we want to check lengths */
    ctx = EVP_CIPHER_CTX_new();
    if (!EVP_CipherInit_ex2(ctx, EVP_aes_128_cbc(), NULL, NULL, 0, NULL))
    {
        /* Error */
        EVP_CIPHER_CTX_free(ctx);
        return 0;
    }
    OPENSSL_assert(EVP_CIPHER_CTX_get_key_length(ctx) == 16);
    OPENSSL_assert(EVP_CIPHER_CTX_get_iv_length(ctx) == 16);

    /* Now we can set key and IV */
    if (!EVP_CipherInit_ex2(ctx, NULL, key, iv, 0, NULL))
    {
        /* Error */
        EVP_CIPHER_CTX_free(ctx);
        return 0;
    }

    while (true)
    {
        inlen = fread(inbuf, 1, 1024, in);
        if (inlen <= 0)
        {
            break
        };
        if (!EVP_CipherUpdate(ctx, outbuf, &outlen, inbuf, inlen))
        {
            /* Error */
            EVP_CIPHER_CTX_free(ctx);
            return 0;
        }
        fwrite(outbuf, 1, outlen, out);
    }
    if (!EVP_CipherFinal_ex(ctx, outbuf, &outlen))
    {
        /* Error */
        EVP_CIPHER_CTX_free(ctx);
        return 0;
    }
    fwrite(outbuf, 1, outlen, out);

    EVP_CIPHER_CTX_free(ctx);
    return 1;
}

// docs: https://www.openssl.org/docs/man3.1/man3/EVP_CipherInit_ex2.html
// compare?
int compare(const char *input, char *output)
{
    // implementation of compare algorithm

    // if char is identical, return 0
    // else return 1 (chars aren't the same)
}

// compile: gcc -o encryp_wrapper encryp_wrapper.c -lcrypto
// run ./ecryp_wrapper

// ...

// sha256 implementation
// int main(void)
// {
//     EVP_MD_CTX *ctx = NULL;
//     EVP_MD *sha256 = NULL;
//     const unsigned char msg[] = {0x00, 0x01, 0x02, 0x03};
//     unsigned int len = 0;
//     unsigned char *outdigest = NULL;
//     int ret = 1;

//     /* Create a context for the digest operation */
//     ctx = EVP_MD_CTX_new();
//     if (ctx == NULL)
//     {
//         goto err;
//     }

//     /*
//      * Fetch the SHA256 algorithm implementation for doing the digest. We're
//      * using the "default" library context here (first NULL parameter), and
//      * we're not supplying any particular search criteria for our SHA256
//      * implementation (second NULL parameter). Any SHA256 implementation will
//      * do.
//      * Fetch should just be done once, and could
//      * be used for multiple calls to other operations such as EVP_DigestInit_ex().
//      */
//     sha256 = EVP_MD_fetch(NULL, "SHA256", NULL);
//     if (sha256 == NULL)
//     {
//         goto err;
//     }

//     /* Initialise the digest operation */
//     if (!EVP_DigestInit_ex(ctx, sha256, NULL))
//     {
//         goto err;
//     }

//     /*
//      * Pass the message to be digested. This can be passed in over multiple
//      * EVP_DigestUpdate calls if necessary
//      */
//     if (!EVP_DigestUpdate(ctx, msg, sizeof(msg)))
//     {
//         goto err;
//     }

//     /* Allocate the output buffer */
//     outdigest = OPENSSL_malloc(EVP_MD_get_size(sha256));
//     if (outdigest == NULL)
//     {
//         goto err;
//     }

//     /* Now calculate the digest itself */
//     if (!EVP_DigestFinal_ex(ctx, outdigest, &len))
//     {
//         goto err;
//     }

//     /* Print out the digest result */
//     BIO_dump_fp(stdout, outdigest, len);

//     ret = 0;
// // if there are errors in the above process .... ->
// err:
//     /* Clean up all the resources we allocated */
//     OPENSSL_free(outdigest);
//     EVP_MD_free(sha256);
//     EVP_MD_CTX_free(ctx);
//     if (ret != 0)
//     {
//         ERR_print_errors_fp(stderr);
//     }
//     return ret;
// }

// docs: https://www.openssl.org/docs/man3.0/man7/crypto.html\
// https://www.openssl.org/docs/manmaster/man7/EVP_KDF-ARGON2.html
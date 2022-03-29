/**
 * Interface of the RSA configuration.
 * The configuration settings are used to generate and
 * use RSA key pairs using the `crypto` libary.
 * 
 * For more details:
 * - https://nodejs.org/api/crypto.html#keyobjectexportoptions
 * - https://nodejs.org/api/crypto.html#crypto_crypto_generatekeypair_type_options_callback
 */
export interface IRsaConfig {
    /**
     * Must be 'rsa', 'rsa-pss', 'dsa', 'ec', 'ed25519', 'ed448', 'x25519', 
     * 'x448', or 'dh'.
     * 
     * Default: `rsa`
     */
    type: string;

    /**
     * Key size in bits (RSA, DSA).
     * 
     * Default: `4096`
     */
    modulusLength: number;

    /** `object` for public key encoding. */
    publicKeyEncoding: {

        /**
         * Must be one of 'pkcs1' (RSA only) or 'spki'.
         * 
         * Default: `spki`
         */
        type: string;

        /**
         * Must be 'pem', 'der', or 'jwk'.
         * 
         * Default: `pem`
         */
        format: string;

    };

    /** `object` for private key encoding. */
    privateKeyEncoding: {

        /**
         * Must be one of 'pkcs1' (RSA only), 'pkcs8' or 'sec1' (EC only).
         * 
         * Default: `pkcs8`
         */
        type: string;

        /**
         * Must be 'pem', 'der', or 'jwk'.
         * 
         * Default: `pem`
         */
        format: string;

        /**
         * If specified, the private key will be encrypted with the given cipher 
         * and passphrase using PKCS#5 v2.0 password based encryption.
         * 
         * Default: `aes-256-cbc`
         */
        cipher: string;

        /**
         * The passphrase to use for encryption, see cipher.
         * 
         * The value of this property is provided by the
         * `.env` file.
         * 
         * Default: `notSet`
         */
        passphrase: string | Buffer;

    };

    /**
     * Path to the location the private and public key of the server is stored.
     * 
     * The value of this property is provided by the
     * `.env` file.
     * 
     * Default: `${baseDir}/.keys`
     */
    keyPath: string;
}
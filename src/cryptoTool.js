/**
 * Created by ikonovalov on 22/06/17.
 */

const crypto = require('crypto');
const multihash = require('multihashes');
const BN = require('bn.js');

const EC = require('elliptic').ec;
const ELLIPTIC_CURVE = 'secp256k1';
const ec = new EC(ELLIPTIC_CURVE);

const buf2arr = (buf) => {
    return Buffer.isBuffer(buf) ? buf.toJSON().data : buf;
};

class Crypto {

    constructor() { }

    createDecipher(secretKey, options) {
        const algorithm = options.algorithm;
        const iv = options.iv;
        return {
            decipher: crypto.createDecipheriv(algorithm, secretKey, iv),
            iv: iv,
            algorithm: algorithm
        };
    }

    decryptStream(sourceStream, destinationStream, secretKey, options = {}, callback) {
        try {
            const decipherIv = this.createDecipher(secretKey, options);
            sourceStream.pipe(decipherIv.decipher).pipe(destinationStream);
            destinationStream.on('finish', () => callback(null, 'finish'));
            destinationStream.on('error', e => callback(e, null))
        } catch (e) {
            callback(e, null)
        }
    }

    /**
     *
     * @param tag - full tag json object (not string!).
     * @param providedPublicKey key format is 0x04.....
     * @param callback
     */
    verifyByTag(tag, providedPublicKey, callback) {
        try {
            let keyBuffer = Buffer.from(providedPublicKey.slice(2), 'hex').toJSON().data;
            let signature = {
                r: new BN(tag.signature.r, 16),
                s: new BN(tag.signature.s, 16),
                recoveryParam: tag.signature.v
            };
            let hashArray = buf2arr(multihash.fromB58String(tag.ipfs));
            let truncatedQmHash = hashArray.slice(2);

            let signatureValidation = this.verify(signature, truncatedQmHash, keyBuffer);

            callback(null, signatureValidation);

        } catch (e) {
            callback(e, null);
        }
    }

    verify(signature, message, pub) {
        const key = ec.keyFromPublic(pub);
        return key.verify(message, signature);
    }
}

module.exports = new Crypto();
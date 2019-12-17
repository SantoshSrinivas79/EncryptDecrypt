// credit: [Stronger Encryption and Decryption in Node.js](https://gist.github.com/vlucas/2bd40f62d20c1d49237a109d491974eb)
// [vidanov/crypto-simple: The easiest way to keep your sensitive information safe encrypted in your NodeJS apps.](https://github.com/vidanov/crypto-simple)

const crypto = require('crypto')
const fetch = require("node-fetch");

async function encrypt(text, key) {
    try {
        const IV_LENGTH = 16 // For AES, this is always 16
        let iv = crypto.randomBytes(IV_LENGTH)
        let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv)
        let encrypted = cipher.update(text)

        encrypted = Buffer.concat([encrypted, cipher.final()])

        return iv.toString('hex') + ':' + encrypted.toString('hex')
    } catch (err) {
        throw err
    }
}

async function decrypt(text, key) {
    try {
        let textParts = text.split(':')
        let iv = Buffer.from(textParts.shift(), 'hex')
        let encryptedText = Buffer.from(textParts.join(':'), 'hex')
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv)
        let decrypted = decipher.update(encryptedText)

        decrypted = Buffer.concat([decrypted, decipher.final()])

        return decrypted.toString()
    } catch (err) {
        throw err
    }
}


(async () => {
    // credit: https://humanwhocodes.com/snippets/2019/01/nodejs-medium-api-fetch/
    // construct the URL to post to a publication
    const MEDIUM_POST_URL = `https://xeon.santoshsrinivas.com/api/kvs/PJ4JS2xitWZ9DnsMo`;

    const response = await fetch(MEDIUM_POST_URL);
    const messageData = await response.json();

    // the API frequently returns 201
    if ((response.status !== 200) && (response.status !== 201)) {
        console.error(`Invalid response status ${ response.status }.`);
        throw messageData;
    }

    console.log(messageData.data.value);

    var password = JSON.stringify(messageData);
    var key = "YFpoGQ@$VrUMf64tZ9eg^RiaQSZ^Pw%*"

    var encrypted = await encrypt(password, key)
    var decrypted = await decrypt(encrypted, key)

    console.log('Original: ' + password)
    console.log('Encrypted: ' + encrypted)
    console.log('Decrypted: ' + decrypted)
})();
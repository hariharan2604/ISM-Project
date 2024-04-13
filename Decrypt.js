var CryptoJS = require("crypto-js");

var esp8266_msg = 'z6PyIanyaXhyQfs3pOA2dvPkvkNXq0Nc7hX1kVz8DDQp+Fh61gFmhEVLvlssgKnU3AVFMPgp8ca2rwpnS8EPhORLL1r34wlAawYxAM4hpqcUtTMJx3OjITAar5z8qG03';
var esp8266_iv = 'AAAAAAAAAAAAAAAAAAAAAA==';

// The AES encryption/decryption key to be used.
var AESKey = '2B7E151628AED2A6ABF7158809CF4F3C';

var plain_iv = Buffer.from(esp8266_iv, 'base64').toString('hex');
var iv = CryptoJS.enc.Hex.parse(plain_iv);
var key = CryptoJS.enc.Hex.parse(AESKey);

console.log("Let's ");

// Decrypt
var bytes = CryptoJS.AES.decrypt(esp8266_msg, key, { iv: iv });
var plaintext = bytes.toString(CryptoJS.enc.Base64);
var decoded_b64msg = Buffer.from(plaintext, 'base64').toString('ascii');
var decoded_msg = Buffer.from(decoded_b64msg, 'base64').toString('ascii');

console.log("Decryptedage: ", JSON.parse(decoded_msg));

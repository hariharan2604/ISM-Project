const crypto = require("crypto");
const fs = require("fs");

const keygeneration = async (ip) => {
  console.log("key");
  const { publicKey, privateKey } = await crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });

  await fs.writeFileSync("key_authority/key/" + ip + "private.pem", privateKey);
  await fs.writeFileSync("key_authority/key/" + ip + "public.pem", publicKey);
};

function keydeletion(ip) {
  const filePathprivate = "key/" + ip + "private.pem";
  const filePathpublic = "key/" + ip + "public.pem";
  deletefile(filePathprivate);
  deletefile(filePathpublic);
}

function deletefile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file "${filePath}": ${err.message}`);
    } else {
      console.log(`"${filePath}" deleted successfully.`);
    }
  });
}

function createfile(filePath) {
  fs.writeFileSync(filePath);
}

module.exports = { keygeneration, keydeletion };

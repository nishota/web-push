import pkg from 'web-push';
const { generateVAPIDKeys } = pkg;

const vapidKeys = generateVAPIDKeys();

console.log("public key");
console.log(vapidKeys.publicKey);
console.log("private key");
console.log(vapidKeys.privateKey);

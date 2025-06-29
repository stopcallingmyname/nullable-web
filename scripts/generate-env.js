const fs = require('fs');
const path = require('path');

const envPath = path.resolve(
  __dirname,
  '../src/environments/environment.prod.ts'
);

const content = `export const environment = {
  production: true,
  nullableApiUrl: '${process.env.nullableApiUrl}',
  uploadcarePublicKey: '${process.env.uploadcarePublicKey}',
  uploadcareSecretKey: '${process.env.uploadcareSecretKey}',
  uploadcareBaseUrl: '${process.env.uploadcareBaseUrl}',
  googleClientId: '${process.env.googleClientId}',
};
`;

fs.writeFileSync(envPath, content);
console.log('--- GENERATED environment.prod.ts ---');

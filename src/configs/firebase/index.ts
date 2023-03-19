import admin from 'firebase-admin';
import * as firebaseServiceAccount from './secret-key.json';

const config = {
  type: firebaseServiceAccount.type,
  projectId: firebaseServiceAccount.project_id,
  privateKeyId: firebaseServiceAccount.private_key_id,
  privateKey: firebaseServiceAccount.private_key,
  clientEmail: firebaseServiceAccount.client_email,
  clientId: firebaseServiceAccount.client_id,
  authUri: firebaseServiceAccount.auth_uri,
  tokenUri: firebaseServiceAccount.token_uri,
  authProviderX509CertUrl: firebaseServiceAccount.auth_provider_x509_cert_url,
  clientC509CertUrl: firebaseServiceAccount.client_x509_cert_url,
};

const initializeFirebaseSDK = () => {
  admin.initializeApp({
    credential: admin.credential.cert(config),
  });
};

export default initializeFirebaseSDK;

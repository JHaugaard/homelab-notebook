/**
 * Configure CORS for Tigris bucket
 * Run with: node --env-file=.env.local scripts/configure-cors.mjs
 */

import { S3Client, PutBucketCorsCommand } from '@aws-sdk/client-s3';

// Use the production Tigris endpoint (fly.storage.tigris.dev)
// Your .env.local may have t3.storage.dev which is a different endpoint
const endpoint = process.env.AWS_ENDPOINT_URL_S3 || 'https://fly.storage.tigris.dev';
console.log('Using endpoint:', endpoint);
console.log('Bucket:', process.env.BUCKET_NAME);

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'auto',
  endpoint: endpoint,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const corsConfig = {
  Bucket: process.env.BUCKET_NAME,
  CORSConfiguration: {
    CORSRules: [
      {
        AllowedHeaders: ['*'],
        AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
        AllowedOrigins: [
          'https://homelab-notebook.fly.dev',
          'https://homelab-notebook.haugaard.app',
          'http://localhost:5173',
          'http://localhost:4173'
        ],
        ExposeHeaders: ['ETag'],
        MaxAgeSeconds: 3600
      }
    ]
  }
};

async function configureCors() {
  try {
    await s3Client.send(new PutBucketCorsCommand(corsConfig));
    console.log('CORS configuration applied successfully!');
    console.log('Allowed origins:', corsConfig.CORSConfiguration.CORSRules[0].AllowedOrigins);
  } catch (error) {
    console.error('Failed to configure CORS:', error);
    process.exit(1);
  }
}

configureCors();

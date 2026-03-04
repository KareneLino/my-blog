import path from 'node:path';
import dotenv from 'dotenv';

export type ScriptEnv = {
  mongoUri: string;
  dbName: string;
  adminUsername?: string | undefined;
  adminPassword?: string | undefined;
};

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env variable: ${name}`);
  }
  return value;
}

function optional(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

// Check if authentication should be enabled
// Default: true (security first!)
function isAuthEnabled(): boolean {
  const authEnabled = process.env.MONGO_AUTH_ENABLED?.toLowerCase();
  return authEnabled !== 'false' && authEnabled !== '0';
}

// Build MongoDB connection URI
// SECURITY: Authentication is REQUIRED by default
function buildMongoUri(dbName: string): string {
  const host = optional('MONGO_HOST', '127.0.0.1');
  const port = optional('MONGO_PORT', '27017');

  const username = process.env.MONGO_USERNAME?.trim() || '';
  const password = process.env.MONGO_PASSWORD?.trim() || '';

  const authEnabled = isAuthEnabled();

  // Security check: auth is required by default
  if (authEnabled) {
    if (!username) {
      throw new Error(
        `MONGO_USERNAME is required for security reasons.\n` +
        `Set MONGO_USERNAME and MONGO_PASSWORD in your .env file.\n` +
        `If you MUST disable authentication (not recommended), set MONGO_AUTH_ENABLED=false`
      );
    }
    if (!password) {
      throw new Error(
        `MONGO_PASSWORD is required when MONGO_USERNAME is set.\n` +
        `Set MONGO_PASSWORD in your .env file.`
      );
    }

    // Authenticated mode
    const authSource = process.env.MONGO_AUTH_SOURCE || dbName;
    return `mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=${authSource}`;
  }

  // Unauthenticated mode (explicitly disabled via MONGO_AUTH_ENABLED=false)
  console.warn('⚠️  WARNING: MongoDB authentication is DISABLED. This is insecure and should only be used in isolated environments.');
  return `mongodb://${host}:${port}/${dbName}`;
}

export function loadScriptEnv(): ScriptEnv {
  const envPath = path.resolve(__dirname, '../../.env');
  dotenv.config({ path: envPath });

  const adminUsername = process.env.ADMIN_USERNAME?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD;

  const mongoUriFromEnv = process.env.MONGO_URI;
  if (mongoUriFromEnv) {
    const dbName = process.env.MONGO_DBNAME ?? '(from URI)';
    return { mongoUri: mongoUriFromEnv, dbName, adminUsername, adminPassword };
  }

  const dbName = required('MONGO_DBNAME');
  const mongoUri = buildMongoUri(dbName);

  return { mongoUri, dbName, adminUsername, adminPassword };
}

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../config/database.js';
import Admin from '../models/Admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: path.join(__dirname, '..', envFile) });

const ADMIN_EMAIL = 'watches@gmail.com';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_NAME = 'Watches Admin';
const ADMIN_ROLE = 'super_admin';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

const main = async () => {
  await connectDB();

  let admin = await Admin.findOne({ email: ADMIN_EMAIL });
  if (admin) {
    console.log(`Admin user already exists. Updating password and role for ${ADMIN_EMAIL}`);
    admin.password = ADMIN_PASSWORD;
    admin.name = ADMIN_NAME;
    admin.role = ADMIN_ROLE;
    await admin.save();
  } else {
    console.log(`Creating admin user ${ADMIN_EMAIL}`);
    admin = new Admin({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, name: ADMIN_NAME, role: ADMIN_ROLE });
    await admin.save();
  }

  console.log('Admin user inserted/updated successfully. Testing login...');

  const controller = new AbortController();
  const loginTimeout = 10000;
  const timeoutId = setTimeout(() => controller.abort(), loginTimeout);

  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/admins/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const result = await response.json();
    if (!response.ok) {
      console.error('Login test failed:', result);
      process.exit(1);
    }

    console.log('Login test succeeded. Token received:');
    console.log(result.token);
    process.exit(0);
  } catch (error) {
    console.error('Failed to test login. Is the backend server running at', BACKEND_URL, '?');
    console.error(error);
    process.exit(1);
  }
};

main();

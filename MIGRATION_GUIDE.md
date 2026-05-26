# Luxury Watches E-commerce Platform - MERN Migration Complete

## Overview
Successfully migrated from Supabase backend architecture to a production-grade MERN stack (MongoDB, Express.js, Node.js, Mongoose) while preserving the entire frontend UI/UX exactly as-is.

## Architecture Changes

### Backend (NEW - MERN)
- **Database**: MongoDB Atlas (cloud)
- **Server**: Express.js with Node.js
- **ORM**: Mongoose
- **Authentication**: JWT with bcrypt password hashing
- **Real-time**: Socket.io for live chat
- **File Uploads**: Multer for product/brand image management
- **API Style**: RESTful with clean routes

### Frontend (UNCHANGED)
- All pages, components, styling, animations, and UI/UX remain identical
- Only API integration points have been updated

## Project Structure

```
watches/
├── backend/
│   ├── config/
│   │   └── database.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Admin authentication & management
│   │   ├── productController.js     # Product CRUD & search
│   │   ├── orderController.js       # Order management
│   │   ├── collectionController.js  # Brands/collections
│   │   └── settingsController.js    # Shop settings
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification
│   │   ├── upload.js                # Multer configuration
│   │   └── errorHandler.js          # Error handling
│   ├── models/
│   │   ├── Product.js
│   │   ├── Collection.js
│   │   ├── Order.js
│   │   ├── OrderItem.js
│   │   ├── Customer.js
│   │   ├── ChatMessage.js
│   │   ├── Settings.js
│   │   └── Admin.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── collectionRoutes.js
│   │   ├── settingsRoutes.js
│   │   └── chatRoutes.js
│   ├── sockets/
│   │   └── chatSocket.js            # Socket.io for real-time chat
│   ├── uploads/                     # Local image storage
│   │   ├── products/
│   │   └── brands/
│   ├── package.json
│   ├── .env
│   └── server.js                    # Main Express server
│
├── src/
│   ├── lib/
│   │   ├── api.ts                   # MERN API client (NEW)
│   │   └── supabase.ts              # (REMOVED - no longer used)
│   ├── pages/
│   │   ├── Home.tsx                 # (UPDATED - uses new API)
│   │   ├── Shop.tsx                 # (UPDATED - uses new API)
│   │   ├── ProductDetail.tsx        # (UPDATED - uses new API)
│   │   ├── Checkout.tsx             # (UPDATED - uses new API)
│   │   └── Admin.tsx                # (UPDATED - uses new API)
│   ├── components/
│   │   └── LiveChat.tsx             # (UPDATED - uses new API)
│   └── ... (all other files unchanged)
│
└── .env.local                       # Frontend env config
```

## Setup Instructions

### 1. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment (.env)
The `.env` file is already pre-configured with:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://clinirt_db_user:LaoJ55xzBMzUaU0P@cluster0.5qr0ban.mongodb.net/?appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_change_in_production_12345
JWT_EXPIRY=7d
FRONTEND_URL=http://localhost:5173
MAX_UPLOAD_SIZE=10485760
UPLOAD_DIR=./uploads
```

⚠️ **IMPORTANT**: Change `JWT_SECRET` in production before deploying!

#### Start Backend Server
```bash
npm start          # Production mode
# OR
npm run dev        # Development with hot reload (requires nodemon)
```

The backend will be available at `http://localhost:5000`

### 2. Frontend Setup

#### Configure Frontend Environment
Frontend API endpoint is configured in `.env.local`:
```
VITE_API_URL=http://localhost:5000/api
```

#### Start Frontend
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173` (or your configured port)

### 3. Create Admin User

Admin users must be created through the API. Use the following curl command:

```bash
curl -X POST http://localhost:5000/api/auth/admins/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"yourPassword123"}'
```

Then, to create new admins, log in through the admin panel at `/admin` with your email/password, navigate to the "Admins" section, and add new admin users.

## API Endpoints

### Authentication
- `POST /api/auth/admins/login` - Admin login (returns JWT token)
- `GET /api/auth/admins` - Get all admins (protected)
- `POST /api/auth/admins` - Create new admin (protected)
- `DELETE /api/auth/admins/:id` - Delete admin (protected)
- `PUT /api/auth/admins/:id` - Update admin (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/by-handle/:handle` - Get product by URL handle
- `GET /api/products/search?q=...` - Search products
- `POST /api/products` - Create product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)

### Orders
- `GET /api/orders` - Get all orders (protected)
- `GET /api/orders/:id` - Get specific order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status (protected)
- `DELETE /api/orders/:id` - Delete order (protected)
- `GET /api/orders/stats/dashboard` - Dashboard statistics (protected)

### Collections (Brands)
- `GET /api/collections` - Get all visible collections
- `GET /api/collections/:handle` - Get collection by handle
- `POST /api/collections` - Create collection (protected)
- `PUT /api/collections/:id` - Update collection (protected)
- `DELETE /api/collections/:id` - Delete collection (protected)

### Settings
- `GET /api/settings` - Get shop settings
- `PUT /api/settings` - Update settings (protected)

### Chat
- `GET /api/chat` - Get all messages (protected)
- `GET /api/chat/session/:sessionId` - Get messages for session
- `POST /api/chat` - Send message

### Static Files
- `GET /uploads/products/*` - Product images
- `GET /uploads/brands/*` - Brand images

## Key Changes from Supabase

### 1. Authentication
**Before (Supabase)**:
```typescript
if (password === 'admin123' || password === 'luxury2024') {
  localStorage.setItem('ows_admin_session', 'true');
}
```

**After (MERN with JWT)**:
```typescript
const response = await authApi.login(email, password);
localStorage.setItem('admin_token', response.token);
```

✅ **Improvement**: Proper email+password authentication with JWT tokens

### 2. Image Uploads
**Before**: Supabase Storage (cloud)
**After**: Multer local uploads to `/backend/uploads/`

✅ **Improvement**: No cloud storage costs, full control over files

### 3. Real-time Chat
**Before**: Supabase Realtime (channel-based)
**After**: Socket.io + polling fallback

✅ **Improvement**: More control, works with any hosting, fallback for polling

### 4. Database
**Before**: Supabase PostgreSQL
**After**: MongoDB Atlas

✅ **Improvement**: Better for flexible schema, easier horizontal scaling

## Features Preserved (Frontend UI)

✅ Hero slider with animations
✅ Product grid with search/filter
✅ Product detail pages with specifications
✅ Shopping cart with currency conversion
✅ Checkout with multiple payment methods
✅ Admin dashboard with statistics
✅ Product management (add/edit/delete)
✅ Order management with status tracking
✅ Live chat with real-time messaging
✅ Shop settings management
✅ Responsive mobile/tablet/desktop design
✅ All animations and transitions

## Database Models

### Product
```javascript
{
  _id: ObjectId,
  name: String,
  handle: String (unique, URL slug),
  vendor: String (brand name),
  product_type: String (category),
  price: Number (in cents),
  images: [String],
  description: String,
  tags: [String],
  metadata: Object (specifications),
  inventory_qty: Number,
  status: "active|draft|archived",
  sku: String,
  created_at: Date,
  updated_at: Date
}
```

### Order
```javascript
{
  _id: ObjectId,
  customer_id: ObjectId (reference),
  status: "pending|paid|shipped|delivered|cancelled|refunded",
  subtotal: Number,
  tax: Number,
  shipping: Number,
  total: Number,
  shipping_address: {
    name, line1, city, state, postal_code, country, phone, email
  },
  notes: String,
  created_at: Date,
  updated_at: Date
}
```

### Admin
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (bcrypt hashed),
  name: String,
  role: "admin|super_admin",
  created_at: Date,
  updated_at: Date
}
```

## Deployment Checklist

- [ ] Change `JWT_SECRET` in backend `.env`
- [ ] Update `FRONTEND_URL` in backend `.env`
- [ ] Update `VITE_API_URL` in frontend `.env.local`
- [ ] Ensure MongoDB Atlas credentials are correct
- [ ] Set `NODE_ENV=production` in backend
- [ ] Test all features before going live
- [ ] Set up SSL/HTTPS for production
- [ ] Configure proper CORS settings
- [ ] Set up backups for uploads folder
- [ ] Monitor server logs

## Troubleshooting

### Backend Won't Start
1. Check MongoDB connection: Ensure MongoDB Atlas cluster is active
2. Check port: Ensure port 5000 is not in use
3. Check `.env`: Ensure all required variables are set
4. Check dependencies: Run `npm install` again

### Frontend Can't Connect to Backend
1. Check API URL: Ensure `VITE_API_URL` matches backend address
2. Check CORS: Ensure backend has correct `FRONTEND_URL`
3. Check network: Ensure both services are running
4. Check logs: Check browser console and backend logs

### Images Not Displaying
1. Check file permissions: Ensure uploads folder has read permissions
2. Check paths: Verify images are saved in correct location
3. Check URL: Ensure static serving is configured correctly
4. Check logs: Check server logs for errors

## Next Steps

1. **Migrate existing data**: If you have existing Supabase data, export it and import to MongoDB
2. **Test thoroughly**: Test all features on different devices/browsers
3. **Set up monitoring**: Implement server monitoring and error tracking
4. **Configure backups**: Set up automated MongoDB backups
5. **Deploy to production**: Choose hosting (Heroku, DigitalOcean, AWS, etc.)

## Support

For issues or questions about the migration, check:
- Backend logs: Available when running `npm start`
- Frontend console: Browser dev tools (F12)
- API responses: Network tab in browser dev tools
- Database: MongoDB Atlas dashboard

---

**Migration Date**: May 21, 2026
**Status**: ✅ Complete
**Frontend UI**: ✅ Unchanged
**Backend Architecture**: ✅ Production-Ready

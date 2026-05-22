# Quick Reference Card - MERN Migration

## Live URLs
- **Frontend**: http://localhost:8081
- **Backend API**: http://localhost:5000/api
- **Backend Health**: http://localhost:5000/api/health

## Terminal Commands

### Backend
```bash
cd backend
npm install          # Install dependencies (if needed)
npm start            # Start production server
npm run dev          # Start dev server with nodemon
```

### Frontend
```bash
npm install          # Install dependencies (if needed)
npm run dev          # Start Vite dev server
npm run build        # Build for production
```

## Important Files

```
/backend/.env                      # Backend configuration
/.env.local                        # Frontend API URL config
/src/lib/api.ts                    # API client (use this everywhere)
/backend/models/                   # Database schemas
/backend/routes/                   # API endpoints
/backend/controllers/              # Business logic
```

## Common API Calls

### Get Products
```typescript
import { productsApi } from '@/lib/api';

const products = await productsApi.getAll();
const product = await productsApi.getByHandle('rolex-submariner');
const results = await productsApi.search('rolex');
```

### Manage Orders
```typescript
import { ordersApi } from '@/lib/api';

const orders = await ordersApi.getAll();  // Protected
const order = await ordersApi.create(orderData);
await ordersApi.updateStatus(id, 'shipped');  // Protected
const stats = await ordersApi.getDashboardStats();  // Protected
```

### Admin Authentication
```typescript
import { authApi } from '@/lib/api';

// Login
const response = await authApi.login('admin@example.com', 'password');
localStorage.setItem('admin_token', response.token);

// Get current token
const token = localStorage.getItem('admin_token');
```

### Chat
```typescript
import { chatApi } from '@/lib/api';

const messages = await chatApi.getBySession('session-id');
await chatApi.send('session-id', 'customer', 'Hello');
```

## Data Models

### Product
```javascript
{
  _id: ObjectId,
  name: String,
  handle: String (URL slug),
  vendor: String (brand),
  price: Number (cents),
  images: [String],
  description: String,
  metadata: Object,
  status: "active|draft|archived",
  inventory_qty: Number
}
```

### Order
```javascript
{
  _id: ObjectId,
  customer_id: ObjectId,
  status: String,
  subtotal: Number,
  tax: Number,
  shipping: Number,
  total: Number,
  shipping_address: Object,
  items: [{product_id, quantity, unit_price, total}]
}
```

### Admin
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (bcrypt),
  name: String,
  role: "admin|super_admin"
}
```

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net
JWT_SECRET=your_secret_key
JWT_EXPIRY=7d
FRONTEND_URL=http://localhost:8081
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE=10485760
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
VITE_FRONTEND_URL=http://localhost:8081
```

## Protected Routes (Require JWT)

Add to header:
```typescript
Authorization: Bearer <token_from_localStorage>
```

Protected endpoints:
- `GET /api/auth/admins` - Get all admins
- `POST /api/auth/admins` - Create admin
- `PUT /api/auth/admins/:id` - Update admin
- `DELETE /api/auth/admins/:id` - Delete admin
- `GET /api/orders` - List orders
- `PUT /api/orders/:id/status` - Update order status
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/orders/stats/dashboard` - Dashboard stats
- Plus all admin routes

## Testing Checklist

- [ ] Home page loads products
- [ ] Shop search works
- [ ] ProductDetail loads
- [ ] Add to cart works
- [ ] Checkout loads settings
- [ ] Order creation succeeds
- [ ] Admin login works
- [ ] Chat sends messages
- [ ] Mobile layout responsive

## Debugging

### Browser Console (F12)
```javascript
// Check token
localStorage.getItem('admin_token')

// Check chat session
localStorage.getItem('chat_session_id')

// Check API calls
// Go to Network tab to see requests to /api/*
```

### Backend Logs
Look for:
- "MongoDB connected successfully"
- "Server running on port 5000"
- Error stack traces for API failures

## Key Differences from Supabase

| Feature | Supabase | MERN |
|---------|----------|------|
| Auth | Password only | Email + JWT |
| Database | PostgreSQL | MongoDB |
| Chat | Channels | Polling + Socket.io |
| Storage | Supabase bucket | Local /uploads |
| API | Pre-built | Custom Express |

## Common Issues

**"API calls failing"**
- Check backend running: `npm start` in /backend
- Check API URL in .env.local correct
- Check CORS in backend .env matches frontend URL

**"Supabase errors in console"**
- Verify /src/lib/api.ts is imported instead of supabase
- Check all Supabase imports removed from components
- Restart frontend dev server

**"Product images not showing"**
- Check /backend/uploads/ folder exists
- Verify images stored in /uploads/products/
- Check browser Network tab for image 404s

**"Admin login fails"**
- Verify admin exists in MongoDB
- Check JWT_SECRET in backend .env
- Clear localStorage and try again

## File Locations

```
watches/
├── backend/
│   ├── server.js
│   ├── .env
│   ├── package.json
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   └── uploads/
├── src/
│   ├── lib/api.ts (USE THIS)
│   ├── pages/
│   ├── components/
│   └── contexts/
├── .env.local
├── MIGRATION_COMPLETE.md (This file)
├── MIGRATION_GUIDE.md
└── TESTING_GUIDE.md
```

## Helpful Commands

```bash
# Check if port is in use
netstat -ano | findstr :5000

# Kill process on port 5000 (Windows)
for /f "tokens=5" %a in ('netstat -ano ^| findstr :5000') do taskkill /pid %a /f

# View MongoDB collections
# Use MongoDB Compass or Atlas web interface

# Test API endpoint
Invoke-WebRequest -Uri http://localhost:5000/api/health

# View file uploads
ls backend/uploads/products/
```

## Production Checklist

- [ ] Change JWT_SECRET to random string
- [ ] Set NODE_ENV=production
- [ ] Update FRONTEND_URL for CORS
- [ ] Update VITE_API_URL for production domain
- [ ] Configure MongoDB Atlas IP whitelist
- [ ] Set up SSL certificate
- [ ] Enable backups
- [ ] Test all features
- [ ] Monitor error logs
- [ ] Plan scaling strategy

---

**Status**: ✅ Ready for Testing & Deployment
**Last Updated**: May 21, 2026

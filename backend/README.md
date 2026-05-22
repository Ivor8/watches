# MERN Backend - Watches E-commerce Platform

Complete production-ready Express.js backend for luxury watches e-commerce platform using MongoDB, JWT authentication, and Multer image uploads.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Edit `.env` file with your settings:
```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://nirttech_db_user:wotW6TPWRyN5O0vj@cluster0.jvesyel.mongodb.net/?appName=Cluster0
JWT_SECRET=change_me_in_production
JWT_EXPIRY=7d
FRONTEND_URL=http://localhost:5173
```

### 3. Start Server
```bash
npm start          # Production
npm run dev        # Development (with hot reload)
```

Server runs at `http://localhost:5000`

## API Documentation

### Authentication

**Login**
```
POST /api/auth/admins/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "yourPassword"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "admin": {
    "id": "...",
    "email": "admin@example.com",
    "name": "Admin Name",
    "role": "admin"
  }
}
```

All protected routes require:
```
Authorization: Bearer <token>
```

### Products

**Get All Products**
```
GET /api/products
```

**Get Product by Handle**
```
GET /api/products/by-handle/rolex-submariner
```

**Search Products**
```
GET /api/products/search?q=rolex&vendor=Rolex&priceMax=50000
```

**Create Product** (protected)
```
POST /api/products
Authorization: Bearer <token>
Content-Type: multipart/form-data

name: "Rolex Submariner"
handle: "rolex-submariner"
vendor: "Rolex"
product_type: "Luxury Watch"
price: 1200000 (in cents)
description: "..."
tags: "bestseller,sale"
inventory_qty: 5
images: (file upload)
```

**Update Product** (protected)
```
PUT /api/products/:id
Authorization: Bearer <token>
(same as create)
```

**Delete Product** (protected)
```
DELETE /api/products/:id
Authorization: Bearer <token>
```

### Orders

**Get All Orders** (protected)
```
GET /api/orders
Authorization: Bearer <token>
```

**Create Order**
```
POST /api/orders
Content-Type: application/json

{
  "status": "pending",
  "subtotal": 120000,
  "tax": 0,
  "shipping": 5000,
  "total": 125000,
  "shipping_address": {
    "name": "John Doe",
    "line1": "123 Main St",
    "city": "Los Angeles",
    "state": "CA",
    "postal_code": "90001",
    "country": "USA",
    "phone": "+1 (555) 123-4567",
    "email": "john@example.com"
  },
  "items": [
    {
      "product_id": "...",
      "quantity": 1,
      "unit_price": 120000,
      "total": 120000
    }
  ]
}
```

**Update Order Status** (protected)
```
PUT /api/orders/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "shipped"
}
```

### Settings

**Get Settings**
```
GET /api/settings
```

**Update Settings** (protected)
```
PUT /api/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "shop_name": "Original Watches",
  "whatsapp": "+1 (541) 780-8979",
  "email": "sales@originalwatches.shop",
  "telegram_url": "https://t.me/...",
  "shipping_fee": 5000,
  "promo_text": "Free shipping on orders over $500"
}
```

### Chat

**Get All Messages** (protected)
```
GET /api/chat
Authorization: Bearer <token>
```

**Get Session Messages**
```
GET /api/chat/session/s_1234567_abc123
```

**Send Message**
```
POST /api/chat
Content-Type: application/json

{
  "session_id": "s_1234567_abc123",
  "sender": "customer",
  "message": "Hello, I have a question..."
}
```

## File Structure

```
backend/
├── config/
│   └── database.js              # MongoDB connection
├── controllers/
│   ├── authController.js        # Admin auth & management
│   ├── productController.js     # Product CRUD
│   ├── orderController.js       # Order management
│   ├── collectionController.js  # Brand management
│   └── settingsController.js    # Settings
├── middleware/
│   ├── auth.js                  # JWT verification
│   ├── upload.js                # Multer config
│   └── errorHandler.js          # Error handling
├── models/
│   ├── Product.js
│   ├── Collection.js
│   ├── Order.js
│   ├── OrderItem.js
│   ├── Customer.js
│   ├── ChatMessage.js
│   ├── Settings.js
│   └── Admin.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   ├── collectionRoutes.js
│   ├── settingsRoutes.js
│   └── chatRoutes.js
├── sockets/
│   └── chatSocket.js            # Socket.io config
├── uploads/
│   ├── products/                # Product images
│   └── brands/                  # Brand images
├── .env                         # Environment variables
├── package.json
└── server.js                    # Express app
```

## Database

Uses **MongoDB Atlas** (cloud MongoDB)

Connection string configured in `.env`:
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/?appName=Cluster0
```

### Collections
- products
- collections (brands)
- orders
- order_items
- customers
- chat_messages
- settings
- admins

## Image Uploads

Images are stored locally in `/uploads/`:
- `/uploads/products/` - Product images
- `/uploads/brands/` - Brand images

Images are automatically named with UUID to prevent collisions.

Supported formats: JPG, PNG, WEBP
Max size: 10MB per file

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message describing what went wrong"
}
```

Status codes:
- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized (invalid/missing token)
- `404` - Not found
- `500` - Server error

## Security

- ✅ JWT token authentication
- ✅ bcrypt password hashing
- ✅ CORS enabled
- ✅ Multer file validation
- ✅ Protected admin routes
- ✅ MongoDB injection prevention (via Mongoose)

## Production Deployment

1. **Change JWT_SECRET**
   - Generate a strong random string
   - Update in `.env`

2. **Set NODE_ENV**
   ```
   NODE_ENV=production
   ```

3. **Update URLs**
   - FRONTEND_URL for CORS
   - Use HTTPS

4. **MongoDB Setup**
   - Create production cluster
   - Set up backups
   - Configure security groups

5. **File Storage**
   - Consider using cloud storage (S3, etc.)
   - Set up automated backups
   - Ensure proper permissions

6. **Monitoring**
   - Set up error tracking (Sentry, etc.)
   - Monitor MongoDB performance
   - Monitor API response times

## Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB Atlas cluster is running
- Check IP whitelist (allow all or your server IP)
- Verify connection string in `.env`

**Port Already in Use**
- Change PORT in `.env`
- Or kill process: `lsof -ti:5000 | xargs kill -9`

**CORS Error**
- Ensure FRONTEND_URL is correctly set
- Check browser console for exact error
- Verify frontend is making requests correctly

**Upload Errors**
- Check `/uploads/` folder exists and is writable
- Check file size doesn't exceed 10MB
- Check file type is JPG/PNG/WEBP

## Technologies Used

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File uploads
- **Socket.io** - Real-time chat
- **CORS** - Cross-origin requests
- **Node.js** - Runtime

## License

MIT

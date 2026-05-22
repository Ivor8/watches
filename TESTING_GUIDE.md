# MERN Migration - Complete Testing Guide

## Current Status ✅
- **Backend**: Running on http://localhost:5000/api (MongoDB connected)
- **Frontend**: Running on http://localhost:8081 (Vite dev server)
- **API Wrapper**: Complete (`/src/lib/api.ts`)
- **Pages Migrated**: Home, Shop, ProductDetail, Checkout, LiveChat
- **Authentication**: JWT-based admin login
- **Migrations**: ~85% complete

## Testing Checklist

### Phase 1: Backend Health ✅ PASSED
- [x] Backend server starts without errors
- [x] MongoDB connection successful
- [x] Health endpoint responds with 200: `GET /api/health`
- [x] CORS properly configured for frontend URL

### Phase 2: Frontend Connection (NEXT)
- [ ] Frontend loads without console errors
- [ ] API calls use correct base URL
- [ ] No Supabase errors in console
- [ ] LiveChat can initialize session

### Phase 3: Product Pages
- [ ] Home page loads products from API
- [ ] Shop page lists and filters products
- [ ] ProductDetail page loads by handle slug
- [ ] Product images display correctly
- [ ] Search functionality works

### Phase 4: Shopping Flow
- [ ] Add to cart works (using localStorage)
- [ ] Cart drawer displays items
- [ ] Checkout form loads settings from API
- [ ] Order creation succeeds
- [ ] Order confirmation page displays

### Phase 5: Admin Panel
- [ ] Admin login page functional
- [ ] JWT token generated on login
- [ ] Admin token persists in localStorage
- [ ] Admin layout recognizes authenticated user
- [ ] Dashboard loads order statistics
- [ ] Orders management works

### Phase 6: Real-time Features
- [ ] LiveChat opens/closes smoothly
- [ ] Customer can send messages
- [ ] Messages display with correct sender
- [ ] Auto-scroll to latest message works
- [ ] Session ID persists in localStorage

### Phase 7: File Uploads
- [ ] Product image upload works (when available)
- [ ] Images stored in `/backend/uploads/products/`
- [ ] Images accessible via `/uploads/` static route
- [ ] Images display correctly in product pages

### Phase 8: Responsive Design
- [ ] Desktop layout unchanged (>1200px)
- [ ] Tablet layout works (768px-1200px)
- [ ] Mobile layout functional (<768px)
- [ ] All animations smooth
- [ ] Touch interactions work

## Manual Testing Steps

### Test 1: Frontend Loads
```
1. Open http://localhost:8081 in browser
2. Check for console errors (F12)
3. Wait for Home page to load products
4. Verify 3-4 products display
```

### Test 2: Product Search
```
1. Click "Shop" in navigation
2. Wait for product grid to load
3. Try search (e.g., "rolex")
4. Apply filters (price range, brands)
5. Check product count updates
```

### Test 3: Product Detail
```
1. Click on any product card
2. Wait for full product details to load
3. Check product images display
4. Scroll to specifications
5. Verify "Add to Cart" button works
```

### Test 4: Shopping Cart
```
1. Add 2-3 products to cart
2. Click cart icon in header
3. Verify items display with prices
4. Adjust quantities
5. Remove an item
6. Check total updates
```

### Test 5: Checkout
```
1. With items in cart, click "Checkout"
2. Wait for settings to load
3. Fill shipping form
4. Select payment method
5. Click "Place Order"
6. Verify order confirmation page
7. Check if order ID displays
```

### Test 6: Admin Login
```
1. Navigate to /admin
2. Enter email: admin@example.com
3. Enter password: admin123
4. Click Login
5. Should redirect to admin dashboard
6. Verify token in localStorage (console: localStorage.getItem('admin_token'))
```

### Test 7: Admin Dashboard
```
1. After admin login
2. Check dashboard stats load
3. Verify order count displays
4. Check recent orders list
5. Click on an order to view details
```

### Test 8: Live Chat
```
1. Scroll to bottom right (or click floating button)
2. Chat widget should appear
3. Send message from customer
4. Message appears with correct styling
5. Session ID persists after refresh
```

### Test 9: Responsive on Mobile
```
1. Press F12 to open dev tools
2. Click device toggle (mobile view)
3. Test iPhone 12 (390x844)
4. Navigate through pages
5. Verify menu collapses
6. Check touch interactions
```

### Test 10: API Error Handling
```
1. Stop backend server
2. Try to load product page
3. Should show error gracefully
4. Check browser console for API errors
5. Restart backend and retry
```

## API Endpoints to Test

### Public Endpoints (No Auth Required)
```bash
# Get all products
curl http://localhost:5000/api/products

# Get product by handle
curl http://localhost:5000/api/products/by-handle/rolex-submariner

# Search products
curl http://localhost:5000/api/products/search?q=rolex

# Get collections
curl http://localhost:5000/api/collections

# Get settings
curl http://localhost:5000/api/settings

# Get chat by session
curl http://localhost:5000/api/chat/session/test-session-123
```

### Protected Endpoints (Requires JWT Token)
```bash
# Get all orders
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/orders

# Get dashboard stats
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/orders/stats/dashboard

# Get all admins
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/auth/admins
```

### Admin Creation (Bootstrap)
```bash
# Note: First admin should be created via MongoDB directly or API
# For testing, use:
curl -X POST http://localhost:5000/api/auth/admins \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123",
    "name": "Admin User",
    "role": "admin"
  }'
```

## Debugging Tips

### Frontend Console (F12 → Console Tab)
Check for:
- API call errors
- Token issues
- Network failures
- Component errors

### Backend Logs
Running `npm start` in backend folder shows:
- MongoDB connection status
- API requests
- Error stack traces

### Network Inspector (F12 → Network Tab)
Verify:
- API requests going to `http://localhost:5000/api`
- Responses have correct status (200, 201, etc.)
- Authorization headers present on protected routes

### MongoDB Atlas
Check:
- Database "watches_ecommerce"
- Collections populated with data
- No connection errors

## Common Issues & Solutions

### Issue: "TypeError: fetch is not a function"
- **Cause**: Missing API wrapper import
- **Fix**: Ensure `import { productsApi } from '@/lib/api'` at top of file

### Issue: "401 Unauthorized" on protected routes
- **Cause**: Token expired or missing
- **Fix**: Admin needs to log in again to get new token

### Issue: Products not loading on Home page
- **Cause**: Backend not responding or DB empty
- **Fix**: Verify backend running, check `/api/products` endpoint

### Issue: Images not displaying
- **Cause**: Wrong path or file not found
- **Fix**: Check browser Network tab for 404s on image URLs

### Issue: CORS error in browser console
- **Cause**: Frontend URL not in backend CORS whitelist
- **Fix**: Update `FRONTEND_URL` in backend `.env`

## What Changed from Supabase

### Authentication
- **Before**: Hardcoded password check
- **After**: JWT token-based auth with email + password

### Database
- **Before**: Supabase PostgreSQL via REST API
- **After**: MongoDB Atlas via Mongoose ODM

### Real-time Chat
- **Before**: Supabase channels
- **After**: Polling (2-second intervals) with Socket.io ready

### File Uploads
- **Before**: Supabase Storage
- **After**: Multer to local `/backend/uploads/`

## Performance Metrics to Track

- Home page load time (should be <2 seconds)
- Product search response (should be <1 second)
- Admin login (should be <500ms)
- Chat message send (should be <1 second)
- Order creation (should be <2 seconds)

## Next Steps After Testing

1. **All tests pass?**
   - Proceed to production deployment
   - Or fix remaining issues

2. **Admin page incomplete?**
   - Complete AdminDashboard, AdminOrders, AdminProducts
   - Test each admin feature

3. **Need image uploads?**
   - Test product creation with images
   - Verify Multer handling

4. **Deploy to production?**
   - Choose hosting (Heroku, DigitalOcean, AWS, etc.)
   - Set up environment variables
   - Configure MongoDB Atlas security
   - Set up SSL/HTTPS

## Testing Command Summary

```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start frontend
npm run dev

# Terminal 3: Test API endpoints (optional)
# Use curl or Postman to test endpoints above
```

## Success Criteria

✅ **Migration is complete when:**
- All public pages load without Supabase errors
- Product data displays correctly from MongoDB
- Admin can login with JWT token
- Chat messages are sent and received
- Order creation works end-to-end
- All responsive breakpoints work
- No console errors on any page
- Image uploads function (if implemented)

---

**Start Testing**: Open http://localhost:8081 in your browser and work through the checklist above!

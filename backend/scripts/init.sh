#!/bin/bash
# Initialize backend with sample admin user
curl -X POST http://localhost:5000/api/auth/admins/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@originalwatches.shop","password":"admin123"}'

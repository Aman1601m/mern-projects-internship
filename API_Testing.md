# Authentication API Testing

## Register User
POST /api/auth/register
{
  "username": "santhosh",
  "email": "test@gmail.com",
  "password": "123456"
}

## Login User
POST /api/auth/login
{
  "email": "test@gmail.com",
  "password": "123456"
}

## Get Profile
GET /api/auth/profile
Headers:
Authorization: Bearer <token>
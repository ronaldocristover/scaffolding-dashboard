# Scaffolding Landing API Documentation

## Overview

This API provides endpoints for managing content for the Scaffolding Engineering Limited landing page. The API is split into two main sections:

- **Portal API**: Public read-only endpoints for displaying content on the landing page
- **Admin API**: Full CRUD operations for content management (admin panel)

**Base URL**: `http://localhost:8888`

## General Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```

### Validation Error Response (Admin Only)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Name is required"
    }
  ]
}
```

---

## Portal API (Public Endpoints)

These endpoints are read-only and used for displaying content on the landing page.

### Health Check

**GET** `/health`

Check if the API is running.

**Response Sample:**

```json
{
  "status": "OK",
  "service": "scaffolding-unified-api",
  "timestamp": "2025-10-26T04:40:33.593Z"
}
```

---

### Company Information

**GET** `/companyInfo`

Get the latest company information for the landing page header.

**Response Sample:**

```json
{
  "success": true,
  "data": {
    "logo": "/logo.png",
    "name": "Scaffolding Engineering Limited",
    "title": "利高棚業工程有限公司｜康師傅搭棚公司",
    "subtitle": "康師傅搭棚公司"
  }
}
```

---

### Banner

**GET** `/banner`

Get the latest banner content for the landing page hero section.

**Response Sample:**

```json
{
  "success": true,
  "data": {
    "title": "Professional Scaffolding Services",
    "subtitle": "Safe, Reliable, and Efficient Solutions",
    "content": "We provide comprehensive scaffolding solutions for construction projects of all sizes.",
    "images": ["/images/banner1.jpg", "/images/banner2.jpg"]
  }
}
```

---

### About Company

**GET** `/about-company`

Get the latest company description and information.

**Response Sample:**

```json
{
  "success": true,
  "data": {
    "title": "About Scaffolding Engineering Limited",
    "subtitle": "Your Trusted Scaffolding Partner Since 2010",
    "content": "With over a decade of experience in the scaffolding industry, we have established ourselves as a leading provider of safe and reliable scaffolding solutions in Hong Kong.",
    "images": {
      "main": "/images/about-main.jpg",
      "gallery": ["/images/gallery1.jpg", "/images/gallery2.jpg"]
    }
  }
}
```

---

### Quote Price

**GET** `/quote-price`

Get pricing information and quote request details.

**Response Sample:**

```json
{
  "success": true,
  "data": {
    "title": "Get a Quote",
    "subtitle": "Competitive Pricing for Quality Scaffolding Services",
    "content": [
      {
        "service": "Basic Scaffolding",
        "price": "Starting from HK$500/day",
        "description": "Standard scaffolding setup for residential projects"
      },
      {
        "service": "Commercial Scaffolding",
        "price": "Starting from HK$1,200/day",
        "description": "Heavy-duty scaffolding for commercial buildings"
      },
      {
        "service": "Custom Solutions",
        "price": "Contact for quote",
        "description": "Tailored scaffolding solutions for special projects"
      }
    ]
  }
}
```

---

### Contact Information

**GET** `/contact-info`

Get contact details for the company.

**Response Sample:**

```json
{
  "success": true,
  "data": {
    "title": "Contact Us",
    "subtitle": "Get in Touch for Your Scaffolding Needs",
    "content": {
      "address": "123 Industrial Street, Kwun Tong, Hong Kong",
      "phone": "+852 2345 6789",
      "email": "info@scaffolding.com.hk",
      "hours": "Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 1:00 PM"
    }
  }
}
```

---

### Base Information

**GET** `/base-info`

Get basic company contact and footer information.

**Response Sample:**

```json
{
  "success": true,
  "data": {
    "phone": "+852 2345 6789",
    "email": "info@scaffolding.com.hk",
    "whatsapp": "+852 9876 5432",
    "footer": "© 2025 Scaffolding Engineering Limited. All rights reserved."
  }
}
```

---

## Admin API (Management Endpoints)

These endpoints provide full CRUD operations for content management. All admin endpoints are prefixed with `/admin/api/`.

### Company Information Management

#### Get All Company Info Records

**GET** `/admin/api/companyInfo`

Get all company info records with pagination and search.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term for name, title, or subtitle

**Response Sample:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Scaffolding Engineering Limited",
      "title": "利高棚業工程有限公司｜康師傅搭棚公司",
      "subtitle": "康師傅搭棚公司",
      "logo": "/logo.png",
      "createdAt": "2025-10-26T04:21:36.568Z",
      "updatedAt": "2025-10-26T04:21:36.568Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### Get Company Info by ID

**GET** `/admin/api/companyInfo/:id`

Get a specific company info record by ID.

**Response Sample:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Scaffolding Engineering Limited",
    "title": "利高棚業工程有限公司｜康師傅搭棚公司",
    "subtitle": "康師傅搭棚公司",
    "logo": "/logo.png",
    "createdAt": "2025-10-26T04:21:36.568Z",
    "updatedAt": "2025-10-26T04:21:36.568Z"
  }
}
```

#### Create Company Info

**POST** `/admin/api/companyInfo`

Create a new company info record.

**Request Body:**

```json
{
  "name": "Scaffolding Engineering Limited",
  "title": "利高棚業工程有限公司｜康師傅搭棚公司",
  "subtitle": "康師傅搭棚公司",
  "logo": "/logo.png"
}
```

**Required Fields:**

- `name` (string): Company name
- `title` (string): Company title
- `subtitle` (string): Company subtitle
- `logo` (string, optional): Logo image path

**Response Sample:**

```json
{
  "success": true,
  "message": "Company info created successfully",
  "data": {
    "id": 2,
    "name": "Scaffolding Engineering Limited",
    "title": "利高棚業工程有限公司｜康師傅搭棚公司",
    "subtitle": "康師傅搭棚公司",
    "logo": "/logo.png",
    "createdAt": "2025-10-26T04:45:00.000Z",
    "updatedAt": "2025-10-26T04:45:00.000Z"
  }
}
```

#### Update Company Info

**PUT** `/admin/api/companyInfo/:id`

Update an existing company info record.

**Request Body:**

```json
{
  "name": "Scaffolding Engineering Limited",
  "title": "利高棚業工程有限公司｜康師傅搭棚公司",
  "subtitle": "康師傅搭棚公司",
  "logo": "/new-logo.png"
}
```

**Response Sample:**

```json
{
  "success": true,
  "message": "Company info updated successfully",
  "data": {
    "id": 1,
    "name": "Scaffolding Engineering Limited",
    "title": "利高棚業工程有限公司｜康師傅搭棚公司",
    "subtitle": "康師傅搭棚公司",
    "logo": "/new-logo.png",
    "createdAt": "2025-10-26T04:21:36.568Z",
    "updatedAt": "2025-10-26T04:46:00.000Z"
  }
}
```

#### Delete Company Info

**DELETE** `/admin/api/companyInfo/:id`

Delete a company info record.

**Response Sample:**

```json
{
  "success": true,
  "message": "Company info deleted successfully"
}
```

---

### Banner Management

#### Get All Banner Records

**GET** `/admin/api/banner`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term for title, subtitle, or content

**Response Sample:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Professional Scaffolding Services",
      "subtitle": "Safe, Reliable, and Efficient Solutions",
      "content": "We provide comprehensive scaffolding solutions for construction projects of all sizes.",
      "images": ["/images/banner1.jpg", "/images/banner2.jpg"],
      "createdAt": "2025-10-26T04:21:36.568Z",
      "updatedAt": "2025-10-26T04:21:36.568Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### Create Banner

**POST** `/admin/api/banner`

**Request Body:**

```json
{
  "title": "Professional Scaffolding Services",
  "subtitle": "Safe, Reliable, and Efficient Solutions",
  "content": "We provide comprehensive scaffolding solutions for construction projects of all sizes.",
  "images": ["/images/banner1.jpg", "/images/banner2.jpg"]
}
```

**Required Fields:**

- `title` (string): Banner title
- `subtitle` (string): Banner subtitle
- `content` (string): Banner content
- `images` (array): Array of image paths

#### Update Banner

**PUT** `/admin/api/banner/:id`

Same request body as create operation.

#### Delete Banner

**DELETE** `/admin/api/banner/:id`

---

### About Company Management

#### Get All About Company Records

**GET** `/admin/api/about-company`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term for title, subtitle, or content

**Response Sample:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "About Scaffolding Engineering Limited",
      "subtitle": "Your Trusted Scaffolding Partner Since 2010",
      "content": "With over a decade of experience in the scaffolding industry, we have established ourselves as a leading provider of safe and reliable scaffolding solutions in Hong Kong.",
      "images": {
        "main": "/images/about-main.jpg",
        "gallery": ["/images/gallery1.jpg", "/images/gallery2.jpg"]
      },
      "createdAt": "2025-10-26T04:21:36.568Z",
      "updatedAt": "2025-10-26T04:21:36.568Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### Create About Company

**POST** `/admin/api/about-company`

**Request Body:**

```json
{
  "title": "About Scaffolding Engineering Limited",
  "subtitle": "Your Trusted Scaffolding Partner Since 2010",
  "content": "With over a decade of experience in the scaffolding industry...",
  "images": {
    "main": "/images/about-main.jpg",
    "gallery": ["/images/gallery1.jpg", "/images/gallery2.jpg"]
  }
}
```

**Required Fields:**

- `title` (string): Title
- `subtitle` (string): Subtitle
- `content` (string): Content text
- `images` (object): Images object with main and gallery properties

#### Update About Company

**PUT** `/admin/api/about-company/:id`

Same request body as create operation.

#### Delete About Company

**DELETE** `/admin/api/about-company/:id`

---

### Quote Price Management

#### Get All Quote Price Records

**GET** `/admin/api/quote-price`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term for title or subtitle

**Response Sample:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Get a Quote",
      "subtitle": "Competitive Pricing for Quality Scaffolding Services",
      "content": [
        {
          "service": "Basic Scaffolding",
          "price": "Starting from HK$500/day",
          "description": "Standard scaffolding setup for residential projects"
        },
        {
          "service": "Commercial Scaffolding",
          "price": "Starting from HK$1,200/day",
          "description": "Heavy-duty scaffolding for commercial buildings"
        }
      ],
      "createdAt": "2025-10-26T04:21:36.568Z",
      "updatedAt": "2025-10-26T04:21:36.568Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### Create Quote Price

**POST** `/admin/api/quote-price`

**Request Body:**

```json
{
  "title": "Get a Quote",
  "subtitle": "Competitive Pricing for Quality Scaffolding Services",
  "content": [
    {
      "service": "Basic Scaffolding",
      "price": "Starting from HK$500/day",
      "description": "Standard scaffolding setup for residential projects"
    }
  ]
}
```

**Required Fields:**

- `title` (string): Title
- `subtitle` (string): Subtitle
- `content` (array): Array of pricing objects

#### Update Quote Price

**PUT** `/admin/api/quote-price/:id`

Same request body as create operation.

#### Delete Quote Price

**DELETE** `/admin/api/quote-price/:id`

---

### Contact Information Management

#### Get All Contact Info Records

**GET** `/admin/api/contact-info`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term for title or subtitle

**Response Sample:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Contact Us",
      "subtitle": "Get in Touch for Your Scaffolding Needs",
      "content": {
        "address": "123 Industrial Street, Kwun Tong, Hong Kong",
        "phone": "+852 2345 6789",
        "email": "info@scaffolding.com.hk",
        "hours": "Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 1:00 PM"
      },
      "createdAt": "2025-10-26T04:21:36.568Z",
      "updatedAt": "2025-10-26T04:21:36.568Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### Create Contact Info

**POST** `/admin/api/contact-info`

**Request Body:**

```json
{
  "title": "Contact Us",
  "subtitle": "Get in Touch for Your Scaffolding Needs",
  "content": {
    "address": "123 Industrial Street, Kwun Tong, Hong Kong",
    "phone": "+852 2345 6789",
    "email": "info@scaffolding.com.hk",
    "hours": "Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 1:00 PM"
  }
}
```

**Required Fields:**

- `title` (string): Title
- `subtitle` (string): Subtitle
- `content` (object): Contact details object

#### Update Contact Info

**PUT** `/admin/api/contact-info/:id`

Same request body as create operation.

#### Delete Contact Info

**DELETE** `/admin/api/contact-info/:id`

---

### Base Information Management

#### Get All Base Info Records

**GET** `/admin/api/base-info`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term for phone, email, whatsapp, or footer

**Response Sample:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "phone": "+852 2345 6789",
      "email": "info@scaffolding.com.hk",
      "whatsapp": "+852 9876 5432",
      "footer": "© 2025 Scaffolding Engineering Limited. All rights reserved.",
      "createdAt": "2025-10-26T04:21:36.568Z",
      "updatedAt": "2025-10-26T04:21:36.568Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### Create Base Info

**POST** `/admin/api/base-info`

**Request Body:**

```json
{
  "phone": "+852 2345 6789",
  "email": "info@scaffolding.com.hk",
  "whatsapp": "+852 9876 5432",
  "footer": "© 2025 Scaffolding Engineering Limited. All rights reserved."
}
```

**Required Fields:**

- `phone` (string): Phone number
- `email` (string): Email address (must be valid email format)
- `whatsapp` (string): WhatsApp number
- `footer` (string): Footer text

#### Update Base Info

**PUT** `/admin/api/base-info/:id`

Same request body as create operation.

#### Delete Base Info

**DELETE** `/admin/api/base-info/:id`

---

## Error Codes

### HTTP Status Codes

- `200` - Success
- `201` - Created successfully
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

### Common Error Scenarios

#### 404 Not Found

```json
{
  "success": false,
  "message": "Company info not found"
}
```

#### 400 Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Usage Examples

### Using cURL

**Get company info (Portal):**

```bash
curl -X GET "http://localhost:8888/companyInfo"
```

**Create new banner (Admin):**

```bash
curl -X POST "http://localhost:8888/admin/api/banner" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Banner Title",
    "subtitle": "New Banner Subtitle",
    "content": "New banner content",
    "images": ["/images/new-banner.jpg"]
  }'
```

**Update company info (Admin):**

```bash
curl -X PUT "http://localhost:8888/admin/api/companyInfo/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Company Name",
    "title": "Updated Title",
    "subtitle": "Updated Subtitle"
  }'
```

### Using JavaScript/Fetch

```javascript
// Get portal data
async function getCompanyInfo() {
  const response = await fetch("http://localhost:8888/companyInfo");
  const data = await response.json();
  console.log(data);
}

// Create admin data
async function createBanner(bannerData) {
  const response = await fetch("http://localhost:8888/admin/api/banner", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bannerData),
  });
  const data = await response.json();
  console.log(data);
}
```

---

## Authentication & Security

**Note**: Currently, the admin API does not include authentication. In a production environment, you should implement:

1. JWT token authentication for admin endpoints
2. API rate limiting
3. HTTPS encryption
4. Input sanitization
5. CORS configuration

---

## Database Schema

The API uses Prisma ORM with MySQL database. The main tables are:

- `companyInfo` - Company basic information
- `banner` - Banner/slider content
- `aboutCompany` - About page content
- `quotePrice` - Pricing information
- `contactInfo` - Contact page content
- `baseInfo` - Footer and basic contact info

---

## Development

### Starting the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Legacy dual-server mode
npm run legacy
```

The server runs on port 8888 by default (configured via PORTAL_PORT environment variable).

### Environment Variables

```bash
# Database
DATABASE_URL="mysql://root:root@localhost:3307/scaffolding_local"

# Server Ports
PORT=3000
PORTAL_PORT=8888
ADMIN_PORT=8889

# JWT Secret (for future authentication)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Environment
NODE_ENV="development"
```

---

_Last Updated: October 26, 2025_

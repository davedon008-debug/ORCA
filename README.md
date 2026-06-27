# Orca - Full-Stack Modern E-Commerce Platform

Orca is a premium, responsive e-commerce web application for a modern home appliance and furniture mall. It provides comprehensive e-commerce functionality built with Next.js App Router and a scalable Node.js/Express backend.

## Tech Stack
- **Frontend**: React.js / Next.js (App Router), Tailwind CSS v4, Framer-Motion, Socket.io-client, Axios.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Socket.io (Real-Time Support Chat).
- **Authentication**: JWT, bcryptjs.
- **Assets**: Cloudinary (Prepared via .env), Tailwind integrations.

## Setup & Installation

### 1. Backend Setup
1. Open the `backend/` directory.
2. Install dependencies: `npm install`
3. Rename `.env.example` to `.env` and fill out your MongoDB URI and a random string for `JWT_SECRET`.
4. Run the seeder to populate dummy data categories, users, and products:
   ```bash
   npm run data:import
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Switch to the `frontend/` directory.
2. Install dependencies: `npm install`
3. Make sure the proxy to your backend is active or adjust your `axiosInstance.js` if deploying the backend remotely.
4. Start the frontend:
   ```bash
   npm run dev
   ```

## API Routes Overview

### Products API (`/api/products`)
- `GET /` - Fetch all products (supports filters: `keyword`, `category`, `sort`, `brand`, `minPrice`, `maxPrice`)
- `GET /:id` - Get individual product with reviews.
- `POST /` - Admin: Create new product placeholder.
- `PUT /:id` - Admin: Update a product fully.
- `POST /:id/reviews` - Protected: Submit a user review.

### Users API (`/api/users`)
- `POST /` - Register a new user.
- `POST /login` - User login for JWT generation.
- `GET /profile` - Protected: Fetch logged in user.
- `PUT /profile` - Protected: Update user profile.
- `GET /` - Admin: Fetch all registered users.

### Orders API (`/api/orders`)
- `POST /` - Protected: Place an order.
- `GET /myorders` - Protected: Fetch own past orders.
- `GET /` - Admin: Fetch all system orders.
- `PUT /:id/pay` - Protected: Update order as paid via callback.

### Chat API (`/api/chat` & Socket.io)
- `GET /:room` - Protected: Load previous chat history for a session room.
- Runs `send_message` and `receive_message` events natively over local port `5001`.

## Deployment
- **Frontend (Vercel)**: Push your repo and link the `frontend/` subdirectory directly inside Vercel. 
- **Backend (Render/Railway)**: Push the repo, configure Render to point to the `backend/` directory, set the start command to `node index.js`, and import all variables from the `.env` file into the platform environment variables.

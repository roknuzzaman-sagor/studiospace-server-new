# StudioSpace API — Express + MongoDB Backend

RESTful backend for **StudioSpace**, a peer-to-peer creative studio marketplace where owners list studios and creators book hourly slots.

## ✨ Features

- JWT authentication with **HTTPOnly cookies** (XSS-safe)
- Google OAuth 2.0 login
- Studio CRUD (owner-only mutations)
- Real-time booking with **double-booking prevention** (409 conflict on overlap)
- Wishlist / favorites
- Booking lifecycle: Pending → Confirmed → Completed / Cancelled
- Role-based access (only owner can edit/delete own studio)

---

## 🛠️ Tech Stack

- **Runtime:** Node.js + Express.js
- **Database:** MongoDB Atlas + Mongoose
- **Auth:** JWT + bcryptjs + google-auth-library
- **Deploy:** Vercel (serverless)

---

## 🚀 Local Setup

```bash
git clone https://github.com/your-username/studiospace-server-new.git
cd studiospace-server-new
npm install
```

Create `.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/studiosDB
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:3000
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
NODE_ENV=development
```

Run:
```bash
npm run dev
```

Verify: `http://localhost:5000/` → `{"message":"StudioSpace API running"}`

---

## 📡 API Endpoints

**Auth**
| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/auth/register` | ❌ |
| POST | `/api/auth/login` | ❌ |
| POST | `/api/auth/google` | ❌ |
| GET | `/api/auth/me` | ✅ |
| POST | `/api/auth/logout` | ❌ |

**Studios**
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/studios` | ❌ |
| GET | `/api/studios/featured` | ❌ |
| GET | `/api/studios/:id` | ❌ |
| GET | `/api/studios/my-listings` | ✅ |
| POST | `/api/studios` | ✅ |
| PUT | `/api/studios/:id` | ✅ owner |
| DELETE | `/api/studios/:id` | ✅ owner |

**Bookings**
| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/bookings` | ✅ |
| GET | `/api/bookings/my-bookings` | ✅ |
| PATCH | `/api/bookings/:id/cancel` | ✅ user |
| PATCH | `/api/bookings/:id/status` | ✅ owner |

**Wishlist**
| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/wishlist` | ✅ |
| GET | `/api/wishlist` | ✅ |
| GET | `/api/wishlist/check/:studioId` | ✅ |
| DELETE | `/api/wishlist/:studioId` | ✅ |

---

## 🔐 Challenges Implemented

- **Challenge 1:** JWT stored in HTTPOnly cookies — no token in response body or localStorage
- **Challenge 2:** Double-booking prevention — new booking rejected with `409` if it overlaps a **Confirmed** booking on the same studio + date
- **Challenge 3:** Theme toggle (implemented in frontend via `next-themes`)

---

## 🧪 Test Credentials (Examiner)

| Email | Password |
|---|---|
| `examiner@studiospace.com` | `Test1234` |

### Quick curl test

```bash
# Login
curl -c cookies.txt -X POST https://studiospace-server-new.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"examiner@studiospace.com\",\"password\":\"Test1234\"}"

# Protected route
curl -b cookies.txt https://studiospace-server-new.vercel.app/api/bookings/my-bookings
```

---

## 📦 Scripts

```bash
npm run dev    # dev with nodemon
npm start      # production
```

---


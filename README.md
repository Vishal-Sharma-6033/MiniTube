## 🎬 MiniTube — A Modern Video & Community Platform Backend

MiniTube is a modern backend system designed for a content-sharing and community interaction platform where users can create, publish, and engage with multimedia content in multiple ways.
The platform enables users to upload videos and images, share short-form updates, interact through comments and likes, and organize content using playlists. Along with content interaction, MiniTube also introduces a subscription-based creator-follow system that allows users to stay connected with their preferred creators

---

## 🚀 Features

- 🔐 User Authentication & Authorization (JWT)
- 🔑 Secure Password Hashing using Bcrypt
- 👤 User Profile Management
- 📹 Video Upload & Management
- 👍 Like / Dislike System
- 💬 Comments System
- 📂 Playlist Management
- 🔔 Channel Subscription System
- 📺 Watch History Tracking
- 📦 RESTful API Architecture
- 🧩 Middleware-based Request Handling
- 📁 Scalable Folder Structure

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Token)
- Bcrypt
- Multer
- dotenv

---

## 📁 Project Structure

```
## 📁 Project Structure
MiniTube/
│
├── node_modules/
│
├── public/
│   └── temp/
│       └── .gitkeep
│
├── src/
│   │
│   ├── controllers/                 # Business logic layer
│   │   ├── comment.controllers.js
│   │   ├── deshBoard.controllers.js
│   │   ├── like.controllers.js
│   │   ├── playlist.controllers.js
│   │   ├── subscriber.controllers.js
│   │   ├── tweet.controllers.js
│   │   ├── user.controllers.js
│   │   └── video.controllers.js
│   │
│   ├── db/                          # Database configuration
│   │   └── index.js
│   │
│   ├── middlewares/                 # Custom middlewares
│   │   ├── auth.middlewares.js
│   │   └── multer.middlewares.js
│   │
│   ├── models/                      # Mongoose schemas
│   │   ├── comment.models.js
│   │   ├── like.models.js
│   │   ├── playlist.models.js
│   │   ├── subscription.models.js
│   │   ├── tweet.models.js
│   │   ├── user.models.js
│   │   └── video.models.js
│   │
│   ├── routes/                      # API route definitions
│   │   ├── comment.routes.js
│   │   ├── deshBoard.routes.js
│   │   ├── like.routes.js
│   │   ├── playlist.routes.js
│   │   ├── subscription.routes.js
│   │   ├── tweet.routes.js
│   │   ├── user.routes.js
│   │   └── videos.routes.js
│   │
│   ├── utils/                       # Utility helpers
│   │   ├── ApiErrors.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   └── cloudinary.js
│   │
│   ├── app.js                       # Express app configuration
│   ├── constants.js                 # Global constants
│   └── index.js                     # Server entry point
│
├── .env
├── .gitignore
├── .prettierignore
├── .prettierrc
├── package-lock.json
├── package.json
└── README.md

```
---




### Clone the Repository

git clone https://github.com/Vishal-Sharma-6033/MiniTube.git

---
## 👨‍💻 Author
Vishal Sharma <br>
MERN Stack Developer



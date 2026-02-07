# 🎬 MiniTube – Video Hosting Backend API

MiniTube is a **YouTube-like video hosting backend** built using the **MERN stack backend technologies**.  
This project provides scalable REST APIs for video uploading, authentication, user interaction, and content management.

The backend is designed using a **clean and modular architecture** following industry-level practices.

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
MiniTube
│
├── public/
│
├── src/
│ ├── controllers/
│ │ └── user.controllers.js
│ │
│ ├── db/
│ │ └── index.js
│ │
│ ├── middlewares/
│ │ ├── auth.middlewares.js
│ │ └── multer.middlewares.js
│ │
│ ├── models/
│ │ ├── user.models.js
│ │ ├── video.models.js
│ │ └── subscription.models.js
│ │
│ ├── routes/
│ │ └── user.routes.js
│ │
│ ├── utils/
│ │
│ ├── app.js
│ ├── constants.js
│ └── index.js
│
├── .env
├── package.json
└── README.md

```
---


## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

git clone https://github.com/Vishal-Sharma-6033/MiniTube.git

---
<h3>2️⃣ Install Dependencies</h3>
npm install

---
<h3>3️⃣ Create .env File</h3>
PORT=5000 <br>
MONGODB_URI=your_mongodb_uri <br>
ACCESS_TOKEN_SECRET=your_secret_key <br>
REFRESH_TOKEN_SECRET=your_secret_key <br>

---

<h3>4️⃣ Run the Server</h3>
npm run dev

---
## 👨‍💻 Author
Vishal Sharma <br>
MERN Stack Developer



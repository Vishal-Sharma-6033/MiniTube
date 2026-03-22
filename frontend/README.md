# MiniTube Frontend

Dark-theme React frontend for your MiniTube backend with modular architecture, protected routes, reusable UI components, and full feature mapping.

## Stack

- React + JSX (Vite)
- Tailwind CSS v4
- Axios
- React Router DOM
- Context API (Auth state)

## Setup Commands

```bash
cd frontend
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Environment Assumption

Backend base URL is hardcoded in src/utils/api.js:

```js
export const API_BASE_URL = 'http://localhost:8000/api/v1'
```

## Frontend Folder Structure

```text
frontend/
  src/
    components/
      common/
        Button.jsx
        ErrorState.jsx
        Input.jsx
        Loader.jsx
        Modal.jsx
        StatCard.jsx
        VideoCard.jsx
      layout/
        AppShell.jsx
        Navbar.jsx
        Sidebar.jsx
    context/
      AuthContext.jsx
    pages/
      DashboardPage.jsx
      HomePage.jsx
      LoginPage.jsx
      NotFoundPage.jsx
      PlaylistPage.jsx
      ProfilePage.jsx
      SignupPage.jsx
      TweetsPage.jsx
      UploadVideoPage.jsx
      VideoPlayerPage.jsx
    routes/
      AppRouter.jsx
      ProtectedRoute.jsx
    services/
      http.js
      api/
        auth.api.js
        comment.api.js
        dashboard.api.js
        like.api.js
        playlist.api.js
        subscription.api.js
        tweet.api.js
        user.api.js
        video.api.js
    utils/
      api.js
      format.js
    App.jsx
    index.css
    main.jsx
```

## Backend to UI Feature Mapping

- Auth: login, register, logout, current user bootstrap
- Videos: feed list, video details, upload, view increment
- Comments: list and add in video page
- Likes: video/comment/tweet like toggles
- Subscription: subscribe from video player
- Playlists: create, fetch, delete
- Dashboard: stats and channel videos
- Tweets/Posts: create, like, delete
- Profile: channel profile, subscriptions, watch history

## Routing

- Public: /login, /signup
- Protected: /, /upload, /video/:videoId, /playlists, /dashboard, /tweets, /profile

## Notes

- All API requests use withCredentials: true.
- Automatic refresh-token retry is handled in src/services/http.js.
- UI is responsive and optimized for both desktop and mobile breakpoints.

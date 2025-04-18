# React Starter Template

A modern React starter template with TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router, and Firebase.

## Features

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for beautiful, accessible components
- **React Router** for navigation
- **Firebase** for authentication, database, storage, and analytics
- Environment variables for secure configuration

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/react-starter-template.git
   cd react-starter-template
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up Firebase
   - Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Enable Authentication, Firestore, Storage, and Analytics as needed
   - Get your Firebase configuration from Project Settings > General > Your Apps > SDK setup and configuration

4. Create a `.env` file in the root directory with your Firebase configuration
   ```
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

5. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

## Firebase Features

This template includes the following Firebase features:

- **Authentication**: Sign up, sign in, and sign out functionality
- **Firestore**: NoSQL database for storing and syncing data
- **Storage**: File storage for user-generated content
- **Analytics**: User behavior analytics

## Project Structure

```
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable components
│   │   ├── auth/        # Authentication components
│   │   ├── layout/      # Layout components
│   │   └── ui/          # UI components from shadcn/ui
│   ├── contexts/        # React contexts
│   ├── lib/             # Utility functions and libraries
│   │   └── firebase.ts  # Firebase configuration
│   ├── pages/           # Page components
│   ├── App.tsx          # Main App component
│   ├── index.css        # Global styles
│   └── main.tsx         # Entry point
├── .env.example         # Example environment variables
├── .gitignore           # Git ignore file
├── components.json      # shadcn/ui configuration
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## Deployment

This template can be easily deployed to various platforms:

- **Vercel**: Connect your GitHub repository and deploy
- **Netlify**: Connect your GitHub repository and deploy
- **Firebase Hosting**: Deploy using the Firebase CLI

## License

This project is licensed under the MIT License - see the LICENSE file for details.

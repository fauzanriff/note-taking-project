# React Firebase Starter

A modern React starter template with TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router, and Firebase, organized with a feature-based folder structure.

## Features

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for beautiful, accessible components
- **React Router** for navigation
- **Firebase** for authentication, database, storage, and analytics
- **Feature-based folder structure** for better organization and scalability
- **Tiptap** rich text editor integration
- Environment variables for secure configuration

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/fauzanriff/react-firebase-starter.git
   cd react-firebase-starter
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

- **Authentication**: Sign up, sign in, and sign out functionality with password confirmation
- **Firestore**: NoSQL database for storing and syncing data
- **Storage**: File storage for user-generated content
- **Analytics**: User behavior analytics

## Project Structure

The project follows a feature-based folder structure for better organization and scalability:

```
├── public/              # Static assets
├── src/
│   ├── app/             # Core application logic
│   │   ├── App.tsx      # Main App component
│   │   └── main.tsx     # Entry point
│   ├── features/        # Feature-specific logic and components
│   │   ├── auth/        # Authentication feature
│   │   │   ├── components/  # Components specific to auth
│   │   │   └── index.ts     # Exports for auth feature
│   │   ├── notes/       # Notes feature
│   │   │   ├── components/  # Components specific to notes
│   │   │   └── index.ts     # Exports for notes feature
│   │   └── home/        # Home feature
│   │       ├── components/  # Components specific to home
│   │       └── index.ts     # Exports for home feature
│   ├── components/      # Global shared components
│   │   └── ui/          # UI components from shadcn/ui
│   ├── api/             # API services and configurations
│   │   └── firebase.ts  # Firebase configuration
│   ├── contexts/        # React contexts
│   ├── utils/           # Utility functions
│   ├── hooks/           # Shared custom hooks
│   ├── assets/          # Static assets (images, fonts, etc.)
│   └── index.css        # Global styles
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

### Feature-Based Organization

Each feature in the `/features` directory contains:

- **components/**: UI components specific to the feature
- **hooks/**: Custom hooks specific to the feature
- **utils/**: Utility functions specific to the feature
- **index.ts**: Exports the feature's public API

This organization makes it easier to:
- Understand the codebase by grouping related code together
- Maintain and extend features independently
- Reuse code within features without creating circular dependencies
- Onboard new developers by providing clear boundaries

## Key Features

### Authentication

- User sign-up with password confirmation
- User sign-in
- Protected routes
- Authentication state management

### Notes

- Create, read, update, and delete notes
- Rich text editing with Tiptap
- Auto-save functionality
- Real-time updates with Firestore

## Deployment

This template can be easily deployed to various platforms:

- **Vercel**: Connect your GitHub repository and deploy
- **Netlify**: Connect your GitHub repository and deploy
- **Firebase Hosting**: Deploy using the Firebase CLI

## License

This project is licensed under the MIT License - see the LICENSE file for details.

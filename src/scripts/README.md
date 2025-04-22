# Quran Data Import Script

This script imports the Quran data from a JSON file into Firebase Firestore.

## Prerequisites

1. Node.js installed on your machine
2. Firebase project with Firestore enabled
3. Service account key for your Firebase project

## Setup

1. **Install dependencies**:
   ```bash
   npm install firebase-admin
   ```

2. **Get your service account key**:
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Go to Project Settings > Service accounts
   - Click "Generate new private key"
   - Save the JSON file as `serviceAccountKey.json` in this directory (src/scripts)
   - Note: A placeholder file `serviceAccountKey.example.json` is provided as a reference. You should copy this file, rename it to `serviceAccountKey.json`, and replace the placeholder values with your actual Firebase service account details.

## Running the Script

1. Make sure your `serviceAccountKey.json` is in the scripts directory
2. Run the script:
   ```bash
   node import-quran.js
   ```
3. The script will prompt for confirmation before starting the import
4. Wait for the import to complete

## Data Structure

The script will create the following structure in Firestore:

```
quran (collection)
  |
  ├── 1 (document - Al-Fatihah)
  │   ├── name: "Al-Fatihah"
  │   ├── arabicName: "الفاتحة"
  │   ├── totalAya: 7
  │   ├── index: 1
  │   │
  │   └── ayas (subcollection)
  │       ├── 1 (document)
  │       │   ├── arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ"
  │       │   ├── indonesia: "Dengan menyebut nama Allah Yang Maha Pemurah lagi Maha Penyayang."
  │       │   └── index: 1
  │       │
  │       ├── 2 (document)
  │       │   └── ... (similar structure)
  │       │
  │       └── ... (remaining ayas)
  │
  └── ... (remaining suras)
```

## Notes

- The import process may take several minutes depending on your internet connection
- The script uses batched writes to optimize performance and stay within Firestore limits
- Each sura and aya is imported as a separate document to allow for efficient querying
- You will incur Firestore write costs for this import operation

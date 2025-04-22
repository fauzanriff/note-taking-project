const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Path to the service account key file
// You'll need to place your serviceAccountKey.json in the scripts directory
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

// Path to the Quran JSON file
const quranDataPath = path.join(__dirname, '../data/quran.json');

// Check if service account file exists
if (!fs.existsSync(serviceAccountPath)) {
  console.error('Error: serviceAccountKey.json not found!');
  console.error('Please download your service account key from the Firebase Console:');
  console.error('1. Go to https://console.firebase.google.com/');
  console.error('2. Select your project');
  console.error('3. Go to Project Settings > Service accounts');
  console.error('4. Click "Generate new private key"');
  console.error('5. Save the JSON file as "serviceAccountKey.json" in the src/scripts directory');
  console.error('');
  console.error('Alternatively, you can copy the example file and update it with your credentials:');
  console.error('cp serviceAccountKey.example.json serviceAccountKey.json');
  console.error('Then edit serviceAccountKey.json with your actual Firebase service account details');
  process.exit(1);
}

// Check if Quran data file exists
if (!fs.existsSync(quranDataPath)) {
  console.error('Error: Quran data file not found at:', quranDataPath);
  process.exit(1);
}

// Initialize Firebase Admin with your service account
const serviceAccount = require(serviceAccountPath);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function importQuran() {
  try {
    console.log('Reading Quran data file...');
    const quranData = JSON.parse(fs.readFileSync(quranDataPath, 'utf8'));

    console.log('Starting import process...');
    console.log(`Found ${quranData.sura.length} suras to import`);

    let totalOperations = 0;
    let totalBatches = 0;

    // Process each sura
    for (let i = 0; i < quranData.sura.length; i++) {
      const sura = quranData.sura[i];
      console.log(`Processing Sura ${sura.index}: ${sura.name} (${sura.totalAya} ayas)`);

      // Create a new batch for each sura to avoid exceeding limits
      let batch = db.batch();
      let batchCount = 0;
      const BATCH_LIMIT = 500; // Firestore batch limit is 500 operations

      // Add sura metadata
      const suraRef = db.collection('quran').doc(sura.index.toString());
      batch.set(suraRef, {
        name: sura.name,
        arabicName: sura.arabicName,
        totalAya: sura.totalAya,
        index: sura.index
      });

      batchCount++;
      totalOperations++;

      // Process each aya in the sura
      for (let j = 0; j < sura.aya.length; j++) {
        const aya = sura.aya[j];
        const ayaRef = suraRef.collection('ayas').doc(aya.index.toString());

        // Add aya data
        batch.set(ayaRef, {
          arabic: aya.arabic,
          indonesia: aya.indonesia,
          index: aya.index
        });

        batchCount++;
        totalOperations++;

        // If we reach the batch limit, commit and create a new batch
        if (batchCount >= BATCH_LIMIT) {
          console.log(`Committing batch ${++totalBatches} (${batchCount} operations)...`);
          await batch.commit();
          batch = db.batch();
          batchCount = 0;
        }
      }

      // Commit any remaining operations for this sura
      if (batchCount > 0) {
        console.log(`Committing batch ${++totalBatches} (${batchCount} operations)...`);
        await batch.commit();
      }

      console.log(`Completed Sura ${sura.index}: ${sura.name}`);
    }

    console.log('Import completed successfully!');
    console.log(`Total operations: ${totalOperations}`);
    console.log(`Total batches: ${totalBatches}`);

  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
}

console.log('Quran import script initialized');
console.log('This script will import the Quran data from JSON to Firestore');
console.log('Press Ctrl+C to cancel or any key to continue...');

// Wait for user confirmation before starting
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', () => {
  process.stdin.setRawMode(false);
  process.stdin.pause();

  importQuran().then(() => {
    console.log('Import process completed. You can now use the data in your application.');
    process.exit(0);
  }).catch(error => {
    console.error('Error during import:', error);
    process.exit(1);
  });
});

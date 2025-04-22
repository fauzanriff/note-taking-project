import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';

// Types
export interface Aya {
  index: number;
  arabic: string;
  indonesia: string;
}

export interface Sura {
  index: number;
  name: string;
  arabicName: string;
  totalAya: number;
  ayas?: Aya[];
}

// Get all suras (without ayas)
export const getAllSuras = async (): Promise<Sura[]> => {
  try {
    const suraCollection = collection(db, 'quran');
    const suraQuery = query(suraCollection, orderBy('index', 'asc'));
    const suraSnapshot = await getDocs(suraQuery);
    
    return suraSnapshot.docs.map(doc => doc.data() as Sura);
  } catch (error) {
    console.error('Error fetching suras:', error);
    throw error;
  }
};

// Get a specific sura with all its ayas
export const getSuraWithAyas = async (suraIndex: number): Promise<Sura | null> => {
  try {
    // Get the sura document
    const suraDoc = doc(db, 'quran', suraIndex.toString());
    const suraSnapshot = await getDoc(suraDoc);
    
    if (!suraSnapshot.exists()) {
      return null;
    }
    
    const sura = suraSnapshot.data() as Sura;
    
    // Get all ayas for this sura
    const ayaCollection = collection(suraDoc, 'ayas');
    const ayaQuery = query(ayaCollection, orderBy('index', 'asc'));
    const ayaSnapshot = await getDocs(ayaQuery);
    
    sura.ayas = ayaSnapshot.docs.map(doc => doc.data() as Aya);
    
    return sura;
  } catch (error) {
    console.error(`Error fetching sura ${suraIndex}:`, error);
    throw error;
  }
};

// Get a specific aya from a sura
export const getAya = async (suraIndex: number, ayaIndex: number): Promise<Aya | null> => {
  try {
    const ayaDoc = doc(db, 'quran', suraIndex.toString(), 'ayas', ayaIndex.toString());
    const ayaSnapshot = await getDoc(ayaDoc);
    
    if (!ayaSnapshot.exists()) {
      return null;
    }
    
    return ayaSnapshot.data() as Aya;
  } catch (error) {
    console.error(`Error fetching aya ${suraIndex}:${ayaIndex}:`, error);
    throw error;
  }
};

// Search for ayas containing specific text
export const searchQuran = async (searchText: string, limit = 20): Promise<Array<{sura: Sura, aya: Aya}>> => {
  try {
    const results: Array<{sura: Sura, aya: Aya}> = [];
    const suras = await getAllSuras();
    
    // Note: Firestore doesn't support full-text search natively
    // For a production app, consider using Algolia, Elasticsearch, or Firebase Extensions
    // This is a simple implementation that searches through each sura
    
    for (const sura of suras) {
      if (results.length >= limit) break;
      
      const suraWithAyas = await getSuraWithAyas(sura.index);
      if (!suraWithAyas || !suraWithAyas.ayas) continue;
      
      for (const aya of suraWithAyas.ayas) {
        if (
          aya.indonesia.toLowerCase().includes(searchText.toLowerCase()) ||
          aya.arabic.includes(searchText)
        ) {
          results.push({
            sura: {
              index: sura.index,
              name: sura.name,
              arabicName: sura.arabicName,
              totalAya: sura.totalAya
            },
            aya
          });
          
          if (results.length >= limit) break;
        }
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error searching Quran:', error);
    throw error;
  }
};

export default {
  getAllSuras,
  getSuraWithAyas,
  getAya,
  searchQuran
};

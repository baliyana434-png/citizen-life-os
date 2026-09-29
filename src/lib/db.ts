import { MongoClient, Db } from 'mongodb';
import fs from 'fs/promises';
import path from 'path';
import { CountryCode, CitizenSubscription } from '@/types';

const CITIZENS_FILE = path.join(process.cwd(), 'src', 'data', 'citizens_store.json');
const FAVORITES_FILE = path.join(process.cwd(), 'src', 'data', 'favorites_store.json');
const FAMILY_FILE = path.join(process.cwd(), 'src', 'data', 'family_store.json');

// MongoDB Connection Caching for Serverless Next.js
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI || '';
let clientPromise: Promise<MongoClient> | null = null;

export const isMongoConfigured = (): boolean => {
  return Boolean(uri && (uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://')));
};

if (isMongoConfigured()) {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  }
}

async function getMongoDb(): Promise<Db | null> {
  if (!isMongoConfigured() || !clientPromise) return null;
  try {
    const client = await clientPromise;
    return client.db(process.env.MONGODB_DB_NAME || 'citizen_life_os');
  } catch (err) {
    console.warn('MongoDB connection failed, falling back to local store:', err);
    return null;
  }
}

// Local File System Helper Fallbacks
async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    try {
      await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
    } catch {}
    return fallback;
  }
}

async function writeJsonFile(filePath: string, data: any): Promise<void> {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Failed to write local file ${filePath}:`, err);
  }
}

// -------------------------------------------------------------
// UNIFIED DATA REPOSITORY (Auto-switches Cloud DB & Local Store)
// -------------------------------------------------------------

export interface CitizenRecord {
  id: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  country?: CountryCode;
  nationalIdName?: string;
  nationalIdMasked?: string;
  aadhaarNumberMasked?: string;
  age: number;
  dob?: string;
  gender: 'male' | 'female' | 'other';
  state: string;
  administrativeDivision?: string;
  district?: string;
  pincode?: string;
  lifePhase: string;
  casteCategory: string;
  familyIncomeAnnual?: number;
  photoURL?: string;
  registeredAt: string;
  status: 'verified';
  isOnboarded?: boolean;
  subscription?: CitizenSubscription;
}

export const DatabaseService = {
  /**
   * Find a registered citizen by email, phone, or ID
   */
  async findCitizen(filter: { email?: string; phone?: string; id?: string }): Promise<CitizenRecord | null> {
    const email = filter.email?.trim().toLowerCase();
    const phone = filter.phone?.replace(/\D/g, '').slice(-10);
    const id = filter.id?.trim();

    // 1. Try Cloud MongoDB Atlas
    const db = await getMongoDb();
    if (db) {
      try {
        const query: any = {};
        const conditions: any[] = [];
        if (email) conditions.push({ email: email });
        if (phone) conditions.push({ phoneNumber: phone });
        if (id) conditions.push({ id: id });

        if (conditions.length > 0) {
          query.$or = conditions;
          const citizen = await db.collection<CitizenRecord>('citizens').findOne(query);
          if (citizen) return citizen;
        }
      } catch (err) {
        console.warn('MongoDB find error, falling back to local file:', err);
      }
    }

    // 2. Local JSON Store Fallback
    const citizens = await readJsonFile<CitizenRecord[]>(CITIZENS_FILE, []);
    return (
      citizens.find((c) => {
        if (email && c.email?.toLowerCase() === email) return true;
        if (phone && c.phoneNumber === phone) return true;
        if (id && c.id === id) return true;
        return false;
      }) || null
    );
  },

  /**
   * Save or update citizen profile
   */
  async saveCitizen(citizen: CitizenRecord): Promise<CitizenRecord> {
    const email = citizen.email?.trim().toLowerCase();
    const phone = citizen.phoneNumber?.replace(/\D/g, '').slice(-10);

    // 1. Save to Cloud MongoDB Atlas if configured
    const db = await getMongoDb();
    if (db) {
      try {
        const filter: any = {};
        const conditions: any[] = [];
        if (email) conditions.push({ email: email });
        if (phone) conditions.push({ phoneNumber: phone });
        if (citizen.id) conditions.push({ id: citizen.id });

        if (conditions.length > 0) {
          filter.$or = conditions;
        } else {
          filter.id = citizen.id;
        }

        await db.collection('citizens').updateOne(filter, { $set: citizen }, { upsert: true });
      } catch (err) {
        console.warn('MongoDB write error:', err);
      }
    }

    // 2. Always persist locally as well for offline dev resiliency
    const citizens = await readJsonFile<CitizenRecord[]>(CITIZENS_FILE, []);
    const idx = citizens.findIndex((c) => {
      if (email && c.email?.toLowerCase() === email) return true;
      if (phone && c.phoneNumber === phone) return true;
      if (citizen.id && c.id === citizen.id) return true;
      return false;
    });

    if (idx >= 0) {
      citizens[idx] = { ...citizens[idx], ...citizen };
    } else {
      citizens.unshift(citizen);
    }
    await writeJsonFile(CITIZENS_FILE, citizens);

    return citizen;
  },

  /**
   * Get all registered citizens (For Admin Dashboard)
   */
  async getAllCitizens(): Promise<CitizenRecord[]> {
    const db = await getMongoDb();
    if (db) {
      try {
        return await db.collection<CitizenRecord>('citizens').find({}).sort({ registeredAt: -1 }).toArray();
      } catch (err) {
        console.warn('MongoDB list error:', err);
      }
    }
    return await readJsonFile<CitizenRecord[]>(CITIZENS_FILE, []);
  },

  /**
   * Get saved favorites for a citizen
   */
  async getFavorites(key: string): Promise<string[]> {
    if (!key) return [];
    const cleanKey = key.trim().toLowerCase();

    const db = await getMongoDb();
    if (db) {
      try {
        const doc = await db.collection('favorites').findOne({ key: cleanKey });
        if (doc && Array.isArray(doc.favorites)) return doc.favorites;
      } catch (err) {
        console.warn('MongoDB favorites read error:', err);
      }
    }

    const allFavorites = await readJsonFile<Record<string, string[]>>(FAVORITES_FILE, {});
    return allFavorites[cleanKey] || allFavorites[key] || [];
  },

  /**
   * Save favorites for a citizen
   */
  async saveFavorites(key: string, favorites: string[]): Promise<void> {
    if (!key) return;
    const cleanKey = key.trim().toLowerCase();

    const db = await getMongoDb();
    if (db) {
      try {
        await db.collection('favorites').updateOne(
          { key: cleanKey },
          { $set: { key: cleanKey, favorites, updatedAt: new Date().toISOString() } },
          { upsert: true }
        );
      } catch (err) {
        console.warn('MongoDB favorites write error:', err);
      }
    }

    const allFavorites = await readJsonFile<Record<string, string[]>>(FAVORITES_FILE, {});
    allFavorites[cleanKey] = favorites;
    await writeJsonFile(FAVORITES_FILE, allFavorites);
  },
};

import { MongoClient, Db } from 'mongodb';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { CountryCode, CitizenSubscription } from '@/types';

const CITIZENS_FILE = 'citizens_store.json';
const FAVORITES_FILE = 'favorites_store.json';
const FAMILY_FILE = 'family_store.json';

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const defaultDataDir = path.join(process.cwd(), 'src', 'data');
const serverlessDataDir = '/tmp';

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

function getStoragePaths(fileName: string): { readPath: string; writePath: string } {
  if (isServerless) {
    return {
      readPath: path.join(serverlessDataDir, fileName),
      writePath: path.join(serverlessDataDir, fileName),
    };
  }
  const local = path.join(defaultDataDir, fileName);
  return { readPath: local, writePath: local };
}

// Local File System Helper Fallbacks
async function readJsonFile<T>(fileName: string, fallback: T): Promise<T> {
  const { readPath } = getStoragePaths(fileName);
  try {
    const raw = await fs.readFile(readPath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (isServerless) {
      try {
        const bundlePath = path.join(defaultDataDir, fileName);
        const rawBundle = await fs.readFile(bundlePath, 'utf-8');
        const parsed = JSON.parse(rawBundle);
        try {
          await fs.writeFile(readPath, rawBundle, 'utf-8');
        } catch {}
        return parsed;
      } catch {}
    }
    return fallback;
  }
}

async function writeJsonFile(fileName: string, data: any): Promise<void> {
  const { writePath } = getStoragePaths(fileName);
  try {
    await fs.writeFile(writePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn(`Local store file write note (${writePath}):`, err);
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
  isAadhaarVerified?: boolean;
  isCardVerified?: boolean;
  subscription?: CitizenSubscription;
  notificationsEnabled?: {
    webPush?: boolean;
    whatsApp?: boolean;
    urgentDeadlinesOnly?: boolean;
  };
  passwordHash?: string;
  passwordSalt?: string;
}

export function hashCitizenPassword(password: string, customSalt?: string): { hash: string; salt: string } {
  const salt = customSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

export function verifyCitizenPassword(password: string, hash: string, salt: string): boolean {
  if (!password || !hash || !salt) return false;
  try {
    const computedHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(computedHash, 'hex'), Buffer.from(hash, 'hex'));
  } catch (e) {
    return false;
  }
}

export const DatabaseService = {
  /**
   * Find a registered citizen by email, phone, or ID
   */
  async findCitizen(filter: { email?: string; phone?: string; id?: string; transactionId?: string }): Promise<CitizenRecord | null> {
    const email = filter.email?.trim().toLowerCase();
    const phone = filter.phone?.replace(/\D/g, '').slice(-10);
    const id = filter.id?.trim();
    const transactionId = filter.transactionId?.trim();

    // 1. Try Cloud MongoDB Atlas
    const db = await getMongoDb();
    if (db) {
      try {
        const query: any = {};
        const conditions: any[] = [];
        if (email) conditions.push({ email: email });
        if (phone) conditions.push({ phoneNumber: phone });
        if (transactionId) conditions.push({ 'subscription.transactionId': transactionId });
        if (id) {
          conditions.push({ id: id });
          conditions.push({ nationalIdMasked: id });
          conditions.push({ aadhaarNumberMasked: id });
        }

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
        if (transactionId && c.subscription?.transactionId === transactionId) return true;
        if (id && (c.id === id || c.nationalIdMasked === id || c.aadhaarNumberMasked === id)) return true;
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

  /**
   * Get family members for a citizen
   */
  async getFamilyMembers(filter: { email?: string; phone?: string }): Promise<any[]> {
    const email = filter.email?.trim().toLowerCase();
    const phone = filter.phone?.replace(/\D/g, '').slice(-10);
    if (!email && !phone) return [];

    const db = await getMongoDb();
    if (db) {
      try {
        const query: any = {};
        const orConditions: any[] = [];
        if (email) orConditions.push({ citizenEmail: email });
        if (phone) orConditions.push({ citizenPhone: phone });
        query.$or = orConditions;

        return await db.collection('family').find(query).toArray();
      } catch (err) {
        console.warn('MongoDB family read error:', err);
      }
    }

    const allMembers = await readJsonFile<any[]>(FAMILY_FILE, []);
    return allMembers.filter((m) => {
      if (email && m.citizenEmail?.toLowerCase() === email) return true;
      if (phone && m.citizenPhone === phone) return true;
      return false;
    });
  },

  /**
   * Save or update a family member
   */
  async saveFamilyMember(member: any): Promise<any> {
    const db = await getMongoDb();
    if (db) {
      try {
        await db.collection('family').updateOne(
          { id: member.id },
          { $set: member },
          { upsert: true }
        );
      } catch (err) {
        console.warn('MongoDB family write error:', err);
      }
    }

    const allMembers = await readJsonFile<any[]>(FAMILY_FILE, []);
    const idx = allMembers.findIndex((m) => m.id === member.id);
    if (idx >= 0) {
      allMembers[idx] = member;
    } else {
      allMembers.push(member);
    }
    await writeJsonFile(FAMILY_FILE, allMembers);
    return member;
  },

  /**
   * Delete a family member belonging to the citizen
   */
  async deleteFamilyMember(memberId: string, filter: { email?: string; phone?: string }): Promise<boolean> {
    const email = filter.email?.trim().toLowerCase();
    const phone = filter.phone?.replace(/\D/g, '').slice(-10);

    const db = await getMongoDb();
    if (db) {
      try {
        const deleteQuery: any = { id: memberId };
        const orConditions: any[] = [];
        if (email) orConditions.push({ citizenEmail: email });
        if (phone) orConditions.push({ citizenPhone: phone });
        if (orConditions.length > 0) deleteQuery.$or = orConditions;

        await db.collection('family').deleteOne(deleteQuery);
      } catch (err) {
        console.warn('MongoDB family delete error:', err);
      }
    }

    const allMembers = await readJsonFile<any[]>(FAMILY_FILE, []);
    const filtered = allMembers.filter((m) => {
      if (m.id !== memberId) return true;
      // If matches memberId, only delete if belongs to this citizen
      if (email && m.citizenEmail?.toLowerCase() === email) return false;
      if (phone && m.citizenPhone === phone) return false;
      return true;
    });
    await writeJsonFile(FAMILY_FILE, filtered);
    return true;
  },
};

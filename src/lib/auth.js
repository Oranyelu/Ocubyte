/**
 * Ocubyte Authentication & Role-Based Access Control Layer
 * Manages sessions for Super Admins and Registered Business Merchants
 */

import { supabase, isSupabaseConfigured } from './supabase';

const AUTH_STORAGE_KEY = 'ocubyte_auth_session';

// Helper: Hash password using standard browser Web Crypto API (SHA-256)
export async function hashPassword(plainText) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText.trim() + '_ocubyte_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Default Super Admin credentials
export const DEFAULT_ADMIN_EMAIL = 'admin@ocubyte.org';
const DEFAULT_ADMIN_PASS_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'; // 'OcubyteAdmin2026!'

/**
 * Get the currently logged-in user session
 */
export function getCurrentSession() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Log out of the current session
 */
export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
  if (isSupabaseConfigured && supabase) {
    supabase.auth.signOut().catch(() => {});
  }
}

/**
 * Authenticate either as an Ocubyte Super Admin or a Business Merchant
 */
export async function login({ email, password }) {
  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  const cleanEmail = email.trim().toLowerCase();
  const passHash = await hashPassword(password);

  // 1. Check if Logging In as Ocubyte Master Admin
  if (cleanEmail === DEFAULT_ADMIN_EMAIL.toLowerCase()) {
    // Verify admin password
    const expectedHash = await hashPassword('OcubyteAdmin2026!');
    if (passHash === expectedHash || password === 'OcubyteAdmin2026!') {
      const session = {
        role: 'super_admin',
        user: {
          id: 'admin_ocubyte_root',
          email: DEFAULT_ADMIN_EMAIL,
          name: 'Ocubyte Head Office Admin',
          role: 'super_admin'
        },
        loggedInAt: new Date().toISOString()
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      return { success: true, role: 'super_admin', redirectUrl: '/admin' };
    }
    return { success: false, error: 'Invalid password for Ocubyte Head Office Admin.' };
  }

  // 2. Check if Logging In as a Business Merchant
  // A. Check Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: merchant, error } = await supabase
        .from('merchants')
        .select('*')
        .eq('email', cleanEmail)
        .single();

      if (!error && merchant) {
        // If password_hash exists in DB, verify; otherwise allow initial login or match
        if (merchant.password_hash) {
          if (merchant.password_hash !== passHash) {
            return { success: false, error: 'Incorrect merchant account password.' };
          }
        } else {
          // Set password on first login
          await supabase
            .from('merchants')
            .update({ password_hash: passHash })
            .eq('id', merchant.id);
        }

        const session = {
          role: 'merchant',
          user: {
            id: merchant.id,
            email: merchant.email,
            business_name: merchant.business_name,
            merchant_code: merchant.merchant_code,
            role: 'merchant'
          },
          merchantId: merchant.id,
          loggedInAt: new Date().toISOString()
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
        return { success: true, role: 'merchant', redirectUrl: '/merchant/dashboard', merchant };
      }
    } catch (err) {
      console.warn('[Supabase Auth Check Warning]:', err.message);
    }
  }

  // B. Fallback to Local Storage Merchants Store
  const storedMerchants = JSON.parse(localStorage.getItem('ocubyte_merchants_store') || '[]');
  const localMerchant = storedMerchants.find(m => m.email?.toLowerCase() === cleanEmail);

  if (localMerchant) {
    if (localMerchant.password_hash && localMerchant.password_hash !== passHash) {
      return { success: false, error: 'Incorrect merchant account password.' };
    }

    // Save hash if not already set
    if (!localMerchant.password_hash) {
      localMerchant.password_hash = passHash;
      localStorage.setItem('ocubyte_merchants_store', JSON.stringify(storedMerchants));
    }

    const session = {
      role: 'merchant',
      user: {
        id: localMerchant.id,
        email: localMerchant.email,
        business_name: localMerchant.business_name,
        merchant_code: localMerchant.merchant_code,
        role: 'merchant'
      },
      merchantId: localMerchant.id,
      loggedInAt: new Date().toISOString()
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    return { success: true, role: 'merchant', redirectUrl: '/merchant/dashboard', merchant: localMerchant };
  }

  return { success: false, error: 'No merchant account registered with this email. Please click "Register Business" below.' };
}

/**
 * Register a new Business Merchant account with password
 */
export async function registerMerchantAccount(merchantData) {
  const { business_name, email, password, phone, bank_name, account_number, account_name } = merchantData;

  if (!business_name || !email || !password || !account_number || !account_name) {
    return { success: false, error: 'Please fill out all required registration fields.' };
  }

  if (account_number.length !== 10) {
    return { success: false, error: 'Account number must be 10 digits (Nigerian NUBAN).' };
  }

  const passHash = await hashPassword(password);
  const cleanEmail = email.trim().toLowerCase();
  const timestamp = Date.now();
  const randomSlug = Math.random().toString(36).substring(2, 6);
  const cleanCode = business_name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .substring(0, 15) + `_${randomSlug}`;

  const payload = {
    business_name: business_name.trim(),
    email: cleanEmail,
    password_hash: passHash,
    role: 'merchant',
    phone: phone?.trim() || '',
    merchant_code: cleanCode,
    public_key: `ocu_pub_live_${cleanCode}_${timestamp.toString(36)}`,
    secret_key: `ocu_sec_live_${Math.random().toString(36).substring(2, 15)}_${Date.now().toString(36)}`,
    bank_name,
    account_number: account_number.trim(),
    account_name: account_name.trim(),
    wallet_balance: 0.00,
    total_volume: 0.00,
    fee_percent: 1.50,
    status: 'active',
    created_at: new Date().toISOString()
  };

  // 1. Try Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('merchants')
        .insert([payload])
        .select()
        .single();

      if (!error && data) {
        // Auto log in
        const session = {
          role: 'merchant',
          user: {
            id: data.id,
            email: data.email,
            business_name: data.business_name,
            merchant_code: data.merchant_code,
            role: 'merchant'
          },
          merchantId: data.id,
          loggedInAt: new Date().toISOString()
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
        return { success: true, merchant: data, redirectUrl: '/merchant/dashboard' };
      }
      if (error) {
        if (error.code === '23505') {
          return { success: false, error: 'A merchant account with this email is already registered. Please Sign In.' };
        }
        console.error('[Supabase Register Error]:', error);
      }
    } catch (e) {
      console.warn('[Supabase Register Exception]:', e);
    }
  }

  // 2. Fallback to Local Storage
  const storedMerchants = JSON.parse(localStorage.getItem('ocubyte_merchants_store') || '[]');
  if (storedMerchants.some(m => m.email?.toLowerCase() === cleanEmail)) {
    return { success: false, error: 'A merchant account with this email is already registered. Please Sign In.' };
  }

  const newMerchant = { ...payload, id: `mch_${timestamp}_${randomSlug}` };
  storedMerchants.unshift(newMerchant);
  localStorage.setItem('ocubyte_merchants_store', JSON.stringify(storedMerchants));

  // Auto log in
  const session = {
    role: 'merchant',
    user: {
      id: newMerchant.id,
      email: newMerchant.email,
      business_name: newMerchant.business_name,
      merchant_code: newMerchant.merchant_code,
      role: 'merchant'
    },
    merchantId: newMerchant.id,
    loggedInAt: new Date().toISOString()
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));

  return { success: true, merchant: newMerchant, redirectUrl: '/merchant/dashboard' };
}

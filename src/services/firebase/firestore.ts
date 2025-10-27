import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

// Types based on the Supabase structure
export type TransactionCategory = 
  | 'groceries'
  | 'transport' 
  | 'entertainment'
  | 'utilities'
  | 'health'
  | 'education'
  | 'other';

export interface Period {
  id: string;
  user_id: string;
  name: string;
  start_date: string;
  end_date: string;
  budget_goal: number;
  created_at: Timestamp;
}

export interface Transaction {
  id: string;
  user_id: string;
  period_id: string;
  description?: string;
  amount: number;
  category: TransactionCategory;
  transaction_date: Timestamp;
}

export interface CreatePeriodData {
  user_id: string;
  name: string;
  start_date: string;
  end_date: string;
  budget_goal: number;
}

export interface CreateTransactionData {
  user_id: string;
  period_id: string;
  description?: string;
  amount: number;
  category: TransactionCategory;
  transaction_date?: Timestamp;
}

// Collections references
const PERIODS_COLLECTION = 'periods';
const TRANSACTIONS_COLLECTION = 'transactions';

// Period operations
export const periodsService = {
  // Get current period for a user
  async getCurrentPeriod(userId: string): Promise<Period | null> {
    try {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      const q = query(
        collection(db, PERIODS_COLLECTION),
        where('user_id', '==', userId),
        where('start_date', '<=', todayStr),
        where('end_date', '>=', todayStr)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as Period;
    } catch (error) {
      console.error('Error fetching current period:', error);
      throw new Error('Failed to fetch current period');
    }
  },

  // Create a new period
  async createPeriod(data: CreatePeriodData): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, PERIODS_COLLECTION), {
        ...data,
        created_at: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating period:', error);
      throw new Error('Failed to create period');
    }
  },

  // Get all periods for a user
  async getUserPeriods(userId: string): Promise<Period[]> {
    try {
      const q = query(
        collection(db, PERIODS_COLLECTION),
        where('user_id', '==', userId),
        orderBy('start_date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Period[];
    } catch (error) {
      console.error('Error fetching user periods:', error);
      throw new Error('Failed to fetch user periods');
    }
  }
};

// Transaction operations
export const transactionsService = {
  // Get transactions for a period
  async getTransactionsByPeriod(periodId: string): Promise<Transaction[]> {
    try {
      const q = query(
        collection(db, TRANSACTIONS_COLLECTION),
        where('period_id', '==', periodId),
        orderBy('transaction_date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new Error('Failed to fetch transactions');
    }
  },

  // Create a new transaction
  async createTransaction(data: CreateTransactionData): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, TRANSACTIONS_COLLECTION), {
        ...data,
        transaction_date: data.transaction_date || Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw new Error('Failed to create transaction');
    }
  },

  // Get transactions for a user
  async getUserTransactions(userId: string): Promise<Transaction[]> {
    try {
      const q = query(
        collection(db, TRANSACTIONS_COLLECTION),
        where('user_id', '==', userId),
        orderBy('transaction_date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      throw new Error('Failed to fetch user transactions');
    }
  }
};

// Combined dashboard data fetch
export async function fetchDashboardData(userId: string): Promise<{
  currentPeriod: Period | null;
  transactions: Transaction[];
}> {
  try {
    const currentPeriod = await periodsService.getCurrentPeriod(userId);
    
    if (!currentPeriod) {
      return { currentPeriod: null, transactions: [] };
    }
    
    const transactions = await transactionsService.getTransactionsByPeriod(currentPeriod.id);
    
    return { currentPeriod, transactions };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}
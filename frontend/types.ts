export enum Screen {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  MARKETPLACE = 'MARKETPLACE',
  WALLET = 'WALLET',
  CHAT = 'CHAT',
  CREATE_OFFER = 'CREATE_OFFER',
  PROFILE = 'PROFILE',
  MY_SWAPS = 'MY_SWAPS'
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  email?: string;
}

export interface Transaction {
  id: string;
  type: 'EARN' | 'SPEND' | 'REFUND';
  title: string;
  subtitle: string;
  amount: number;
  date: string;
}

export interface Swap {
  id: string;
  location: string;
  stall: string;
  partner: string;
  partnerAvatar: string;
  status: 'AWAITING_PICKUP' | 'MEETING' | 'COMPLETED' | 'CANCELLED';
  price: number;
  time: string;
  points?: number;
}
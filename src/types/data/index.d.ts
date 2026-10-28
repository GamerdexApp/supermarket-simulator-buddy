import {
  CATEGORIES,
  DISPLAY_TYPES,
  LOCATIONS,
} from "@/data/constants/supermarket-simulator";

export interface Market {
  products: Product[];
  furnitures: Furniture[];
  paints: Paint[];
  tools: Tool[];
  vehicles: Vehicle[];
}

export interface Management {
  licenses: License[];
  growth: Growth[];
  storage: Storage[];
  hiring: Hiring;
  customizations: Customization[];
}

export interface Bank {
  loans: Loan[];
}

export interface Loan {
  dailyInterest: number;
  originalAmount: number;
  minTermLength: number;
  maxTermLength: number;
  storeLevel: number;
}

export interface License {
  id: string;
  storeLevel: number;
  price: number;
}

export interface Growth {
  sectionNum: string;
  storeLevel: number;
  price: number;
  /** Floor area in tiles, for example "4x4". */
  size: string;
}

export interface Storage {
  sectionNum: string;
  storeLevel: number;
  price: number;
  /** Floor area in tiles, for example "4x4". */
  size: string;
}

export interface Hiring {
  cashiers: Cashier[];
  restockers: Restocker[];
  customerHelpers: CustomerHelper[];
  securityGuards: SecurityGuard[];
  janitors: Janitor[];
}

export interface Cashier {
  id: string;
  completeCheckout: number;
  storeLevel: number;
  hiringCost: number;
  dailyWage: number;
}

export interface Restocker {
  id: string;
  numberOfRacks: number;
  storeLevel: number;
  hiringCost: number;
  dailyWage: number;
}

export interface CustomerHelper {
  id: string;
  numberOfCheckouts: number;
  storeLevel: number;
  hiringCost: number;
  dailyWage: number;
}

export interface SecurityGuard {
  id: string;
  storeLevel: number;
  hiringCost: number;
  dailyWage: number;
}

export interface Janitor {
  id: string;
  storeLevel: number;
  hiringCost: number;
  dailyWage: number;
}

export interface Customization {
  name: string;
  description: string;
  price: number;
}

export interface Product {
  name: string;
  licenseId: string;
  imageUrl: string;
  company?: string;
  itemsPerBox?: number;
  weightPerBox?: number;
  boxesPerStorage: number;
  displayType: DISPLAY_TYPES;
  category?: CATEGORIES;
  bigBoxStore?: LOCATIONS | "";
}

export interface Furniture {
  name: string;
  imageUrl: string;
  unitPrice: number;
  displayPlaces?: number;
}

export interface Tool {
  name: string;
  description: string;
  unitPrice: number;
  requirement?: string;
  imageUrl: string;
}

export interface Vehicle {
  name: string;
  description: string;
  storeLevel: number;
  unitPrice: number;
  imageUrl: string;
}

export interface Paint {
  name: string;
  unitPrice: number;
  imageUrl: string;
}

import { DispatchStatus } from '@root/dispatch/constant';

export interface Dispatch {
  id: string;
  address: Address;
  passenger: Passenger;
  driver: Driver | null;
  status: DispatchStatus;
  requestedAt: Date | null;
  canceledAt: Date | null;
  matchedAt: Date | null;
  createdAt: Date;
  version: number;
}

export interface Passenger {
  id: string;
  email: string;
}

export interface Driver {
  id: string;
  email: string;
}

export interface Address {
  value: string;
}

import { LucideIcon } from 'lucide-react';

export interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  time: string;
  status: string;
  color: string;
  gradient: string;
  description: string;
  slug: string;
}

export interface EngineeringField {
  id: number;
  name: string;
  icon: LucideIcon;
  color: string;
  description: string;
  gradient: string;
}

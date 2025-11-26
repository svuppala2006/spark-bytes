import { Leaf, CheckCircle2, AlertCircle, Ban } from 'lucide-react';
import React from 'react';

import type { DietaryTag } from '@/app/types';

export const dietaryTagInfo: Record<DietaryTag, { icon: React.ReactNode; label: string; color: string }> = {
  vegetarian: { icon: <Leaf className="h-4 w-4" />, label: 'Vegetarian', color: 'bg-green-100 text-green-700' },
  vegan: { icon: <Leaf className="h-4 w-4" />, label: 'Vegan', color: 'bg-green-100 text-green-700' },
  halal: { icon: <CheckCircle2 className="h-4 w-4" />, label: 'Halal', color: 'bg-blue-100 text-blue-700' },
  kosher: { icon: <CheckCircle2 className="h-4 w-4" />, label: 'Kosher', color: 'bg-blue-100 text-blue-700' },
  'gluten-free': { icon: <AlertCircle className="h-4 w-4" />, label: 'Gluten-Free', color: 'bg-amber-100 text-amber-700' },
  'dairy-free': { icon: <AlertCircle className="h-4 w-4" />, label: 'Dairy-Free', color: 'bg-amber-100 text-amber-700' },
  'nut-free': { icon: <Ban className="h-4 w-4" />, label: 'Nut-Free', color: 'bg-red-100 text-red-700' },
  'peanut-free': { icon: <Ban className="h-4 w-4" />, label: 'Peanut-Free', color: 'bg-red-100 text-red-700' },
  'no-pork': { icon: <Ban className="h-4 w-4" />, label: 'No Pork', color: 'bg-purple-100 text-purple-700' },
};

export default dietaryTagInfo;

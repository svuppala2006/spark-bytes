"use client";

import { useState } from 'react';
import { CreateEventForm } from '../components/CreateEventForm';

export default function CreateEventPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <CreateEventForm />
      </div>
    </div>
  );
}
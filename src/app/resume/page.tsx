import type { Metadata } from 'next';
import ResumeClient from './resume-client';

export const metadata: Metadata = {
  title: 'Resume | Richard Wolff',
  description: 'Professional experience and skills of Richard Wolff, a Data Scientist with expertise in analytics and business intelligence.',
};

export default function Resume() {
  return <ResumeClient />;
} 
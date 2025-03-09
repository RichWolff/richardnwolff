import { Metadata } from 'next';
import { getResume } from '@/lib/resume';
import ResumeSection from '@/components/ResumeSection';
import SkillsSection from '@/components/SkillsSection';
import CertificationsSection from '@/components/CertificationsSection';

export const metadata: Metadata = {
  title: 'Resume | Richard Wolff',
  description: 'Professional resume and qualifications of Richard Wolff.',
};

export default async function ResumePage() {
  const resume = await getResume();
  
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Resume</h1>
      
      <div className="space-y-12">
        <ResumeSection 
          title="Experience" 
          items={resume.experience.map(exp => ({
            id: exp.id || '',
            title: exp.position,
            subtitle: exp.company,
            location: exp.location || '',
            startDate: exp.startDate,
            endDate: exp.endDate,
            description: exp.description || '',
            tags: exp.technologies
          }))}
        />
        
        <ResumeSection 
          title="Education" 
          items={resume.education.map(edu => ({
            id: edu.id || '',
            title: edu.degree,
            subtitle: edu.institution,
            location: edu.location || '',
            startDate: edu.startDate,
            endDate: edu.endDate,
            description: edu.description || '',
            tags: edu.gpa ? [`GPA: ${edu.gpa}`] : []
          }))}
        />
        
        <SkillsSection 
          title="Skills" 
          skills={resume.skills.map(skill => ({
            id: skill.id || '',
            name: skill.name,
            category: skill.category,
            proficiency: skill.proficiency || 0
          }))}
        />
        
        <CertificationsSection 
          title="Certifications" 
          certifications={resume.certifications.map(cert => ({
            id: cert.id || '',
            name: cert.name,
            issuer: cert.issuer,
            issueDate: cert.issueDate,
            expiryDate: cert.expiryDate,
            credentialId: cert.credentialId || '',
            credentialUrl: cert.credentialUrl || ''
          }))}
        />
      </div>
    </main>
  );
} 
import { format, parseISO } from 'date-fns';

type Certification = {
  id: string;
  name: string;
  issuer: string;
  issueDate: string | Date;
  expiryDate?: string | Date | null;
  credentialId?: string;
  credentialUrl?: string;
};

type CertificationsSectionProps = {
  title: string;
  certifications: Certification[];
};

export default function CertificationsSection({ title, certifications }: CertificationsSectionProps) {
  // Format date function
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return '';
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'MMMM yyyy');
  };
  
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certifications.map((cert) => (
          <div 
            key={cert.id} 
            className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{cert.name}</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">{cert.issuer}</p>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div>Issued: {formatDate(cert.issueDate)}</div>
              {cert.expiryDate && (
                <div>Expires: {formatDate(cert.expiryDate)}</div>
              )}
              {cert.credentialId && (
                <div>Credential ID: {cert.credentialId}</div>
              )}
            </div>
            
            {cert.credentialUrl && (
              <a 
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline"
              >
                View Credential
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
} 
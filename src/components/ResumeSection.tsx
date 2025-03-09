import { format, parseISO } from 'date-fns';

type ResumeItem = {
  id: string;
  title: string;
  subtitle: string;
  location?: string;
  startDate: string | Date;
  endDate?: string | Date | null;
  description?: string;
  tags?: string[];
};

type ResumeSectionProps = {
  title: string;
  items: ResumeItem[];
};

export default function ResumeSection({ title, items }: ResumeSectionProps) {
  // Format date function
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return '';
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'MMM yyyy');
  };
  
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{title}</h2>
      
      <div className="space-y-8">
        {items.map((item) => (
          <div key={item.id} className="border-l-4 border-blue-500 pl-4 py-1">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-lg text-gray-700 dark:text-gray-300">{item.subtitle}</p>
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 md:mt-0 md:text-right">
                <div className="flex items-center md:justify-end">
                  <span>
                    {formatDate(item.startDate)} - {item.endDate ? formatDate(item.endDate) : 'Present'}
                  </span>
                </div>
                {item.location && (
                  <div className="mt-1">{item.location}</div>
                )}
              </div>
            </div>
            
            {item.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-2 whitespace-pre-line">
                {item.description}
              </p>
            )}
            
            {item.tags && item.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
} 
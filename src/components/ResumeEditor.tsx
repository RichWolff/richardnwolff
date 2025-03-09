'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

type ResumeItem = {
  id: string;
  [key: string]: any;
};

type ResumeData = {
  experience: ResumeItem[];
  education: ResumeItem[];
  skills: ResumeItem[];
  certifications: ResumeItem[];
};

export default function ResumeEditor() {
  const { isAuthenticated } = useAuth();
  const [resumeData, setResumeData] = useState<ResumeData>({
    experience: [],
    education: [],
    skills: [],
    certifications: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<keyof ResumeData>('experience');
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch resume data
  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/resume');
        
        if (response.ok) {
          const data = await response.json();
          setResumeData(data);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch resume data');
        }
      } catch (error) {
        console.error('Error fetching resume data:', error);
        setError('An error occurred while fetching resume data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResumeData();
  }, []);
  
  // Reset form data when active section changes
  useEffect(() => {
    resetForm();
  }, [activeSection]);
  
  const resetForm = () => {
    // Set default form fields based on active section
    switch (activeSection) {
      case 'experience':
        setFormData({
          title: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          description: ''
        });
        break;
      case 'education':
        setFormData({
          degree: '',
          institution: '',
          location: '',
          graduationDate: '',
          description: ''
        });
        break;
      case 'skills':
        setFormData({
          name: '',
          category: ''
        });
        break;
      case 'certifications':
        setFormData({
          name: '',
          issuer: '',
          date: '',
          description: ''
        });
        break;
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('You must be logged in to update your resume');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Get auth token
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication token not found');
        setIsSubmitting(false);
        return;
      }
      
      // Add new resume item
      const response = await fetch('/api/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          section: activeSection,
          item: formData
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Update local state with new item
        setResumeData({
          ...resumeData,
          [activeSection]: [...resumeData[activeSection], data.item]
        });
        
        // Reset form
        resetForm();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to add resume item');
      }
    } catch (error) {
      console.error('Error adding resume item:', error);
      setError('An error occurred while adding the resume item');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!isAuthenticated) {
      setError('You must be logged in to update your resume');
      return;
    }
    
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }
    
    try {
      // Get auth token
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication token not found');
        return;
      }
      
      // Delete resume item
      const response = await fetch(`/api/resume/${id}?section=${activeSection}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // Update local state by removing the deleted item
        setResumeData({
          ...resumeData,
          [activeSection]: resumeData[activeSection].filter(item => item.id !== id)
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete resume item');
      }
    } catch (error) {
      console.error('Error deleting resume item:', error);
      setError('An error occurred while deleting the resume item');
    }
  };
  
  // Render form fields based on active section
  const renderFormFields = () => {
    switch (activeSection) {
      case 'experience':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Job Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company || ''}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate || ''}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Date (leave blank if current)
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
          </>
        );
      case 'education':
        return (
          <>
            <div>
              <label htmlFor="degree" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Degree / Certificate
              </label>
              <input
                type="text"
                id="degree"
                name="degree"
                value={formData.degree || ''}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="institution" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Institution
              </label>
              <input
                type="text"
                id="institution"
                name="institution"
                value={formData.institution || ''}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="graduationDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Graduation Date
              </label>
              <input
                type="date"
                id="graduationDate"
                name="graduationDate"
                value={formData.graduationDate || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
          </>
        );
      case 'skills':
        return (
          <>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Skill Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category || ''}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <option value="">Select a category</option>
                <option value="Data Science Tools">Data Science Tools</option>
                <option value="Software">Software</option>
                <option value="Business Skills">Business Skills</option>
                <option value="Programming Languages">Programming Languages</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </>
        );
      case 'certifications':
        return (
          <>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Certification Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="issuer" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Issuing Organization
              </label>
              <input
                type="text"
                id="issuer"
                name="issuer"
                value={formData.issuer || ''}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date Issued
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };
  
  // Render items based on active section
  const renderItems = () => {
    const items = resumeData[activeSection];
    
    if (items.length === 0) {
      return (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          No items found. Add your first {activeSection} item.
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            {activeSection === 'experience' && (
              <div>
                <div className="flex justify-between">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.title}</h3>
                  {isAuthenticated && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {item.company} {item.location ? `• ${item.location}` : ''}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {item.startDate} {item.endDate ? `- ${item.endDate}` : '- Present'}
                </p>
                {item.description && (
                  <p className="mt-2 text-gray-600 dark:text-gray-400">{item.description}</p>
                )}
              </div>
            )}
            
            {activeSection === 'education' && (
              <div>
                <div className="flex justify-between">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.degree}</h3>
                  {isAuthenticated && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {item.institution} {item.location ? `• ${item.location}` : ''}
                </p>
                {item.graduationDate && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Graduated: {item.graduationDate}
                  </p>
                )}
                {item.description && (
                  <p className="mt-2 text-gray-600 dark:text-gray-400">{item.description}</p>
                )}
              </div>
            )}
            
            {activeSection === 'skills' && (
              <div>
                <div className="flex justify-between">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.name}</h3>
                  {isAuthenticated && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Category: {item.category}
                </p>
              </div>
            )}
            
            {activeSection === 'certifications' && (
              <div>
                <div className="flex justify-between">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.name}</h3>
                  {isAuthenticated && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {item.issuer} {item.date ? `• ${item.date}` : ''}
                </p>
                {item.description && (
                  <p className="mt-2 text-gray-600 dark:text-gray-400">{item.description}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading resume data...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
          {error}
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        {(['experience', 'education', 'skills', 'certifications'] as const).map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-4 py-2 rounded-md ${
              activeSection === section
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Items
          </h2>
          {renderItems()}
        </div>
        
        {isAuthenticated && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Add New {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Item
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              {renderFormFields()}
              
              <div className="mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
} 
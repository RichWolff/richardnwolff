export type Education = {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type Experience = {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type Skill = {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
};

export type Resume = {
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  certifications: Certification[];
};

// Mock data for demo
let resumeData: Resume = {
  education: [
    {
      id: '1',
      institution: 'Stanford University',
      degree: 'Master of Science',
      field: 'Computer Science',
      startDate: '2018-09-01',
      endDate: '2020-06-01',
      description: 'Specialized in artificial intelligence and machine learning.'
    }
  ],
  experience: [
    {
      id: '1',
      company: 'Tech Solutions Inc.',
      position: 'Senior Data Scientist',
      location: 'San Francisco, CA',
      startDate: '2020-07-01',
      endDate: 'Present',
      description: 'Leading data science initiatives and machine learning projects.'
    }
  ],
  skills: [
    { id: '1', name: 'Python', level: 'expert' },
    { id: '2', name: 'Machine Learning', level: 'advanced' },
    { id: '3', name: 'SQL', level: 'advanced' }
  ],
  certifications: [
    {
      id: '1',
      name: 'AWS Certified Machine Learning - Specialty',
      issuer: 'Amazon Web Services',
      date: '2021-03-15',
      url: 'https://aws.amazon.com/certification/certified-machine-learning-specialty/'
    }
  ]
};

// In a real app, these would interact with a database
export function getResumeData(): Resume {
  return resumeData;
}

export function updateResumeData(newData: Resume): void {
  resumeData = newData;
}

export function addEducation(education: Omit<Education, 'id'>): Education {
  const newEducation = {
    ...education,
    id: Date.now().toString(),
  };
  resumeData.education.push(newEducation);
  return newEducation;
}

export function addExperience(experience: Omit<Experience, 'id'>): Experience {
  const newExperience = {
    ...experience,
    id: Date.now().toString(),
  };
  resumeData.experience.push(newExperience);
  return newExperience;
}

export function addSkill(skill: Omit<Skill, 'id'>): Skill {
  const newSkill = {
    ...skill,
    id: Date.now().toString(),
  };
  resumeData.skills.push(newSkill);
  return newSkill;
}

export function addCertification(certification: Omit<Certification, 'id'>): Certification {
  const newCertification = {
    ...certification,
    id: Date.now().toString(),
  };
  resumeData.certifications.push(newCertification);
  return newCertification;
} 
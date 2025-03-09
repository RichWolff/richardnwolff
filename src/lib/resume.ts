import { prisma } from './prisma';

export type Education = {
  id?: string;
  institution: string;
  degree: string;
  field: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  description?: string | null;
  location?: string | null;
  gpa?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Experience = {
  id?: string;
  company: string;
  position: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  description?: string | null;
  location?: string | null;
  technologies: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type Skill = {
  id?: string;
  name: string;
  category: string;
  proficiency?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Certification = {
  id?: string;
  name: string;
  issuer: string;
  issueDate: Date | string;
  expiryDate?: Date | string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Resume = {
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  certifications: Certification[];
};

/**
 * Get all education entries
 */
export async function getEducation(): Promise<Education[]> {
  try {
    const education = await prisma.education.findMany({
      orderBy: {
        startDate: 'desc'
      }
    });
    
    return education.map(item => ({
      ...item,
      startDate: item.startDate.toISOString(),
      endDate: item.endDate ? item.endDate.toISOString() : null
    }));
  } catch (error) {
    console.error('Error fetching education data:', error);
    return [];
  }
}

/**
 * Get all experience entries
 */
export async function getExperience(): Promise<Experience[]> {
  try {
    const experience = await prisma.experience.findMany({
      orderBy: {
        startDate: 'desc'
      }
    });
    
    return experience.map(item => ({
      ...item,
      startDate: item.startDate.toISOString(),
      endDate: item.endDate ? item.endDate.toISOString() : null
    }));
  } catch (error) {
    console.error('Error fetching experience data:', error);
    return [];
  }
}

/**
 * Get all skills
 */
export async function getSkills(): Promise<Skill[]> {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: {
        category: 'asc'
      }
    });
    
    return skills;
  } catch (error) {
    console.error('Error fetching skills data:', error);
    return [];
  }
}

/**
 * Get all certifications
 */
export async function getCertifications(): Promise<Certification[]> {
  try {
    const certifications = await prisma.certification.findMany({
      orderBy: {
        issueDate: 'desc'
      }
    });
    
    return certifications.map(item => ({
      ...item,
      issueDate: item.issueDate.toISOString(),
      expiryDate: item.expiryDate ? item.expiryDate.toISOString() : null
    }));
  } catch (error) {
    console.error('Error fetching certifications data:', error);
    return [];
  }
}

/**
 * Get the complete resume
 */
export async function getResume(): Promise<Resume> {
  const [education, experience, skills, certifications] = await Promise.all([
    getEducation(),
    getExperience(),
    getSkills(),
    getCertifications()
  ]);
  
  return {
    education,
    experience,
    skills,
    certifications
  };
}

/**
 * Add a new education entry
 */
export async function addEducation(education: Omit<Education, 'id'>): Promise<Education> {
  try {
    const newEducation = await prisma.education.create({
      data: {
        institution: education.institution,
        degree: education.degree,
        field: education.field,
        startDate: new Date(education.startDate),
        endDate: education.endDate ? new Date(education.endDate) : null,
        description: education.description,
        location: education.location,
        gpa: education.gpa
      }
    });
    
    return {
      ...newEducation,
      startDate: newEducation.startDate.toISOString(),
      endDate: newEducation.endDate ? newEducation.endDate.toISOString() : null
    };
  } catch (error) {
    console.error('Error adding education:', error);
    throw new Error('Failed to add education');
  }
}

/**
 * Add a new experience entry
 */
export async function addExperience(experience: Omit<Experience, 'id'>): Promise<Experience> {
  try {
    const newExperience = await prisma.experience.create({
      data: {
        company: experience.company,
        position: experience.position,
        startDate: new Date(experience.startDate),
        endDate: experience.endDate ? new Date(experience.endDate) : null,
        description: experience.description,
        location: experience.location,
        technologies: experience.technologies
      }
    });
    
    return {
      ...newExperience,
      startDate: newExperience.startDate.toISOString(),
      endDate: newExperience.endDate ? newExperience.endDate.toISOString() : null
    };
  } catch (error) {
    console.error('Error adding experience:', error);
    throw new Error('Failed to add experience');
  }
}

/**
 * Add a new skill
 */
export async function addSkill(skill: Omit<Skill, 'id'>): Promise<Skill> {
  try {
    const newSkill = await prisma.skill.create({
      data: {
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency
      }
    });
    
    return newSkill;
  } catch (error) {
    console.error('Error adding skill:', error);
    throw new Error('Failed to add skill');
  }
}

/**
 * Add a new certification
 */
export async function addCertification(certification: Omit<Certification, 'id'>): Promise<Certification> {
  try {
    const newCertification = await prisma.certification.create({
      data: {
        name: certification.name,
        issuer: certification.issuer,
        issueDate: new Date(certification.issueDate),
        expiryDate: certification.expiryDate ? new Date(certification.expiryDate) : null,
        credentialId: certification.credentialId,
        credentialUrl: certification.credentialUrl
      }
    });
    
    return {
      ...newCertification,
      issueDate: newCertification.issueDate.toISOString(),
      expiryDate: newCertification.expiryDate ? newCertification.expiryDate.toISOString() : null
    };
  } catch (error) {
    console.error('Error adding certification:', error);
    throw new Error('Failed to add certification');
  }
}

/**
 * Update an education entry
 */
export async function updateEducation(id: string, education: Partial<Education>): Promise<Education> {
  try {
    const data: any = { ...education };
    
    // Convert date strings to Date objects
    if (education.startDate) {
      data.startDate = new Date(education.startDate);
    }
    
    if (education.endDate) {
      data.endDate = new Date(education.endDate);
    } else if (education.endDate === null) {
      data.endDate = null;
    }
    
    const updatedEducation = await prisma.education.update({
      where: { id },
      data
    });
    
    return {
      ...updatedEducation,
      startDate: updatedEducation.startDate.toISOString(),
      endDate: updatedEducation.endDate ? updatedEducation.endDate.toISOString() : null
    };
  } catch (error) {
    console.error('Error updating education:', error);
    throw new Error('Failed to update education');
  }
}

/**
 * Update an experience entry
 */
export async function updateExperience(id: string, experience: Partial<Experience>): Promise<Experience> {
  try {
    const data: any = { ...experience };
    
    // Convert date strings to Date objects
    if (experience.startDate) {
      data.startDate = new Date(experience.startDate);
    }
    
    if (experience.endDate) {
      data.endDate = new Date(experience.endDate);
    } else if (experience.endDate === null) {
      data.endDate = null;
    }
    
    const updatedExperience = await prisma.experience.update({
      where: { id },
      data
    });
    
    return {
      ...updatedExperience,
      startDate: updatedExperience.startDate.toISOString(),
      endDate: updatedExperience.endDate ? updatedExperience.endDate.toISOString() : null
    };
  } catch (error) {
    console.error('Error updating experience:', error);
    throw new Error('Failed to update experience');
  }
}

/**
 * Delete an education entry
 */
export async function deleteEducation(id: string): Promise<void> {
  try {
    await prisma.education.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting education:', error);
    throw new Error('Failed to delete education');
  }
}

/**
 * Delete an experience entry
 */
export async function deleteExperience(id: string): Promise<void> {
  try {
    await prisma.experience.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting experience:', error);
    throw new Error('Failed to delete experience');
  }
}

/**
 * Delete a skill
 */
export async function deleteSkill(id: string): Promise<void> {
  try {
    await prisma.skill.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting skill:', error);
    throw new Error('Failed to delete skill');
  }
}

/**
 * Delete a certification
 */
export async function deleteCertification(id: string): Promise<void> {
  try {
    await prisma.certification.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting certification:', error);
    throw new Error('Failed to delete certification');
  }
} 
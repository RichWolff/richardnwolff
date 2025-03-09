// Seed script for resume data
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting resume data seeding...');
  
  // Clear existing data
  await prisma.education.deleteMany({});
  await prisma.experience.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.certification.deleteMany({});
  
  console.log('Cleared existing resume data');
  
  // Seed education data
  const education = await prisma.education.createMany({
    data: [
      {
        institution: 'Stanford University',
        degree: 'Master of Science',
        field: 'Computer Science',
        startDate: new Date('2018-09-01'),
        endDate: new Date('2020-06-01'),
        description: 'Specialized in artificial intelligence and machine learning.',
        location: 'Stanford, CA'
      },
      {
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: new Date('2014-09-01'),
        endDate: new Date('2018-05-01'),
        description: 'Focus on software engineering and data structures.',
        location: 'Berkeley, CA',
        gpa: '3.8/4.0'
      }
    ]
  });
  
  // Seed experience data
  const experience = await prisma.experience.createMany({
    data: [
      {
        company: 'Tech Solutions Inc.',
        position: 'Senior Data Scientist',
        startDate: new Date('2020-07-01'),
        endDate: null, // Current position
        description: 'Leading data science initiatives and machine learning projects.',
        location: 'San Francisco, CA',
        technologies: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'AWS']
      },
      {
        company: 'Data Innovations LLC',
        position: 'Machine Learning Engineer',
        startDate: new Date('2018-06-01'),
        endDate: new Date('2020-06-30'),
        description: 'Developed and deployed machine learning models for production use.',
        location: 'Palo Alto, CA',
        technologies: ['Python', 'Scikit-learn', 'Keras', 'Docker', 'GCP']
      }
    ]
  });
  
  // Seed skills data
  const skills = await prisma.skill.createMany({
    data: [
      {
        name: 'Python',
        category: 'Programming Languages',
        proficiency: 95
      },
      {
        name: 'Machine Learning',
        category: 'Data Science',
        proficiency: 90
      },
      {
        name: 'SQL',
        category: 'Database',
        proficiency: 85
      },
      {
        name: 'TensorFlow',
        category: 'Frameworks',
        proficiency: 80
      },
      {
        name: 'PyTorch',
        category: 'Frameworks',
        proficiency: 75
      },
      {
        name: 'JavaScript',
        category: 'Programming Languages',
        proficiency: 70
      },
      {
        name: 'React',
        category: 'Frameworks',
        proficiency: 65
      },
      {
        name: 'Next.js',
        category: 'Frameworks',
        proficiency: 60
      }
    ]
  });
  
  // Seed certifications data
  const certifications = await prisma.certification.createMany({
    data: [
      {
        name: 'AWS Certified Machine Learning - Specialty',
        issuer: 'Amazon Web Services',
        issueDate: new Date('2021-03-15'),
        expiryDate: new Date('2024-03-15'),
        credentialId: 'AWS-ML-12345',
        credentialUrl: 'https://aws.amazon.com/certification/certified-machine-learning-specialty/'
      },
      {
        name: 'TensorFlow Developer Certificate',
        issuer: 'Google',
        issueDate: new Date('2020-05-10'),
        expiryDate: null,
        credentialId: 'TF-DEV-67890',
        credentialUrl: 'https://www.tensorflow.org/certificate'
      }
    ]
  });
  
  console.log('Resume data seeded successfully!');
  console.log(`Added ${education.count} education entries`);
  console.log(`Added ${experience.count} experience entries`);
  console.log(`Added ${skills.count} skills`);
  console.log(`Added ${certifications.count} certifications`);
}

main()
  .catch((e) => {
    console.error('Error seeding resume data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
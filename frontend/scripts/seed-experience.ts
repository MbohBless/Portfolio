import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding work experience data...')

  const experiences = [
    {
      company: 'Tech Innovations Inc.',
      position: 'Senior AI Engineer',
      location: 'San Francisco, CA',
      startDate: new Date('2022-01-15'),
      endDate: null,
      current: true,
      description:
        'Leading the development of next-generation AI systems and machine learning models. Architecting scalable solutions that process millions of data points daily.',
      achievements: [
        'Developed a machine learning pipeline that improved model accuracy by 35%',
        'Led a team of 5 engineers to deliver a real-time recommendation system',
        'Reduced infrastructure costs by 40% through optimization of ML workflows',
        'Presented research findings at 3 international AI conferences',
      ],
      technologies: [
        'Python',
        'TensorFlow',
        'PyTorch',
        'AWS',
        'Docker',
        'Kubernetes',
        'PostgreSQL',
        'Redis',
      ],
      companyUrl: 'https://example.com',
      displayOrder: 0,
      published: true,
    },
    {
      company: 'DataFlow Solutions',
      position: 'Machine Learning Engineer',
      location: 'Remote',
      startDate: new Date('2020-03-01'),
      endDate: new Date('2021-12-31'),
      current: false,
      description:
        'Built and deployed machine learning models for predictive analytics and natural language processing applications.',
      achievements: [
        'Implemented NLP models that increased customer sentiment analysis accuracy by 28%',
        'Developed automated data preprocessing pipelines reducing manual work by 60%',
        'Collaborated with cross-functional teams to integrate ML solutions into production',
      ],
      technologies: ['Python', 'scikit-learn', 'SpaCy', 'FastAPI', 'MongoDB', 'React', 'TypeScript'],
      companyUrl: 'https://example.com',
      displayOrder: 1,
      published: true,
    },
    {
      company: 'CloudTech Startups',
      position: 'Full Stack Developer',
      location: 'New York, NY',
      startDate: new Date('2018-06-15'),
      endDate: new Date('2020-02-28'),
      current: false,
      description:
        'Developed full-stack web applications using modern JavaScript frameworks and cloud technologies.',
      achievements: [
        'Built a SaaS platform serving 10,000+ active users',
        'Improved application performance by 50% through code optimization',
        'Implemented CI/CD pipelines reducing deployment time by 70%',
        'Mentored 3 junior developers on best practices and architecture',
      ],
      technologies: ['React', 'Node.js', 'Express', 'PostgreSQL', 'AWS', 'Docker', 'Git'],
      companyUrl: null,
      displayOrder: 2,
      published: true,
    },
  ]

  for (const exp of experiences) {
    await prisma.workExperience.create({
      data: exp,
    })
    console.log(`✅ Created experience: ${exp.position} at ${exp.company}`)
  }

  console.log('✨ Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

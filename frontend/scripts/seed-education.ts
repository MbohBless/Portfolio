import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🎓 Seeding education data...')

  const education = [
    {
      institution: 'Stanford University',
      degree: 'Master of Science',
      fieldOfStudy: 'Artificial Intelligence',
      location: 'Stanford, CA',
      startDate: new Date('2020-09-01'),
      endDate: new Date('2022-06-15'),
      current: false,
      grade: '3.95 GPA',
      description:
        'Specialized in deep learning, natural language processing, and computer vision. Conducted research on transformer architectures and their applications.',
      achievements: [
        'Graduated with Distinction',
        'Published 2 papers in top-tier AI conferences (NeurIPS, ICML)',
        'Teaching Assistant for CS229 (Machine Learning)',
        'Stanford AI Lab Research Grant Recipient',
      ],
      courses: [
        'Deep Learning',
        'Natural Language Processing',
        'Computer Vision',
        'Probabilistic Graphical Models',
        'Reinforcement Learning',
        'Advanced Topics in AI',
      ],
      institutionUrl: 'https://www.stanford.edu',
      displayOrder: 0,
      published: true,
    },
    {
      institution: 'Massachusetts Institute of Technology',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science and Engineering',
      location: 'Cambridge, MA',
      startDate: new Date('2016-09-01'),
      endDate: new Date('2020-06-01'),
      current: false,
      grade: '3.9 GPA',
      description:
        'Focused on algorithms, systems, and artificial intelligence. Completed undergraduate thesis on optimization algorithms for neural networks.',
      achievements: [
        'Summa Cum Laude honors',
        'Dean\'s List all 8 semesters',
        'President of MIT AI Club',
        'Winner of MIT Hackathon 2019',
        'Undergraduate Research Opportunities Program (UROP) participant',
      ],
      courses: [
        'Algorithms & Data Structures',
        'Operating Systems',
        'Database Systems',
        'Introduction to Machine Learning',
        'Linear Algebra',
        'Discrete Mathematics',
        'Software Engineering',
      ],
      institutionUrl: 'https://www.mit.edu',
      displayOrder: 1,
      published: true,
    },
  ]

  for (const edu of education) {
    await prisma.education.create({
      data: edu,
    })
    console.log(`✅ Created education: ${edu.degree} in ${edu.fieldOfStudy} from ${edu.institution}`)
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

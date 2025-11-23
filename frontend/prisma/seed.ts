import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with sample data...')

  // Delete existing profile if any (singleton pattern)
  await prisma.profile.deleteMany({})

  // Create sample profile
  await prisma.profile.create({
    data: {
      name: 'Alex Johnson',
      title: 'AI Engineer & Software Developer',
      bio: 'Passionate about building intelligent systems and scalable software solutions. Specialized in machine learning, deep learning, and modern web technologies.',
      email: 'demo@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      heroTitle: 'AI Engineer & Software Developer',
      heroSubtitle: 'Building intelligent systems and scalable software solutions.',
      availableForWork: true,
      githubUrl: 'https://github.com/yourusername',
      linkedinUrl: 'https://linkedin.com/in/yourusername',
      twitterUrl: 'https://twitter.com/yourusername',
    },
  })
  console.log('✅ Profile created')

  // Create sample projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        slug: 'scalable-ml-pipeline',
        title: 'Scalable ML Pipeline',
        description: 'A production-ready machine learning pipeline for real-time inference at scale with <1ms latency. Features automatic model versioning, distributed training on Kubernetes, and A/B testing framework.',
        techStack: ['Python', 'PyTorch', 'Kubernetes', 'Redis', 'FastAPI'],
        published: true,
        displayOrder: 1,
        githubUrl: 'https://github.com/yourusername/ml-pipeline',
        demoUrl: 'https://demo.example.com',
      },
    }),
    prisma.project.create({
      data: {
        slug: 'transformer-optimization',
        title: 'Transformer Model Optimization',
        description: 'Optimized transformer models for edge devices with 10x speedup. Reduced model size by 80% with minimal accuracy loss, deployed to 1M+ devices in production.',
        techStack: ['PyTorch', 'ONNX', 'TensorRT', 'C++'],
        published: true,
        displayOrder: 2,
      },
    }),
    prisma.project.create({
      data: {
        slug: 'realtime-anomaly-detection',
        title: 'Real-time Anomaly Detection',
        description: 'Distributed anomaly detection system processing 1M+ events per second using streaming data pipelines and time-series analysis.',
        techStack: ['Apache Kafka', 'Apache Flink', 'Python', 'TimescaleDB'],
        published: true,
        displayOrder: 3,
      },
    }),
  ])
  console.log('Sample projects created')

  // Create sample blog posts
  const blogPosts = await Promise.all([
    prisma.blogPost.create({
      data: {
        slug: 'building-scalable-ai-systems',
        title: 'Building Scalable AI Systems: Lessons from Production',
        excerpt: 'A deep dive into the architectural decisions and best practices for deploying machine learning models at scale in production environments.',
        content: `# Building Scalable AI Systems

Deploying ML models in production is challenging. Here's what I learned.

## Key Principles

1. **Model versioning is critical**
2. **Monitor everything**
3. **Plan for failures**

\`\`\`python
# Example monitoring setup
from prometheus_client import Counter

predictions = Counter('model_predictions_total', 'Total predictions')
\`\`\``,
        published: true,
        publishedAt: new Date('2024-11-15'),
        tags: ['AI', 'Machine Learning', 'Engineering'],
        readingTime: 8,
      },
    }),
    prisma.blogPost.create({
      data: {
        slug: 'transformer-attention-mechanisms',
        title: 'Understanding Transformer Attention Mechanisms',
        excerpt: 'An intuitive explanation of how attention mechanisms work in transformer models, with visual examples and code implementations.',
        content: `# Understanding Transformer Attention

Attention mechanisms are the core of modern NLP models.

## Self-Attention

The key insight is allowing the model to focus on relevant parts of the input.`,
        published: true,
        publishedAt: new Date('2024-10-28'),
        tags: ['Deep Learning', 'NLP', 'Transformers'],
        readingTime: 12,
      },
    }),
  ])
  console.log('Sample blog posts created')

  // Create sample publications
  const publications = await Promise.all([
    prisma.publication.create({
      data: {
        slug: 'efficient-transformer-architectures',
        title: 'Efficient Transformer Architectures for Natural Language Understanding',
        authors: ['Alex Johnson', 'Jane Smith', 'John Doe'],
        venue: 'Neural Information Processing Systems (NeurIPS)',
        year: 2024,
        abstract: 'We propose a novel transformer architecture that achieves state-of-the-art results while reducing computational cost by 40%. Our method combines sparse attention mechanisms with efficient positional encodings.',
        tags: ['Deep Learning', 'NLP', 'Transformers'],
        published: true,
      },
    }),
    prisma.publication.create({
      data: {
        slug: 'multi-modal-learning',
        title: 'Multi-Modal Learning for Visual Question Answering',
        authors: ['Alex Johnson', 'Alice Brown'],
        venue: 'International Conference on Machine Learning (ICML)',
        year: 2023,
        abstract: 'A novel approach to visual question answering that jointly learns representations from images and text, achieving 15% improvement over previous baselines.',
        tags: ['Computer Vision', 'NLP', 'Multi-modal'],
        published: true,
      },
    }),
  ])
  console.log(' Sample publications created')

  // Create sample work experience
  const workExperience = await Promise.all([
    prisma.workExperience.create({
      data: {
        position: 'Senior AI Engineer',
        company: 'TechCorp AI',
        location: 'San Francisco, CA',
        startDate: new Date('2022-01-01'),
        current: true,
        description: 'Leading the development of production ML systems serving millions of users.',
        achievements: [
          'Built scalable ML pipeline processing 100M+ predictions/day',
          'Reduced model inference latency by 60%',
          'Led team of 5 engineers',
        ],
        technologies: ['Python', 'PyTorch', 'Kubernetes', 'AWS'],
        published: true,
        displayOrder: 1,
      },
    }),
    prisma.workExperience.create({
      data: {
        position: 'Machine Learning Engineer',
        company: 'StartupAI',
        location: 'Remote',
        startDate: new Date('2020-06-01'),
        endDate: new Date('2021-12-31'),
        current: false,
        description: 'Developed and deployed computer vision models for autonomous systems.',
        achievements: [
          'Implemented real-time object detection system',
          'Published research paper at CVPR',
        ],
        technologies: ['TensorFlow', 'Python', 'Docker', 'GCP'],
        published: true,
        displayOrder: 2,
      },
    }),
  ])
  console.log('Sample work experience created')

  // Create sample education
  const education = await Promise.all([
    prisma.education.create({
      data: {
        degree: 'M.S. in Computer Science',
        institution: 'Stanford University',
        fieldOfStudy: 'Artificial Intelligence',
        location: 'Stanford, CA',
        startDate: new Date('2018-09-01'),
        endDate: new Date('2020-06-01'),
        grade: '3.9 GPA',
        description: 'Focus on machine learning, deep learning, and natural language processing.',
        achievements: [
          'Teaching Assistant for CS229 (Machine Learning)',
          'Published 2 papers in top-tier conferences',
        ],
        courses: [
          'Deep Learning',
          'Natural Language Processing',
          'Computer Vision',
          'Reinforcement Learning',
        ],
        published: true,
        displayOrder: 1,
      },
    }),
    prisma.education.create({
      data: {
        degree: 'B.S. in Computer Science',
        institution: 'UC Berkeley',
        fieldOfStudy: 'Computer Science',
        location: 'Berkeley, CA',
        startDate: new Date('2014-08-01'),
        endDate: new Date('2018-05-01'),
        grade: 'Summa Cum Laude',
        published: true,
        displayOrder: 2,
      },
    }),
  ])
  console.log(' Sample education created')

  // Create sample skills
  const skills = await Promise.all([
    // Programming Languages
    prisma.skill.create({
      data: {
        name: 'Python',
        category: 'Programming Languages',
        proficiency: 95,
        description: 'Expert in Python for ML, data science, and backend development',
        published: true,
        displayOrder: 1,
      },
    }),
    prisma.skill.create({
      data: {
        name: 'TypeScript',
        category: 'Programming Languages',
        proficiency: 90,
        description: 'Full-stack development with TypeScript and Node.js',
        published: true,
        displayOrder: 2,
      },
    }),
    // Machine Learning
    prisma.skill.create({
      data: {
        name: 'PyTorch',
        category: 'Machine Learning',
        proficiency: 95,
        description: 'Deep learning model development and deployment',
        published: true,
        displayOrder: 1,
      },
    }),
    prisma.skill.create({
      data: {
        name: 'TensorFlow',
        category: 'Machine Learning',
        proficiency: 85,
        description: 'Production ML pipelines and model serving',
        published: true,
        displayOrder: 2,
      },
    }),
    // Tools
    prisma.skill.create({
      data: {
        name: 'Docker',
        category: 'Tools & Infrastructure',
        proficiency: 90,
        description: 'Containerization and orchestration',
        published: true,
        displayOrder: 1,
      },
    }),
    prisma.skill.create({
      data: {
        name: 'Kubernetes',
        category: 'Tools & Infrastructure',
        proficiency: 85,
        description: 'Container orchestration and deployment',
        published: true,
        displayOrder: 2,
      },
    }),
  ])
  console.log(' Sample skills created')

  console.log(' Database seeded successfully!')
  console.log('\n Sample data created:')
  console.log(`   - 1 Profile`)
  console.log(`   - ${projects.length} Projects`)
  console.log(`   - ${blogPosts.length} Blog Posts`)
  console.log(`   - ${publications.length} Publications`)
  console.log(`   - ${workExperience.length} Work Experience entries`)
  console.log(`   - ${education.length} Education entries`)
  console.log(`   - ${skills.length} Skills`)
  console.log('\n You can now view the sample data at http://localhost:3000')
  console.log(' Note: You still need to create an admin account at /admin/signup')
}

main()
  .catch((e) => {
    console.error(' Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

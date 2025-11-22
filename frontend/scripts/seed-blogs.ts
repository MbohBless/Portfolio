import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('✍️  Seeding blog posts data...')

  const blogPosts = [
    {
      title: 'Building Scalable AI Systems: Lessons from Production',
      slug: 'building-scalable-ai-systems',
      excerpt:
        'A deep dive into the architectural decisions and best practices for deploying machine learning models at scale in production environments.',
      contentUrl: null,
      coverImageUrl: null,
      tags: ['AI', 'Machine Learning', 'Engineering', 'Scalability'],
      published: true,
      publishedAt: new Date('2024-11-15'),
      readingTime: 8,
    },
    {
      title: 'Understanding Transformer Attention Mechanisms',
      slug: 'transformer-attention-mechanisms',
      excerpt:
        'An intuitive explanation of how attention mechanisms work in transformer models, with visual examples and code implementations.',
      contentUrl: null,
      coverImageUrl: null,
      tags: ['Deep Learning', 'NLP', 'Transformers', 'Tutorial'],
      published: true,
      publishedAt: new Date('2024-10-28'),
      readingTime: 12,
    },
    {
      title: 'From Research to Production: Deploying ML Models',
      slug: 'ml-models-production',
      excerpt:
        'A practical guide on bridging the gap between research prototypes and production-ready machine learning systems.',
      contentUrl: null,
      coverImageUrl: null,
      tags: ['MLOps', 'Deployment', 'Best Practices', 'Engineering'],
      published: true,
      publishedAt: new Date('2024-10-05'),
      readingTime: 10,
    },
    {
      title: 'The State of Generative AI in 2024',
      slug: 'state-of-generative-ai-2024',
      excerpt:
        'An overview of the latest developments in generative AI, including diffusion models, large language models, and their applications.',
      contentUrl: null,
      coverImageUrl: null,
      tags: ['Generative AI', 'LLMs', 'Diffusion Models', 'AI Trends'],
      published: true,
      publishedAt: new Date('2024-09-20'),
      readingTime: 15,
    },
    {
      title: 'Optimizing Neural Networks for Edge Devices',
      slug: 'optimizing-neural-networks-edge',
      excerpt:
        'Techniques for model compression, quantization, and optimization to run deep learning models efficiently on resource-constrained devices.',
      contentUrl: null,
      coverImageUrl: null,
      tags: ['Edge AI', 'Optimization', 'Mobile ML', 'Performance'],
      published: true,
      publishedAt: new Date('2024-08-12'),
      readingTime: 9,
    },
    {
      title: 'Introduction to Reinforcement Learning: Concepts and Applications',
      slug: 'intro-reinforcement-learning',
      excerpt:
        'A beginner-friendly introduction to reinforcement learning, covering fundamental concepts, algorithms, and real-world use cases.',
      contentUrl: null,
      coverImageUrl: null,
      tags: ['Reinforcement Learning', 'AI', 'Tutorial', 'Beginner'],
      published: true,
      publishedAt: new Date('2024-07-18'),
      readingTime: 11,
    },
  ]

  for (const post of blogPosts) {
    await prisma.blogPost.create({
      data: post,
    })
    console.log(`✅ Created blog post: ${post.title}`)
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

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Seeding projects data...')

  const projects = [
    {
      title: 'Neural Style Transfer Platform',
      slug: 'neural-style-transfer',
      description:
        'A web-based platform for applying artistic styles to images using deep learning. Built with PyTorch and FastAPI backend, React frontend, allowing users to transform photos with styles from famous artworks in real-time.',
      techStack: ['Python', 'PyTorch', 'FastAPI', 'React', 'TypeScript', 'Docker', 'AWS'],
      githubUrl: 'https://github.com/example/neural-style-transfer',
      demoUrl: 'https://style-transfer-demo.example.com',
      thumbnailUrl: null,
      images: [],
      published: true,
      displayOrder: 0,
    },
    {
      title: 'Real-Time Object Detection API',
      slug: 'realtime-object-detection',
      description:
        'High-performance REST API for real-time object detection using YOLOv8. Processes video streams and images with sub-100ms latency. Includes model optimization with TensorRT and supports batch processing for improved throughput.',
      techStack: ['Python', 'YOLOv8', 'TensorRT', 'FastAPI', 'Redis', 'Docker', 'CUDA'],
      githubUrl: 'https://github.com/example/object-detection-api',
      demoUrl: null,
      thumbnailUrl: null,
      images: [],
      published: true,
      displayOrder: 1,
    },
    {
      title: 'Conversational AI Chatbot',
      slug: 'conversational-ai-chatbot',
      description:
        'Advanced chatbot powered by fine-tuned language models for customer support automation. Features context-aware responses, multi-turn conversations, and integration with popular messaging platforms. Achieved 85% resolution rate on common queries.',
      techStack: [
        'Python',
        'Transformers',
        'LangChain',
        'PostgreSQL',
        'FastAPI',
        'React',
        'WebSocket',
      ],
      githubUrl: 'https://github.com/example/ai-chatbot',
      demoUrl: 'https://chatbot-demo.example.com',
      thumbnailUrl: null,
      images: [],
      published: true,
      displayOrder: 2,
    },
    {
      title: 'Sentiment Analysis Dashboard',
      slug: 'sentiment-analysis-dashboard',
      description:
        'Interactive dashboard for analyzing sentiment trends from social media data. Processes millions of tweets daily using distributed computing. Features real-time visualization, topic modeling, and predictive analytics.',
      techStack: ['Python', 'Spark', 'BERT', 'MongoDB', 'D3.js', 'Flask', 'Kafka', 'Docker'],
      githubUrl: 'https://github.com/example/sentiment-dashboard',
      demoUrl: 'https://sentiment-demo.example.com',
      thumbnailUrl: null,
      images: [],
      published: true,
      displayOrder: 3,
    },
    {
      title: 'Automated Code Review Assistant',
      slug: 'code-review-assistant',
      description:
        'AI-powered tool that automatically reviews pull requests and suggests improvements. Uses fine-tuned code models to detect bugs, security issues, and style violations. Integrates seamlessly with GitHub and GitLab.',
      techStack: ['Python', 'CodeBERT', 'GitHub API', 'FastAPI', 'PostgreSQL', 'TypeScript', 'Next.js'],
      githubUrl: 'https://github.com/example/code-review-ai',
      demoUrl: null,
      thumbnailUrl: null,
      images: [],
      published: true,
      displayOrder: 4,
    },
    {
      title: 'Medical Image Segmentation Tool',
      slug: 'medical-image-segmentation',
      description:
        'Deep learning application for automated segmentation of medical images (CT scans, MRI). Uses U-Net architecture with attention mechanisms. Helps radiologists identify and measure anatomical structures with 94% accuracy.',
      techStack: ['Python', 'PyTorch', 'U-Net', 'OpenCV', 'Flask', 'Vue.js', 'PostgreSQL'],
      githubUrl: 'https://github.com/example/medical-segmentation',
      demoUrl: null,
      thumbnailUrl: null,
      images: [],
      published: true,
      displayOrder: 5,
    },
  ]

  for (const project of projects) {
    await prisma.project.create({
      data: project,
    })
    console.log(`✅ Created project: ${project.title}`)
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

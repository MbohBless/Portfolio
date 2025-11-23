import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('📚 Seeding publications data...')

  const publications = [
    {
      title: 'Efficient Transformer Architectures for Natural Language Understanding',
      slug: 'efficient-transformers-nlu',
      authors: ['Mboh Bless Pearl N', 'Jane Smith', 'John Doe'],
      year: 2024,
      venue: 'Neural Information Processing Systems (NeurIPS)',
      doi: '10.48550/arXiv.2024.12345',
      arxivId: '2024.12345',
      pdfUrl: 'https://arxiv.org/pdf/2024.12345',
      abstract:
        'We propose a novel transformer architecture that reduces computational complexity while maintaining state-of-the-art performance on natural language understanding tasks. Our approach introduces sparse attention mechanisms and adaptive layer normalization, achieving 40% reduction in training time with comparable accuracy to BERT-large on GLUE benchmarks.',
      tags: ['Deep Learning', 'NLP', 'Transformers', 'Efficiency'],
      published: true,
    },
    {
      title: 'Multi-Modal Learning for Visual Question Answering',
      slug: 'multimodal-vqa',
      authors: ['Mboh Bless Pearl N', 'Alice Johnson'],
      year: 2023,
      venue: 'International Conference on Machine Learning (ICML)',
      doi: '10.48550/arXiv.2023.67890',
      arxivId: '2023.67890',
      pdfUrl: 'https://arxiv.org/pdf/2023.67890',
      abstract:
        'This paper presents a novel multi-modal learning framework that effectively combines visual and textual information for visual question answering. We introduce cross-attention mechanisms and hierarchical reasoning modules that achieve new state-of-the-art results on VQA v2.0 and GQA datasets.',
      tags: ['Computer Vision', 'Multi-Modal Learning', 'VQA', 'Deep Learning'],
      published: true,
    },
    {
      title: 'Reinforcement Learning for Autonomous Navigation in Complex Environments',
      slug: 'rl-autonomous-navigation',
      authors: ['Mboh Bless Pearl N', 'Robert Chen', 'Sarah Williams'],
      year: 2023,
      venue: 'Conference on Robot Learning (CoRL)',
      doi: '10.48550/arXiv.2023.11111',
      arxivId: '2023.11111',
      pdfUrl: 'https://arxiv.org/pdf/2023.11111',
      abstract:
        'We develop a reinforcement learning approach for autonomous robot navigation in complex, dynamic environments. Our method combines hierarchical planning with learned obstacle avoidance policies, demonstrating robust performance in both simulated and real-world scenarios.',
      tags: ['Reinforcement Learning', 'Robotics', 'Navigation', 'AI'],
      published: true,
    },
    {
      title: 'Few-Shot Learning with Meta-Learning and Data Augmentation',
      slug: 'few-shot-meta-learning',
      authors: ['Mboh Bless Pearl N', 'Emily Davis'],
      year: 2022,
      venue: 'IEEE Conference on Computer Vision and Pattern Recognition (CVPR)',
      doi: '10.48550/arXiv.2022.22222',
      arxivId: '2022.22222',
      pdfUrl: 'https://arxiv.org/pdf/2022.22222',
      abstract:
        'This work explores the combination of meta-learning algorithms with advanced data augmentation techniques for few-shot image classification. We show that our approach achieves competitive results on miniImageNet and tieredImageNet with significantly fewer training examples than traditional methods.',
      tags: ['Meta-Learning', 'Few-Shot Learning', 'Computer Vision'],
      published: true,
    },
  ]

  for (const pub of publications) {
    await prisma.publication.create({
      data: pub,
    })
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

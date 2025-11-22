-- Sample Data for Portfolio
-- Run this in Prisma Studio or via SQL to populate your portfolio with example data

-- Insert sample projects
INSERT INTO projects (
  id, title, slug, description, tech_stack, github_url, demo_url, 
  thumbnail_url, published, display_order, created_at, updated_at
) VALUES
(
  gen_random_uuid(),
  'AI-Powered Code Assistant',
  'ai-code-assistant',
  'An intelligent code completion and refactoring tool built with GPT-4 and TypeScript. Features real-time suggestions, automatic documentation, and smart refactoring capabilities.',
  ARRAY['Python', 'TypeScript', 'OpenAI API', 'React', 'FastAPI'],
  'https://github.com/yourusername/ai-code-assistant',
  'https://demo.example.com',
  NULL,
  true,
  1,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Distributed Machine Learning Platform',
  'ml-platform',
  'Scalable ML training platform supporting distributed computing, automatic hyperparameter tuning, and model versioning. Built for production workloads.',
  ARRAY['Python', 'TensorFlow', 'Kubernetes', 'Docker', 'Redis'],
  'https://github.com/yourusername/ml-platform',
  NULL,
  NULL,
  true,
  2,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Real-Time Data Pipeline',
  'data-pipeline',
  'High-throughput data processing pipeline handling millions of events per second. Features real-time analytics and automated data quality checks.',
  ARRAY['Apache Kafka', 'Spark', 'Python', 'PostgreSQL', 'Grafana'],
  'https://github.com/yourusername/data-pipeline',
  NULL,
  NULL,
  true,
  3,
  NOW(),
  NOW()
);

-- Insert sample publications
INSERT INTO publications (
  id, title, slug, authors, year, venue, doi, arxiv_id, pdf_url,
  abstract, tags, published, created_at, updated_at
) VALUES
(
  gen_random_uuid(),
  'Efficient Attention Mechanisms for Large Language Models',
  'efficient-attention-llms',
  ARRAY['Your Name', 'Collaborator A', 'Collaborator B'],
  2024,
  'NeurIPS 2024',
  '10.1234/neurips.2024.12345',
  '2409.12345',
  'https://example.com/paper.pdf',
  'We propose a novel attention mechanism that reduces computational complexity from O(n²) to O(n log n) while maintaining model performance. Our approach enables training of larger models with limited computational resources.',
  ARRAY['Machine Learning', 'NLP', 'Transformers', 'Efficiency'],
  true,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Federated Learning with Differential Privacy',
  'federated-learning-privacy',
  ARRAY['Your Name', 'Research Partner'],
  2023,
  'ICML 2023',
  '10.1234/icml.2023.67890',
  '2306.54321',
  'https://example.com/federated-learning.pdf',
  'This paper introduces a federated learning framework with formal differential privacy guarantees. We demonstrate that privacy can be maintained without significant loss in model accuracy across diverse datasets.',
  ARRAY['Federated Learning', 'Privacy', 'Machine Learning'],
  true,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Multi-Modal Learning for Computer Vision',
  'multimodal-cv',
  ARRAY['Your Name', 'Team Member A', 'Team Member B'],
  2023,
  'CVPR 2023',
  NULL,
  '2302.98765',
  NULL,
  'A comprehensive study on combining visual and textual information for improved image understanding. We achieve state-of-the-art results on multiple benchmark datasets.',
  ARRAY['Computer Vision', 'Multi-Modal Learning', 'Deep Learning'],
  true,
  NOW(),
  NOW()
);

-- Insert sample blog posts
INSERT INTO blog_posts (
  id, title, slug, excerpt, content_url, cover_image_url,
  tags, published, published_at, reading_time, views,
  created_at, updated_at
) VALUES
(
  gen_random_uuid(),
  'Building Production-Ready AI Systems',
  'production-ai-systems',
  'Learn the key principles and best practices for deploying AI models in production environments. From model serving to monitoring, we cover everything you need to know.',
  NULL,
  NULL,
  ARRAY['AI', 'MLOps', 'Production', 'Best Practices'],
  true,
  NOW() - INTERVAL '5 days',
  8,
  245,
  NOW() - INTERVAL '5 days',
  NOW()
),
(
  gen_random_uuid(),
  'Understanding Transformer Architecture',
  'understanding-transformers',
  'A deep dive into the transformer architecture that powers modern language models. We explain attention mechanisms, positional encoding, and training techniques.',
  NULL,
  NULL,
  ARRAY['Machine Learning', 'NLP', 'Transformers', 'Tutorial'],
  true,
  NOW() - INTERVAL '15 days',
  12,
  567,
  NOW() - INTERVAL '15 days',
  NOW()
),
(
  gen_random_uuid(),
  'Optimizing Database Performance at Scale',
  'database-optimization',
  'Practical tips for optimizing PostgreSQL performance when handling millions of queries per day. Covers indexing, query optimization, and connection pooling.',
  NULL,
  NULL,
  ARRAY['Database', 'PostgreSQL', 'Performance', 'Optimization'],
  true,
  NOW() - INTERVAL '30 days',
  10,
  892,
  NOW() - INTERVAL '30 days',
  NOW()
),
(
  gen_random_uuid(),
  'The Future of AI Engineering',
  'future-ai-engineering',
  'Exploring emerging trends in AI engineering: from multimodal models to edge computing. What skills will AI engineers need in the next 5 years?',
  NULL,
  NULL,
  ARRAY['AI', 'Career', 'Future', 'Trends'],
  false,
  NULL,
  6,
  0,
  NOW(),
  NOW()
);

-- Insert admin user (optional)
INSERT INTO users (
  id, email, name, avatar_url, role, created_at, updated_at
) VALUES
(
  gen_random_uuid(),
  'admin@example.com',
  'Portfolio Admin',
  NULL,
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Verify data
SELECT 'Projects:', COUNT(*) FROM projects;
SELECT 'Publications:', COUNT(*) FROM publications;
SELECT 'Blog Posts:', COUNT(*) FROM blog_posts;
SELECT 'Users:', COUNT(*) FROM users;

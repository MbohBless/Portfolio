// Type definitions matching backend DTOs

export interface Project {
  id: string
  title: string
  slug: string
  description?: string
  techStack: string[]
  githubUrl?: string
  demoUrl?: string
  thumbnailUrl?: string
  images: string[]
  published: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
}

export interface Publication {
  id: string
  title: string
  slug: string
  authors: string[]
  year: number
  venue?: string
  doi?: string
  arxivId?: string
  pdfUrl?: string
  abstract?: string
  tags: string[]
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  contentUrl?: string
  coverImageUrl?: string
  tags: string[]
  published: boolean
  publishedAt?: string
  readingTime: number
  views: number
  createdAt: string
  updatedAt: string
}

export interface SearchResult {
  id: string
  title: string
  excerpt: string
  type: 'project' | 'publication' | 'blog'
  slug: string
  rank: number
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

// Form types for creating/updating
export interface CreateProjectData {
  title: string
  slug: string
  description?: string
  techStack?: string[]
  githubUrl?: string
  demoUrl?: string
  thumbnailUrl?: string
  images?: string[]
  published?: boolean
  displayOrder?: number
}

export interface UpdateProjectData extends Partial<CreateProjectData> {}

export interface CreatePublicationData {
  title: string
  slug: string
  authors: string[]
  year: number
  venue?: string
  doi?: string
  arxivId?: string
  pdfUrl?: string
  abstract?: string
  tags?: string[]
  published?: boolean
}

export interface UpdatePublicationData extends Partial<CreatePublicationData> {}

export interface CreateBlogPostData {
  title: string
  slug: string
  excerpt?: string
  contentUrl?: string
  coverImageUrl?: string
  tags?: string[]
  published?: boolean
  readingTime?: number
}

export interface UpdateBlogPostData extends Partial<CreateBlogPostData> {}

export interface UploadResponse {
  id: string
  url: string
  storagePath: string
  mimeType: string
  sizeBytes: number
}

import {
  Project,
  Publication,
  BlogPost,
  SearchResult,
  PaginatedResponse,
  CreateProjectData,
  UpdateProjectData,
  CreatePublicationData,
  UpdatePublicationData,
  CreateBlogPostData,
  UpdateBlogPostData,
  UploadResponse,
} from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setToken(token: string | null) {
    this.token = token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T
    }

    return response.json()
  }

  // Projects
  async getProjects(publishedOnly: boolean = true): Promise<Project[]> {
    return this.request<Project[]>(`/projects?published=${publishedOnly}`)
  }

  async getProject(idOrSlug: string): Promise<Project> {
    return this.request<Project>(`/projects/${idOrSlug}`)
  }

  async createProject(data: CreateProjectData): Promise<Project> {
    return this.request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateProject(id: string, data: UpdateProjectData): Promise<Project> {
    return this.request<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteProject(id: string): Promise<void> {
    return this.request<void>(`/projects/${id}`, {
      method: 'DELETE',
    })
  }

  // Publications
  async getPublications(publishedOnly: boolean = true): Promise<Publication[]> {
    return this.request<Publication[]>(`/publications?published=${publishedOnly}`)
  }

  async getPublication(idOrSlug: string): Promise<Publication> {
    return this.request<Publication>(`/publications/${idOrSlug}`)
  }

  async createPublication(data: CreatePublicationData): Promise<Publication> {
    return this.request<Publication>('/publications', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updatePublication(id: string, data: UpdatePublicationData): Promise<Publication> {
    return this.request<Publication>(`/publications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deletePublication(id: string): Promise<void> {
    return this.request<void>(`/publications/${id}`, {
      method: 'DELETE',
    })
  }

  // Blog Posts
  async getBlogPosts(
    publishedOnly: boolean = true,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<BlogPost>> {
    return this.request<PaginatedResponse<BlogPost>>(
      `/blog-posts?published=${publishedOnly}&page=${page}&pageSize=${pageSize}`
    )
  }

  async getBlogPost(slugOrId: string): Promise<BlogPost> {
    return this.request<BlogPost>(`/blog-posts/${slugOrId}`)
  }

  async createBlogPost(data: CreateBlogPostData): Promise<BlogPost> {
    return this.request<BlogPost>('/blog-posts', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateBlogPost(id: string, data: UpdateBlogPostData): Promise<BlogPost> {
    return this.request<BlogPost>(`/blog-posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteBlogPost(id: string): Promise<void> {
    return this.request<void>(`/blog-posts/${id}`, {
      method: 'DELETE',
    })
  }

  // Search
  async search(query: string, limit: number = 20): Promise<{ results: SearchResult[]; query: string; totalResults: number }> {
    return this.request(`/search?q=${encodeURIComponent(query)}&limit=${limit}`)
  }

  // Upload
  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const headers: HeadersInit = {}
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async deleteFile(fileId: string): Promise<void> {
    return this.request<void>(`/upload/${fileId}`, {
      method: 'DELETE',
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)

# 🎨 Customization Guide for AI Engineers

## Quick Customizations to Make This Portfolio Yours

---

## 1. 🏠 Update Homepage Hero

**File**: `frontend/src/app/page.tsx`

```typescript
// Find this section (around line 24):
<h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
  AI Engineer &<br />Software Developer
</h1>

<p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
  Building intelligent systems and scalable software solutions.
  Specialized in machine learning, artificial intelligence, and modern web technologies.
</p>

// Replace with your info:
<h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
  Your Name<br />
  AI Research Engineer
</h1>

<p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
  Passionate about deep learning and computer vision. 
  PhD candidate at [University]. Former ML Engineer at [Company].
</p>
```

---

## 2. 📧 Update Contact Info

**File**: `frontend/src/components/Footer.tsx`

```typescript
// Find around line 26-31:
<ul className="space-y-2">
  <li><a href="https://github.com">GitHub</a></li>
  <li><a href="https://linkedin.com">LinkedIn</a></li>
  <li><a href="https://twitter.com">Twitter</a></li>
  <li><a href="mailto:contact@example.com">Email</a></li>
</ul>

// Replace with your links:
<ul className="space-y-2">
  <li><a href="https://github.com/yourusername">GitHub</a></li>
  <li><a href="https://linkedin.com/in/yourprofile">LinkedIn</a></li>
  <li><a href="https://twitter.com/yourhandle">Twitter</a></li>
  <li><a href="mailto:your.email@example.com">Email</a></li>
  <li><a href="https://scholar.google.com/citations?user=YOUR_ID">Google Scholar</a></li>
</ul>
```

**Also update footer bio** (line 18):
```typescript
<p className="text-gray-600 text-sm leading-relaxed max-w-md">
  AI Engineer specializing in [your specialization]. 
  Working on [current focus]. Based in [location].
</p>
```

---

## 3. 🧠 Add AI/ML Specific Sections

### Add Skills Section to Homepage

**File**: `frontend/src/app/page.tsx`

Add after the hero section (around line 40):

```typescript
{/* Skills Section */}
<section className="container mx-auto px-6 py-20 border-t border-gray-200">
  <div className="max-w-4xl">
    <h2 className="text-3xl font-bold mb-8">Expertise</h2>
    <div className="grid md:grid-cols-3 gap-8">
      <div>
        <h3 className="font-semibold mb-3">Machine Learning</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Deep Learning (PyTorch, TensorFlow)</li>
          <li>• Computer Vision (CNNs, Transformers)</li>
          <li>• Natural Language Processing</li>
          <li>• Reinforcement Learning</li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold mb-3">Software Engineering</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Python, TypeScript, Go</li>
          <li>• System Design & Architecture</li>
          <li>• API Development (FastAPI, Node.js)</li>
          <li>• Cloud Platforms (AWS, GCP)</li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold mb-3">MLOps & Infrastructure</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Model Deployment & Serving</li>
          <li>• Kubernetes & Docker</li>
          <li>• CI/CD Pipelines</li>
          <li>• Monitoring & Observability</li>
        </ul>
      </div>
    </div>
  </div>
</section>
```

---

## 4. 📚 Customize Publications Format

For AI/ML research, you might want to add citation counts or venue rankings.

**File**: `frontend/src/app/publications/page.tsx`

Add citation info (you'll need to add this field to your schema first):

```typescript
<div className="text-sm text-gray-500 italic mb-4">
  {pub.venue}
  {pub.citationCount && (
    <span className="ml-2">• {pub.citationCount} citations</span>
  )}
</div>
```

---

## 5. 🏆 Add Achievements/Awards Section

**File**: Create `frontend/src/app/page.tsx` or separate page

```typescript
{/* Awards Section */}
<section className="container mx-auto px-6 py-20 border-t border-gray-200">
  <div className="max-w-4xl">
    <h2 className="text-3xl font-bold mb-8">Recognition</h2>
    <div className="space-y-4">
      <div className="flex gap-4">
        <span className="text-gray-400 font-mono text-sm">2024</span>
        <div>
          <h3 className="font-semibold">Best Paper Award</h3>
          <p className="text-sm text-gray-600">NeurIPS 2024</p>
        </div>
      </div>
      <div className="flex gap-4">
        <span className="text-gray-400 font-mono text-sm">2023</span>
        <div>
          <h3 className="font-semibold">Outstanding Graduate Student Award</h3>
          <p className="text-sm text-gray-600">University Name</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## 6. 💼 Add Work Experience Section

```typescript
{/* Experience Section */}
<section className="container mx-auto px-6 py-20 border-t border-gray-200">
  <div className="max-w-4xl">
    <h2 className="text-3xl font-bold mb-8">Experience</h2>
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold">Senior ML Engineer</h3>
            <p className="text-gray-600">Company Name</p>
          </div>
          <span className="text-sm text-gray-500">2022 - Present</span>
        </div>
        <ul className="text-sm text-gray-600 space-y-1 ml-4">
          <li>• Built production ML pipeline processing 1M+ requests/day</li>
          <li>• Led team of 4 engineers developing recommendation system</li>
          <li>• Improved model accuracy by 25% through novel architecture</li>
        </ul>
      </div>
      
      <div>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold">ML Research Intern</h3>
            <p className="text-gray-600">Research Lab / Company</p>
          </div>
          <span className="text-sm text-gray-500">Summer 2021</span>
        </div>
        <ul className="text-sm text-gray-600 space-y-1 ml-4">
          <li>• Researched novel attention mechanisms for transformers</li>
          <li>• Co-authored paper published at top-tier conference</li>
        </ul>
      </div>
    </div>
  </div>
</section>
```

---

## 7. 🎓 Add Education Section

```typescript
{/* Education Section */}
<section className="container mx-auto px-6 py-20 border-t border-gray-200">
  <div className="max-w-4xl">
    <h2 className="text-3xl font-bold mb-8">Education</h2>
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold">Ph.D. in Computer Science</h3>
            <p className="text-gray-600">University Name</p>
            <p className="text-sm text-gray-500 mt-1">
              Focus: Machine Learning, Computer Vision
            </p>
          </div>
          <span className="text-sm text-gray-500">2020 - 2024</span>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold">M.Sc. in Artificial Intelligence</h3>
            <p className="text-gray-600">University Name</p>
          </div>
          <span className="text-sm text-gray-500">2018 - 2020</span>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## 8. 🔗 Update Navigation Labels

If "Research" sounds better than "Publications":

**File**: `frontend/src/components/Navigation.tsx`

```typescript
const links = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/publications', label: 'Research' },  // Changed from "Publications"
  { href: '/blog', label: 'Writing' },  // or keep "Blog"
]
```

---

## 9. 📊 Add Google Scholar Badge

**File**: `frontend/src/app/page.tsx`

In the hero section:

```typescript
<div className="flex flex-wrap gap-4 pt-4">
  <Link href="/projects">
    <Button size="lg" variant="primary">
      View Projects
    </Button>
  </Link>
  <a 
    href="https://scholar.google.com/citations?user=YOUR_ID" 
    target="_blank" 
    rel="noopener noreferrer"
  >
    <Button size="lg" variant="secondary">
      Google Scholar
    </Button>
  </a>
</div>
```

---

## 10. 🎯 Update Metadata for SEO

**File**: `frontend/src/app/layout.tsx`

```typescript
export const metadata: Metadata = {
  title: 'Your Name - AI Engineer & Researcher',
  description: 'AI Engineer specializing in computer vision and deep learning. PhD from [University]. Publications at NeurIPS, CVPR, ICML.',
  keywords: ['AI', 'Machine Learning', 'Computer Vision', 'Deep Learning', 'Research'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'Your Name - AI Engineer',
    description: 'AI Engineer & Researcher',
    url: 'https://yoursite.com',
    siteName: 'Your Name Portfolio',
    locale: 'en_US',
    type: 'website',
  },
}
```

---

## 11. 🖼️ Add Profile Image

**File**: `frontend/src/app/page.tsx`

In hero section:

```typescript
<div className="flex items-start gap-12">
  {/* Profile Image */}
  <div className="hidden md:block">
    <img 
      src="/images/profile.jpg" 
      alt="Your Name"
      className="w-48 h-48 rounded-full object-cover grayscale"
    />
  </div>
  
  {/* Hero Content */}
  <div className="flex-1">
    <h1>...</h1>
    <p>...</p>
  </div>
</div>
```

---

## 12. 🎨 Adjust Color Scheme (Optional)

If you want a slightly different shade of black/gray:

**File**: `frontend/src/app/globals.css`

```css
:root {
  --background: #ffffff;
  --foreground: #111827;  /* Slightly lighter black */
}

/* Or go darker */
:root {
  --background: #fafafa;  /* Off-white */
  --foreground: #000000;  /* Pure black */
}
```

---

## 13. 📱 Social Preview Cards

For better sharing on social media, add Open Graph images:

**File**: `frontend/src/app/layout.tsx`

```typescript
export const metadata: Metadata = {
  // ... existing metadata
  openGraph: {
    images: ['/og-image.jpg'],  // Create this 1200x630 image
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Name - AI Engineer',
    description: 'AI Engineer & Researcher',
    images: ['/og-image.jpg'],
  },
}
```

---

## 14. 🔍 Add GitHub Activity Badge

In footer or homepage:

```typescript
<div className="flex items-center gap-2">
  <img 
    src="https://img.shields.io/github/followers/yourusername?style=social"
    alt="GitHub followers"
  />
  <img 
    src="https://img.shields.io/github/stars/yourusername?style=social"
    alt="GitHub stars"
  />
</div>
```

---

## 15. 📖 Blog Post Templates for AI Topics

When creating blog posts, use consistent structure:

```markdown
# Title: Understanding [AI Concept]

## Introduction
Brief overview and motivation

## Background
Theory and related work

## Implementation
Code examples and walkthrough

## Results
Benchmarks and visualizations

## Conclusion
Key takeaways and future work

## References
Links to papers and resources
```

---

## 🚀 Quick Changes Summary

1. **Hero**: Update name, title, bio
2. **Footer**: Add your social links and email
3. **Navigation**: Adjust labels if needed
4. **Homepage**: Add skills, experience, education sections
5. **Metadata**: Update for SEO
6. **Images**: Add profile photo and project thumbnails
7. **Content**: Replace sample data with your projects/papers

---

## 📝 Content Tips for AI Engineers

### Projects to Showcase
- Research implementations (paper reproductions)
- Kaggle competition solutions
- Open-source ML libraries/tools
- Production ML systems
- Side projects with novel ideas

### Publications Format
- Conference/Journal name (important in academia)
- Author list (highlight your name)
- Links: PDF, code, demo, slides, poster
- Tags: ML subfield, techniques used

### Blog Topics Ideas
- Paper summaries and implementations
- ML engineering best practices
- Tutorial: Building [X] from scratch
- Model optimization techniques
- Career advice for AI engineers

---

## 🎯 Priority Order

1. ✅ **Update personal info** (name, bio, links) - 5 min
2. ✅ **Add your content** via Prisma Studio - 30 min
3. ✅ **Add skills/experience sections** - 15 min
4. ⏳ **Upload images** (profile, projects) - 20 min
5. ⏳ **Write 1-2 blog posts** - varies
6. ⏳ **Customize colors** (if needed) - 10 min
7. ⏳ **Deploy to production** - 30 min

---

Ready to make it yours! 🚀

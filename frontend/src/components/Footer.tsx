import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <h3 className="font-bold text-lg mb-4">AI Engineer & Software Developer</h3>
            <p className="text-gray-600 text-sm leading-relaxed max-w-md">
              Building intelligent systems and scalable software solutions. 
              Passionate about machine learning, artificial intelligence, and elegant code.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2">
              <li><Link href="/projects" className="text-gray-600 hover:text-black text-sm transition-colors">Projects</Link></li>
              <li><Link href="/publications" className="text-gray-600 hover:text-black text-sm transition-colors">Research</Link></li>
              <li><Link href="/blog" className="text-gray-600 hover:text-black text-sm transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Connect</h4>
            <ul className="space-y-2">
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black text-sm transition-colors">GitHub</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black text-sm transition-colors">LinkedIn</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black text-sm transition-colors">Twitter</a></li>
              <li><a href="mailto:contact@example.com" className="text-gray-600 hover:text-black text-sm transition-colors">Email</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} All rights reserved.
          </p>
          <Link 
            href="/admin" 
            className="text-gray-400 hover:text-gray-600 text-xs transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}

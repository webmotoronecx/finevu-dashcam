"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { articles } from '@/lib/data/articles';
import { Footer } from '@/components/Footer';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Linkedin, Link as LinkIcon, ChevronRight } from 'lucide-react';
import { ScrollProgress } from '@/components/ScrollProgress';
import { useState, useEffect } from 'react';

// Utility to generate ID from text
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export default function Page() {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find(a => a.slug === slug);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const [activeSection, setActiveSection] = useState<string>('');

  // Process content to add IDs to H3 tags for TOC
  const processContent = (content: string) => {
    return content.replace(/<h3>(.*?)<\/h3>/g, (match, title) => {
      const id = slugify(title);
      return `<h3 id="${id}" class="scroll-mt-32 relative group">
        <span class="absolute -left-6 top-1 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--electric-green)]">#</span>
        ${title}
      </h3>`;
    });
  };

  // Extract headings for TOC
  const getHeadings = (content: string) => {
    const regex = /<h3>(.*?)<\/h3>/g;
    const headings = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      headings.push({
        id: slugify(match[1]),
        text: match[1]
      });
    }
    return headings;
  };

  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('h3[id]');
      let current = '';
      
      headings.forEach((heading) => {
        const top = heading.getBoundingClientRect().top;
        if (top < 150) {
          current = heading.id;
        }
      });
      
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-light mb-4">Article Not Found</h1>
        <p className="text-zinc-600 mb-8">The article you are looking for does not exist.</p>
        <Link href="/learn">
          <button className="px-8 py-4 rounded-full bg-zinc-900 text-white hover:scale-105 transition-transform">
            Back to Education Hub
          </button>
        </Link>
      </div>
    );
  }

  const processedContent = processContent(article.content || "");
  const headings = getHeadings(article.content || "");
  
  // Find related articles (same category, excluding current)
  const relatedArticles = articles
    .filter(a => a.category === article.category && a.slug !== article.slug)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-white">
      <ScrollProgress />
      
      <style>{`
        .article-content table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          margin: 2rem 0;
          border-radius: 0.75rem;
          overflow: hidden;
          border: 1px solid #e4e4e7;
        }
        .article-content th {
          background-color: #f4f4f5;
          text-align: left;
          padding: 1rem;
          font-weight: 600;
          color: #18181b;
        }
        .article-content td {
          padding: 1rem;
          border-bottom: 1px solid #e4e4e7;
          color: #3f3f46;
        }
        .article-content tr:last-child td {
          border-bottom: none;
        }
        .article-content img {
          border-radius: 1rem;
          margin: 2rem 0;
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
        }
      `}</style>

      {/* Immersive Hero Section */}
      <div className="relative h-[85vh] w-full overflow-hidden">
         <motion.div 
          className="absolute inset-0"
          style={{ y, scale: 1.1 }}
        >
          <ImageWithFallback
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90" />
        </motion.div>

        <motion.div 
          className="absolute inset-0 flex items-end pb-24"
          style={{ opacity }}
        >
          <div className="max-w-[1440px] mx-auto px-8 lg:px-16 w-full">
            <Link href="/learn" className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors group">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3 group-hover:bg-white/20 transition-colors backdrop-blur-sm">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="font-medium tracking-wide text-sm uppercase">Back to Hub</span>
            </Link>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-5xl"
            >
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="px-4 py-1.5 rounded-full bg-[var(--electric-green)] text-zinc-900 text-sm font-bold tracking-wide uppercase">
                  {article.category}
                </span>
                {article.date && (
                  <span className="flex items-center text-zinc-300 text-sm font-mono bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                    <Calendar className="w-4 h-4 mr-2 text-[var(--electric-blue)]" />
                    {article.date}
                  </span>
                )}
                <span className="flex items-center text-zinc-300 text-sm font-mono bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                  <Clock className="w-4 h-4 mr-2 text-[var(--electric-blue)]" />
                  5 min read
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-light text-white tracking-tight leading-[1.05] mb-8">
                {article.title}
              </h1>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                    <User className="w-6 h-6 text-zinc-400" />
                  </div>
                </div>
                <div>
                  <p className="text-white font-medium">{article.author || "EV360 Team"}</p>
                  <p className="text-white/60 text-sm">Battery Health Specialist</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 lg:px-16 py-16 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Sidebar (Left) - Share & TOC */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 space-y-12">
              {/* Table of Contents */}
              {headings.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-6">Contents</h4>
                  <nav className="space-y-1 relative border-l border-zinc-200 pl-4">
                    {/* Active Indicator Line */}
                    <motion.div 
                      className="absolute left-[-1px] top-0 w-[2px] bg-[var(--electric-blue)]"
                      layoutId="activeSection"
                      initial={false}
                      animate={{ 
                        height: 24,
                        y: headings.findIndex(h => h.id === activeSection) * 28 // Approximate height
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    
                    {headings.map((heading) => (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                          setActiveSection(heading.id);
                        }}
                        className={`block text-sm py-1 transition-colors duration-200 ${
                          activeSection === heading.id 
                            ? 'text-[var(--electric-blue)] font-medium' 
                            : 'text-zinc-500 hover:text-zinc-800'
                        }`}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Share */}
              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Share</h4>
                <div className="flex gap-2">
                  {[Twitter, Linkedin, Facebook, LinkIcon].map((Icon, i) => (
                    <button 
                      key={i}
                      className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:border-[var(--electric-green)] hover:text-[var(--electric-green)] hover:bg-[var(--electric-green)]/5 transition-all"
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="prose prose-lg max-w-none 
                prose-headings:font-light prose-headings:tracking-tight prose-headings:text-zinc-900 
                prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6
                prose-p:text-zinc-600 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-[var(--electric-blue)] prose-a:font-medium prose-a:no-underline hover:prose-a:text-[var(--electric-blue)]/80 hover:prose-a:underline
                prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2 prose-ul:text-zinc-600 prose-li:marker:text-[var(--electric-green)]
                prose-strong:font-semibold prose-strong:text-zinc-900
                prose-blockquote:border-l-4 prose-blockquote:border-[var(--electric-green)] prose-blockquote:bg-zinc-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-zinc-700
              "
            >
              {/* Lead Paragraph Style Override */}
              <p className="text-2xl text-zinc-800 leading-relaxed mb-10 font-light border-l-4 border-[var(--electric-blue)] pl-6 py-1">
                {article.description}
              </p>
              
              <div 
                dangerouslySetInnerHTML={{ __html: processedContent }} 
                className="article-content"
              />
            </motion.div>
            
            {/* Mobile Share (Bottom) */}
            <div className="lg:hidden mt-12 pt-8 border-t border-zinc-200">
              <h4 className="font-medium mb-4">Share this article</h4>
              <div className="flex gap-4">
                <button className="flex-1 py-3 rounded-lg border border-zinc-200 flex items-center justify-center gap-2 font-medium hover:bg-zinc-50">
                  <Twitter className="w-4 h-4" />
                  Tweet
                </button>
                <button className="flex-1 py-3 rounded-lg border border-zinc-200 flex items-center justify-center gap-2 font-medium hover:bg-zinc-50">
                  <Linkedin className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar - CTA */}
          <div className="hidden lg:block lg:col-span-3">
             <div className="sticky top-32">
                <div className="bg-zinc-900 text-white p-8 rounded-3xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--electric-blue)] rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity" />
                  
                  <h3 className="text-2xl font-light mb-4 relative z-10">Is your battery healthy?</h3>
                  <p className="text-zinc-400 mb-8 relative z-10 text-sm leading-relaxed">
                    Don't guess. Know for sure. Get a certified EV360 battery health report today.
                  </p>
                  
                  <Link href="/booking" className="block relative z-10">
                    <button className="w-full py-4 rounded-xl bg-[var(--electric-green)] text-zinc-900 font-bold hover:bg-[#a0f075] transition-colors flex items-center justify-center group-hover:scale-[1.02] active:scale-[0.98] duration-200">
                      Check My Battery
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </Link>
                </div>
             </div>
          </div>

        </div>
      </div>

      {/* Related Articles Section */}
      {relatedArticles.length > 0 && (
        <section className="bg-zinc-50 py-24 border-t border-zinc-200">
          <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
            <h2 className="text-3xl font-light mb-12 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-zinc-400"></span>
              Read Next
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {relatedArticles.map((related) => (
                <Link href={`/learn/${related.slug}`} key={related.slug} className="group block bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-zinc-100">
                  <div className="grid md:grid-cols-2 h-full">
                    <div className="h-64 md:h-auto overflow-hidden relative">
                      <ImageWithFallback 
                        src={related.image} 
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <span className="text-[var(--electric-blue)] text-xs font-bold uppercase tracking-wider mb-3">
                        {related.category}
                      </span>
                      <h3 className="text-xl font-medium mb-3 group-hover:text-[var(--electric-blue)] transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-zinc-500 text-sm line-clamp-2 mb-6">
                        {related.description}
                      </p>
                      <div className="flex items-center text-zinc-400 text-xs font-medium uppercase tracking-wide mt-auto">
                        Read Article <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
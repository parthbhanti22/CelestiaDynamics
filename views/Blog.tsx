import React, { useState } from 'react';
import { blogPosts, BlogPost } from '../data/blogData';
import { Calendar, Tag, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';

export const Blog: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  if (selectedPost) {
    // Detail View
    return (
      <div className="w-full h-full overflow-y-auto bg-slate-950 px-4 pb-20 pt-10">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Logs
          </button>

          <article className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8 relative border border-white/10 shadow-2xl">
                <img 
                    src={selectedPost.imageUrl} 
                    alt={selectedPost.title} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                    <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold rounded-full uppercase tracking-wider mb-4 inline-block backdrop-blur-md">
                        {selectedPost.category}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
                        {selectedPost.title}
                    </h1>
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-mono">
                        <Calendar size={14} /> {selectedPost.date}
                    </div>
                </div>
            </div>

            <div 
                className="prose prose-invert prose-lg max-w-none text-slate-300"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }} 
            />
          </article>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="w-full h-full overflow-y-auto bg-slate-950 px-4 pb-20 pt-10">
        <div className="max-w-6xl mx-auto">
            <header className="mb-16 text-center">
                <h1 className="text-5xl font-bold text-white mb-4">Transmission Logs</h1>
                <p className="text-slate-400 max-w-xl mx-auto">
                    Updates from the development team, astrophysics news, and simulations changelogs.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {blogPosts.map((post) => (
                    <div 
                        key={post.id}
                        onClick={() => setSelectedPost(post)}
                        className="group relative bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all cursor-pointer shadow-lg hover:shadow-cyan-900/20 hover:-translate-y-1"
                    >
                        <div className="h-48 overflow-hidden relative">
                             <img 
                                src={post.imageUrl} 
                                alt={post.title} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 p-2 rounded-lg text-white">
                                <BookOpen size={16} />
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                                    <Tag size={12} /> {post.category}
                                </span>
                                <span className="text-xs text-slate-500 font-mono">
                                    {post.date}
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-200 transition-colors">
                                {post.title}
                            </h2>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                                {post.summary}
                            </p>
                            <div className="flex items-center gap-2 text-cyan-500 text-sm font-bold group-hover:translate-x-2 transition-transform">
                                Read Log <ArrowRight size={16} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};
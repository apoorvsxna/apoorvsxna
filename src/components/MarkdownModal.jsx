import ReactMarkdown from 'react-markdown';
import { X } from 'lucide-react';

export const MarkdownModal = ({ item, isOpen, onClose }) => {
  if (!isOpen || !item) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
        <div 
          className="
            bg-black border-2 border-white/30 
            w-full max-w-4xl h-[70vh]
            flex flex-col
            animate-in fade-in zoom-in-95 duration-300
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div>
              <h2 className="text-2xl font-medium text-white">{item.name}</h2>
              {item.description && (
                <p className="text-sm text-white/60 mt-1">{item.description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors p-2"
              aria-label="Close"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="prose prose-invert prose-sm md:prose-base max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-semibold text-white mb-4 mt-6 first:mt-0">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-medium text-white mb-3 mt-5">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-medium text-white mb-2 mt-4">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-white/90 mb-4 leading-relaxed break-words">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside text-white/90 mb-4 space-y-2">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside text-white/90 mb-4 space-y-2">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-white/90">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-white">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-white/80">{children}</em>
                  ),
                  code: ({ inline, children }) =>
                    inline ? (
                      <code className="bg-white/10 text-white px-1.5 py-0.5 rounded text-sm">
                        {children}
                      </code>
                    ) : (
                      <code className="block bg-white/10 text-white p-4 rounded my-4 overflow-x-auto">
                        {children}
                      </code>
                    ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-white/30 pl-4 italic text-white/70 my-4">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {item.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Footer hint */}
          <div className="p-4 border-t border-white/20 text-center text-sm text-white/50">
            Press <span className="text-white/70">ESC</span> to close
          </div>
        </div>
      </div>
    </>
  );
};

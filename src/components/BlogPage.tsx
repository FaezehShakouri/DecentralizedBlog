import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

interface Comment {
  id: string;
  text: string;
  range: {
    start: { offset: number, node: Node },
    end: { offset: number, node: Node }
  };
}

const BlogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [toc, setToc] = useState<TableOfContentsItem[]>([]);
  const [activeSection, setActiveSection] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState<Range | null>(null);
  const [showCommentSidebar, setShowCommentSidebar] = useState(false);
  const [newComment, setNewComment] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // In a real app, you'd fetch the blog post content from an API
    // For this example, we'll use dummy content
    setTitle('Understanding Decentralized Systems');
    setContent(`
# Understanding Decentralized Systems

## Introduction

Decentralized systems are becoming increasingly important in the modern digital landscape. This blog post will explore the key concepts and benefits of decentralization.

## What is Decentralization?

Decentralization refers to the distribution of power, control, and decision-making across a network of participants rather than concentrating it in a single entity or authority.

### Key Characteristics

1. Distributed control
2. Increased resilience
3. Enhanced privacy and security

## Benefits of Decentralized Systems

Decentralized systems offer several advantages over traditional centralized systems:

1. **Resilience**: No single point of failure
2. **Transparency**: Open and auditable processes
3. **Security**: Improved data protection through distribution

## Examples of Decentralized Technologies

Here are some popular examples of decentralized technologies:

\`\`\`python
decentralized_tech = [
    "Blockchain",
    "Distributed Ledger Technology (DLT)",
    "Peer-to-Peer (P2P) Networks",
    "Decentralized File Storage (e.g., IPFS)"
]
\`\`\`

## Challenges and Future Outlook

While decentralized systems offer many benefits, they also face challenges such as scalability and user adoption. However, ongoing research and development are addressing these issues, paving the way for a more decentralized future.

## Conclusion

Decentralized systems have the potential to revolutionize various industries and empower individuals. As technology continues to evolve, we can expect to see more innovative applications of decentralization in our daily lives.
    `);
  }, [id]);

  useEffect(() => {
    const headers = content.match(/^#{1,6}.+$/gm) || [];
    const tocItems = headers.map((header) => {
      const level = header.match(/^#+/)![0].length;
      const title = header.replace(/^#+\s*/, '');
      const id = title.toLowerCase().replace(/[^\w]+/g, '-');
      return { id, title, level };
    });
    setToc(tocItems);
  }, [content]);

  useEffect(() => {
    if (!contentRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    const headerElements = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headerElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [content]);

  useEffect(() => {
    const handleTextSelection = () => {
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed && contentRef.current) {
        const range = selection.getRangeAt(0);
        if (contentRef.current.contains(range.commonAncestorContainer)) {
          setSelectedText(selection.toString());
          setSelectionRange(range);
          setShowCommentSidebar(true);
        }
      }
    };

    document.addEventListener('mouseup', handleTextSelection);
    return () => document.removeEventListener('mouseup', handleTextSelection);
  }, []);

  const handleAddComment = () => {
    if (selectedText && selectionRange && newComment) {
      const newCommentObj: Comment = {
        id: Date.now().toString(),
        text: newComment,
        range: {
          start: { offset: selectionRange.startOffset, node: selectionRange.startContainer },
          end: { offset: selectionRange.endOffset, node: selectionRange.endContainer }
        }
      };
      setComments([...comments, newCommentObj]);
      setNewComment('');
      setShowCommentSidebar(false);
      highlightComment(newCommentObj);
    }
  };

  const highlightComment = (comment: Comment) => {
    const range = document.createRange();
    range.setStart(comment.range.start.node, comment.range.start.offset);
    range.setEnd(comment.range.end.node, comment.range.end.offset);

    const highlightSpan = document.createElement('span');
    highlightSpan.className = 'comment-highlight';
    highlightSpan.dataset.commentId = comment.id;
    range.surroundContents(highlightSpan);
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex-grow">
        <div className="lg:flex lg:items-start lg:space-x-8">
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
            <nav className="sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Table of Contents</h3>
              <ul className="space-y-2">
                {toc.map((item) => (
                  <li
                    key={item.id}
                    className={`pl-${(item.level - 1) * 4} ${
                      activeSection === item.id ? 'font-bold text-primary-600' : 'text-gray-600'
                    }`}
                  >
                    <a
                      href={`#${item.id}`}
                      className="hover:text-primary-600"
                      onClick={(e) => scrollToSection(e, item.id)}
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="lg:flex-grow" ref={contentRef}>
            <h1 className="text-4xl font-bold mb-8">{title}</h1>
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => {
                  const id = (Array.isArray(props.children) ? props.children[0]?.toString() : props.children?.toString())?.toLowerCase().replace(/[^\w]+/g, '-') || '';
                  return <h1 id={id} className="text-3xl font-bold mt-8 mb-4">{props.children}</h1>;
                },
                h2: ({ node, ...props }) => {
                  const id = (Array.isArray(props.children) ? props.children[0]?.toString() : props.children?.toString())?.toLowerCase().replace(/[^\w]+/g, '-') || '';
                  return <h2 id={id} className="text-2xl font-bold mt-6 mb-3">{props.children}</h2>;
                },
                h3: ({ node, ...props }) => {
                  const id = (Array.isArray(props.children) ? props.children[0]?.toString() : props.children?.toString())?.toLowerCase().replace(/[^\w]+/g, '-') || '';
                  return <h3 id={id} className="text-xl font-bold mt-4 mb-2">{props.children}</h3>;
                },
                p: ({ node, ...props }) => <p className="mb-4" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4" {...props} />,
                code: ({ inline, className, children, ...props }: any) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={atomDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
      {showCommentSidebar && (
        <div className="w-80 ml-4 bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Add Comment</h3>
          <p className="mb-2">Selected text: "{selectedText}"</p>
          <textarea
            className="w-full p-2 border rounded mb-2"
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Type your comment here..."
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleAddComment}
          >
            Add Comment
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
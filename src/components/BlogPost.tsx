import React from 'react';
import { Link } from 'react-router-dom';

interface BlogPostProps {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  status: 'draft' | 'voting' | 'published';
}

const BlogPost: React.FC<BlogPostProps> = ({ id, title, content, author, date, status }) => {
  return (
    <Link to={`/blog/${id}`} className="block hover:bg-gray-100 p-4 rounded-lg">
      <h2 className="text-xl font-semibold">{title}</h2>
        <div className="bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg shadow-xl rounded-xl overflow-hidden mb-8 transform transition duration-500 hover:scale-105 hover:shadow-2xl">
          <div className="px-6 py-8">
            <Link to={`/blog/${id}`} className="font-extrabold text-2xl mb-4 text-primary-800 hover:text-primary-600">
              {title}
            </Link>
            <p className="text-gray-800 text-base mb-6 line-clamp-3">{content}</p>
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <p className="text-gray-700 font-semibold">By {author}</p>
                <p className="text-gray-600">{date}</p>
              </div>
              <span className={`px-4 py-2 inline-flex text-sm leading-5 font-bold rounded-full ${
                status === 'draft' ? 'bg-yellow-200 text-yellow-800' :
                status === 'voting' ? 'bg-blue-200 text-blue-800' :
                'bg-green-200 text-green-800'
              }`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
          </div>
        </div>
    </Link>
  );
};

export default BlogPost;

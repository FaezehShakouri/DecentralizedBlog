import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import BlogPost from './components/BlogPost';
import CreatePost from './components/CreatePost';
import BlogPage from './components/BlogPage';

const App: React.FC = () => {
  const posts = [
    {
      id: '1',
      title: "Introduction to Decentralized Blogging",
      content: "This is a sample post about decentralized blogging. It covers the basics of how decentralized platforms work and their benefits.",
      author: "Anonymous Author",
      date: "2023-04-15",
      status: "published" as const,
    },
    {
      id: '2',
      title: "The Future of Web3",
      content: "Web3 is the next evolution of the internet. This post explores the potential impact of Web3 technologies on various industries.",
      author: "Anonymous Author",
      date: "2023-04-16",
      status: "voting" as const,
    },
    {
      id: '3',
      title: "Understanding Zero-Knowledge Proofs",
      content: "Zero-knowledge proofs are a cryptographic method that allows one party to prove to another party that a statement is true without revealing any information beyond the validity of the statement itself.",
      author: "Anonymous Author",
      date: "2023-04-17",
      status: "draft" as const,
    },
  ];

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post) => (
                <BlogPost key={post.id} {...post} />
              ))}
            </div>
          } />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/blog/:id" element={<BlogPage />} />
          <Route path="/my-posts" element={<h2>My Posts (Coming Soon)</h2>} />
          <Route path="/about" element={<h2>About (Coming Soon)</h2>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;

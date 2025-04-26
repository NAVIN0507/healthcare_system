'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Post {
    _id: string;
    title: string;
    content: string;
    category: string;
    tags: string[];
    author: {
        name: string;
        image: string;
    };
    createdAt: string;
    likes: string[];
    commentCount: number;
}

export default function PostsList() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchPosts = async () => {
        try {
            const response = await fetch(`/api/posts?page=${page}&limit=10`);
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const data = await response.json();

            if (page === 1) {
                setPosts(data.posts);
            } else {
                setPosts(prev => [...prev, ...data.posts]);
            }

            setHasMore(data.pagination.page < data.pagination.pages);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [page]);

    if (loading && page === 1) {
        return <div className="text-center py-4">Loading posts...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">{error}</div>;
    }

    return (
        <div className="space-y-6">
            {posts.map((post) => (
                <div key={post._id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center mb-4">
                        <Image
                            src={post.author.image || '/default-avatar.png'}
                            alt={post.author.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                        <div className="ml-3">
                            <p className="font-medium">{post.author.name}</p>
                            <p className="text-sm text-gray-500">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4">
                        {post.content.length > 200
                            ? `${post.content.substring(0, 200)}...`
                            : post.content}
                    </p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="px-2 py-1 bg-gray-100 rounded">
                            {post.category}
                        </span>
                        <span>❤️ {post.likes.length}</span>
                        <span>💬 {post.commentCount}</span>
                    </div>

                    {post.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {post.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-blue-50 text-blue-600 text-sm rounded"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            {hasMore && (
                <div className="text-center py-4">
                    <button
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
} 
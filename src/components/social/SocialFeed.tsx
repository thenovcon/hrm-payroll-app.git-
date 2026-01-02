'use client';

import { createPost, toggleLike, addComment } from '@/lib/actions/social-actions';
import { useState } from 'react';

type Post = {
    id: string;
    content: string;
    imageUrl?: string | null;
    author: {
        username: string;
        employee?: { firstName: string; lastName: string; position: string } | null;
    };
    createdAt: Date;
    _count: { likes: number; comments: number };
    isLiked?: boolean; // Hydrated by client or server
};

export default function SocialFeed({ initialPosts, userId }: { initialPosts: any[], userId: string }) {
    const [optimisticPosts, addOptimisticPost] = (settings => {
        // Safe check for useOptimistic in case of older React version, though package.json says 19
        try {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            return require('react').useOptimistic(posts, (state: Post[], newPost: Post) => [newPost, ...state]);
        } catch (e) {
            return [posts, () => { }];
        }
    })();

    return (
        <div className="space-y-6">
            {/* Create Post */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <form action={async (formData) => {
                    const content = formData.get('content') as string;
                    if (!content) return;

                    // 1. Optimistic Update
                    addOptimisticPost({
                        id: Math.random().toString(), // Temp ID
                        content,
                        imageUrl: null,
                        author: {
                            username: 'Me',
                            employee: { firstName: 'You', lastName: '(Posting...)', position: '' }
                        },
                        createdAt: new Date(),
                        _count: { likes: 0, comments: 0 },
                        isLiked: false
                    });

                    // 2. Server Action
                    await createPost(content);
                }}>
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                            Me
                        </div>
                        <div className="flex-1">
                            <textarea
                                name="content"
                                placeholder="Share an update, shoutout, or photo..."
                                className="w-full border-none focus:ring-0 resize-none h-20 text-gray-700 bg-transparent"
                            />
                            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                <button type="button" className="text-gray-400 hover:text-primary-600 text-sm">📷 Add Photo</button>
                                <button type="submit" className="bg-primary-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-primary-700">
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* Feed */}
            {optimisticPosts.map((post: Post) => (
                <div key={post.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {post.author.employee?.firstName?.[0] || post.author.username[0]}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">
                                {post.author.employee ? `${post.author.employee.firstName} ${post.author.employee.lastName}` : post.author.username}
                            </p>
                            <p className="text-xs text-gray-500">
                                {post.author.employee?.position || 'Staff'} • {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

                    {post.imageUrl && (
                        <div className="mb-4 rounded-lg overflow-hidden bg-gray-100">
                            <img src={post.imageUrl} alt="Post content" className="w-full h-auto object-cover max-h-96" />
                        </div>
                    )}

                    <div className="flex items-center gap-6 border-t border-gray-100 pt-3">
                        <form action={async () => await toggleLike(post.id)}>
                            <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition">
                                <span>❤️</span>
                                <span className="text-sm font-medium">{post._count.likes} Likes</span>
                            </button>
                        </form>
                        <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition">
                            <span>💬</span>
                            <span className="text-sm font-medium">{post._count.comments} Comments</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

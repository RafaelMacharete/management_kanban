import { useState, type ChangeEvent, type FormEvent } from "react";
import { addComment } from "../../services/commentService";
import type { ICardDetails, Card } from "../../pages/types/cardTypes";


interface IColumn {
    id: number;
    name: string;
    position: number;
    project_board: number;
}

interface IAccounts {
    id: number;
    username: string;
    email: string;
    image_url: string;
    nickname: string | null;
    profile_image: string;
}

interface ICardDetailModalProps {
    selectedCard: ICardDetails | null;
    setShowCardInfo: React.Dispatch<React.SetStateAction<boolean>>;
    columns: IColumn[];
    allAccounts: IAccounts[];
    handleFileUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
    handleCardUpdate: (e: FormEvent<HTMLFormElement>) => Promise<void>;
    handleDeleteCard: () => void;
    handleCardFieldChange: <K extends keyof Card>(field: K, value: Card[K]) => void;
}

const CardDetailModal = ({
    selectedCard,
    setShowCardInfo,
    columns,
    allAccounts,
    handleCardFieldChange,
    handleFileUpload,
    handleCardUpdate,
    handleDeleteCard,
}: ICardDetailModalProps) => {

    const [newComment, setNewComment] = useState("");
    const profileImage = localStorage.getItem("profileImage");

    async function handleAddComment(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!newComment.trim()) return;

        await addComment(selectedCard!.card.id, newComment);
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="border-b border-gray-200 p-4 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Card Details</h3>
                    <button
                        onClick={() => setShowCardInfo(false)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    {/* Title */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 text-lg font-medium"
                            value={selectedCard?.card.name || ''}
                            onChange={(e) => handleCardFieldChange('name', e.target.value)}
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                            value={selectedCard?.card.description || ''}
                            onChange={(e) => handleCardFieldChange('description', e.target.value)}
                        ></textarea>
                    </div>

                    {/* Meta */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                                value={selectedCard?.card.due_date?.split('T')[0] || ''}
                                onChange={(e) => handleCardFieldChange('due_date', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                                value={selectedCard?.card.priority || 'medium'}
                                onChange={(e) => handleCardFieldChange('priority', e.target.value)}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Column</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                                value={selectedCard?.card.column}
                                onChange={(e) => handleCardFieldChange('column', parseInt(e.target.value))}
                            >
                                {columns.map(column => (
                                    <option key={column.id} value={column.id}>{column.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                                value={selectedCard?.card.assigned_to || ''}
                                onChange={(e) =>
                                    handleCardFieldChange('assigned_to', e.target.value ? parseInt(e.target.value) : null)
                                }
                            >
                                <option value="">Unassigned</option>
                                {allAccounts.map(account => (
                                    <option key={account.id} value={account.id}>{account.username}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Attachments */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
                        {selectedCard!.attachments.length > 0 && (
                            <div className="mb-4 space-y-2">
                                {selectedCard?.attachments.map(attachment => (
                                    <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <a
                                            href={attachment.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {attachment.name}
                                        </a>
                                        <button className="text-red-500 hover:text-red-700">✕</button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                            <p className="text-sm text-gray-500 mb-2">Drag & drop files here or click to upload</p>
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                            <label
                                htmlFor="file-upload"
                                className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition cursor-pointer inline-block"
                            >
                                Upload Files
                            </label>
                        </div>
                    </div>

                    {/* Comments */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                        <div className="space-y-4">
                            <form onSubmit={handleAddComment} className="flex gap-3">
                                <div className="flex-shrink-0">
                                    <div className="h-15 w-15 rounded-full bg-gray-300 flex items-center justify-center">
                                        {profileImage ? (
                                            <img
                                                src={profileImage}
                                                alt="Profile"
                                                className="w-13 h-13 rounded-full object-cover border border-gray-300"
                                            />
                                        ) : (
                                            <div className="w-13 h-13 rounded-full bg-gray-300" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <textarea
                                        rows={2}
                                        placeholder="Add a comment..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    ></textarea>
                                    <div className="mt-2 flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition"
                                        >
                                            Comment
                                        </button>
                                    </div>
                                </div>
                            </form>

                            <div className="border-t border-gray-200 pt-4 space-y-4">
                                {selectedCard?.comments.map(comment => (
                                    <div key={comment.id} className="flex gap-3">
                                        <div className="flex-shrink-0">
                                            <div className="h-15 w-15 rounded-full bg-gray-300 flex items-center justify-center">
                                                <img
                                                    src={profileImage!}
                                                    alt="Profile"
                                                    className="w-15 h-15 rounded-full object-cover border border-gray-300"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-grow">
                                            <div className="bg-gray-50 p-3 rounded-md">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-sm font-medium">{comment.user.username}</span>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(comment.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-700">{comment.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <form
                    className="border-t border-gray-200 p-4 flex justify-end gap-3"
                    onSubmit={handleCardUpdate}
                >
                    <button
                        onClick={() => setShowCardInfo(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDeleteCard}
                        className="px-4 py-2 border border-red-300 rounded-md hover:bg-gray-50 transition"
                    >
                        Delete
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CardDetailModal;
import React from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

export function Form({ fields, handleSubmit, setShowForm, toCreate }) {
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-lg shadow-xl p-6 relative animate-fade-in">
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                    onClick={() => setShowForm(false)}
                >
                    <IoIosCloseCircleOutline size={24} />
                </button>
                <h2 className="text-xl font-medium text-gray-900 mb-6">Create {toCreate}</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {fields.map((field, index) => (
                        <div key={index} className="space-y-1">
                            <label
                                htmlFor={field.htmlFor}
                                className="block text-sm font-normal text-gray-600"
                            >
                                {field.label}
                            </label>
                            <input
                                type="text"
                                id={field.htmlFor}
                                className="mt-1 w-full h-9 px-3 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 text-sm"
                                onChange={field.onChange}
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="w-full bg-violet-600 text-white py-2 rounded hover:bg-violet-700 transition text-sm font-medium"
                    >
                        Create
                    </button>
                </form>
            </div>
        </div>
    );
}
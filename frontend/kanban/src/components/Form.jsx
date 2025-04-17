import React from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

export function Form({ fields, handleSubmit, setShowForm, toCreate}) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative animate-fade-in">
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
                    onClick={() => setShowForm(false)}
                >
                    <IoIosCloseCircleOutline size={28} />
                </button>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create {toCreate}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={index}>
                            <label
                                htmlFor={field.htmlFor}
                                className="block text-sm font-medium text-violet-700"
                            >
                                {field.label}
                            </label>
                            <input
                                type="text"
                                id={field.htmlFor}
                                className="mt-1 w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                                onChange={field.onChange}
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="w-full bg-violet-500 text-white py-2 rounded-lg hover:bg-violet-600 transition"
                    >
                        Create
                    </button>
                </form>
            </div>
        </div>
    );
}

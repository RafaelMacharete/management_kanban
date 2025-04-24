import React from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

export function Form({
  fields,
  handleSubmit,
  setShowForm,
  toCreate,
  formError,
}) {

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 relative animate-fade-in">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-transform transform hover:scale-110"
          onClick={() => setShowForm(false)}
        >
          <IoIosCloseCircleOutline size={26} />
        </button>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Create {toCreate}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {formError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {formError}
            </div>
          )}
          {
            fields.map((field, idx) => (
              <div key={idx} className="space-y-2">
                <label
                  htmlFor={field.htmlFor}
                  className="block text-sm font-medium text-gray-700"
                >
                  {field.label}
                </label>
                <input
                  type="text"
                  id={field.htmlFor}
                  placeholder={field.placeholder}
                  className="w-full h-10 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-sm"
                  onChange={field.onChange}
                />
              </div>
            ))
          }
          <button
            type="submit"
            className="w-full bg-violet-600 text-white py-2.5 rounded-lg hover:bg-violet-700 transition-all text-sm font-medium shadow-md hover:shadow-violet-200"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

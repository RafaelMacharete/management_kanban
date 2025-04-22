import React from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

export function Form({
  fields,
  handleSubmit,
  setShowForm,
  toCreate,
  allAccounts,
  addMember,
}) {
  console.log(allAccounts);
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
          {fields.map((field, idx) => (
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
          ))}

          <button
            type="submit"
            className="w-full bg-violet-600 text-white py-2.5 rounded-lg hover:bg-violet-700 transition-all text-sm font-medium shadow-md hover:shadow-violet-200"
          >
            Create
          </button>

          {allAccounts.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Existing accounts:
              </p>
              <div className="grid grid-cols-4 gap-3">
                {allAccounts.map((account, idx) => (
                  <div
                    key={idx}
                    className="relative group flex flex-col items-center"
                  >
                    <div className="relative">
                      <img
                        src={account.profile_image}
                        alt={account.username}
                        onClick={() => addMember(account)}
                        className="w-12 h-12 rounded-full hover:scale-125  object-cover border-2 border-gray-200 group-hover:border-violet-400 transition-all"
                      />
                    </div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                      <div className="bg-white px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap text-sm font-medium">
                        <p className="text-gray-800">{account.username}</p>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-white rotate-45"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {allAccounts.length > 1 && (
                <p className="text-xs text-gray-500 mt-3 text-center">
                  {allAccounts.length} accounts found
                </p>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

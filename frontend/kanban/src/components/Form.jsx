import React from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

export function Form({
  fields,
  handleSubmit,
  setShowForm,
  toCreate,
  allAccounts,
  addMember,
  formData,
  formDataSetter,
  addedAccounts,
  setAddedAccounts,
  formError,
  isHome
}) {
  function removeMember(id) {
    const updated = formData.members.filter((memberId) => memberId !== id);
    formDataSetter((prev) => ({ ...prev, members: updated }));
    setAddedAccounts((prev) => prev.filter((acc) => acc.id !== id));
  }


  function handleMembersInputChange(e) {
    const value = e.target.value;
    if (value === "") {
      formDataSetter((prev) => ({ ...prev, members: [] }));
      setAddedAccounts([]);
    }
    fields.find(f => f.htmlFor === "members").onChange(e);
  }

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
          {fields.map((field, idx) => (
            <div key={idx} className="space-y-2">
              {field.htmlFor === "members" && formData.members.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.members.map((id) => {
                    const selected = addedAccounts.find((acc) => acc.id === id);
                    return selected ? (
                      <span
                        key={id}
                        className="flex items-center gap-2 bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {selected.username}
                        <button
                          onClick={() => removeMember(id)}
                          className="text-violet-500 hover:text-red-500 transition"
                          title="Remove member"
                        >
                          &times;
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              )}
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
                onChange={field.htmlFor === "members" ? handleMembersInputChange : field.onChange}
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-violet-600 text-white py-2.5 rounded-lg hover:bg-violet-700 transition-all text-sm font-medium shadow-md hover:shadow-violet-200"
          >
            Create
          </button>

          {allAccounts.length > 0 && isHome &&(
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Existing accounts:
              </p>
              <div className="grid grid-zs-4 gap-3">
                {allAccounts.map((account, idx) => (
                  <div
                    key={idx}
                    className="relative group flex flex-col items-center"
                  >
                    <div className="relative">
                      <img
                        src={account.profile_image}
                        alt={account.username}
                        onClick={() => addMember(account.id)}
                        className={`w-12 h-12 rounded-full object-cover border-2 transition-all cursor-pointer
    ${formData.members.includes(account.id)
                            ? 'border-violet-500 ring-2 ring-violet-400'
                            : 'border-gray-200 hover:scale-125 group-hover:border-violet-400'}`}
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
              {allAccounts.length > 1 && isHome &&(
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

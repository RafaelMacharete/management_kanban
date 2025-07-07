import { FaStar, FaRegStar } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useState } from "react";

export function Projects({ projects, members, handleFavorite, handleDeleteProject }) {
  const [menuOpenId, setMenuOpenId] = useState(null);

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {projects.map((project) => {
        const projectMembers = members.filter((member) =>
          project.members.includes(member.id)
        );
        const showMoreIndicator = projectMembers.length > 3;
        const displayedMembers = showMoreIndicator
          ? projectMembers.slice(0, 3)
          : projectMembers;

        return (
          <div key={project.id} className="relative">
            <Link
              to="/project"
              state={{ projectname: project.name, projectid: project.id, projects }}
              className="bg-white p-4 shadow border border-violet-400 hover:shadow-md transition block"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold text-gray-700">{project.name}</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleFavorite(project.id);
                    }}
                  >
                    {project.favorite ? (
                      <FaStar size={23} className="text-yellow-400" />
                    ) : (
                      <FaRegStar size={20} className="text-gray-500 hover:text-yellow-400" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setMenuOpenId(menuOpenId === project.id ? null : project.id);
                    }}
                    className="text-gray-500 hover:text-gray-800"
                  >
                    <HiOutlineDotsVertical />
                  </button>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-2 flex-wrap">
                {displayedMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-1">
                    <img
                      src={member.profile_image}
                      alt={member.username}
                      className="w-6 h-6 rounded-full object-cover border border-gray-200"
                    />
                    <span className="text-sm text-gray-500">{member.username}</span>
                  </div>
                ))}
                {showMoreIndicator && (
                  <span className="text-sm text-gray-400"> +{projectMembers.length - 3}</span>
                )}
              </div>
            </Link>

            {/* Dropdown de opções */}
            {menuOpenId === project.id && (
              <div className="absolute right-2 top-10 bg-white border border-gray-200 shadow-md z-10 rounded w-40">
                <button
                  onClick={() => {
                    handleDeleteProject(project.id);
                    setMenuOpenId(null);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete project
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
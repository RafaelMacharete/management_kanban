import { FaStar, FaRegStar } from "react-icons/fa";
import { Link } from "react-router-dom";

export function Projects({ projects, members, handleFavorite }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {projects.map((project) => (
        <Link
          to="/project"
          state={{ projectname: project.name, projectid: project.id, projects: projects }}
          key={project.id}
          className="bg-white p-4 shadow border border-violet-400 hover:shadow-md transition block"
        >
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-semibold text-gray-700">
              {project.name}
            </h2>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleFavorite(project.id);
              }}
              className="transition-transform duration-200 ease-in-out transform hover:scale-110 cursor-pointer"
            >
              {project.favorite ? (
                <FaStar size={23} className="text-cyan-700" />
              ) : (
                <FaRegStar size={20} className="text-gray-500 hover:text-cyan-700" />
              )}
            </button>
          </div>

          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {members
              .filter((member) => project.members.includes(member.id))
              .map((member) => (
                <div key={member.id} className="flex items-center gap-1">
                  <img 
                    src={member.profile_image} 
                    alt={member.username}
                    className="w-6 h-6 rounded-full object-cover border border-gray-200"
                  />
                  <span className="text-sm text-gray-500">
                    {member.username}
                  </span>
                </div>
              ))}
          </div>
        </Link>
      ))}
    </div>
  );
}
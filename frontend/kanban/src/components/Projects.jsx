import { FaStar, FaRegStar } from "react-icons/fa";
import { Link } from "react-router-dom";

export function Projects({ projects, members, handleFavorite}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <Link
          to="/project"
          state={{ projectname: project.name, projectid: project.id, projects: projects}}
          key={project.id}
          className="bg-white p-4 rounded-xl shadow border border-violet-400 hover:shadow-md transition block"
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

          {members
            .filter((member) => project.members.includes(member.id))
            .map((member) => (
              <p key={member.id} className="text-sm text-gray-500 mt-1">
                {member.username}
              </p>
            ))}
        </Link>
      ))}
    </div>
  );
}

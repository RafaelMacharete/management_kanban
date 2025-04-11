import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import { Link } from 'react-router-dom'

export function Projects({ projects, members }) {
  console.log(projects)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Project */}
      {projects.map((project) => (
        <Link
          key={project.id}
          className="bg-white p-4 rounded-xl shadow border border-violet-400 hover:shadow-md transition"
          state={{projectname: 'oi'}}
          to='/project'
        >
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold text-gray-700">
              {project.name}
            </h2>

            <button
              key={project.id}
              onClick={() => handleFavorite(project.id)}
              className="transition-transform duration-200 ease-in-out transform hover:scale-110 cursor-pointer"
            >
              {project.favorite ? (
                <FaStar
                  size={23}
                  className="text-cyan-700 transition-colors duration-300"
                  title="Remove from favorites"
                />
              ) : (
                <FaRegStar
                  size={20}
                  className="text-gray-500 transition-colors duration-300 hover:text-cyan-700"
                  title="Add to favorites"
                />
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

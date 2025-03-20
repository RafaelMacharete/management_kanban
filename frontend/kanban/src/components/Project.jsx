export function Project({ projects, account }) {
    return (
        <div>
            <ul>
                {projects.map((project) => (
                    <li key={project.id}>{project.name} - {project.members}</li>
                )
                )}
            </ul>
        </div>
    )
}
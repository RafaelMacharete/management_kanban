export function Project({ projects }) {
    return (
      <div>
        <h2>Projetos e suas Contas Associadas</h2>
        {projects.map((project) => (
          <div key={project.id} style={{ marginBottom: "20px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
            <h3>{project.name}</h3>
            <p><strong>Membros:</strong> {project.members}</p>
  
            <h4>Contas Associadas:</h4>
            <ul>
              {project.accounts.length > 0 ? (
                project.accounts.map((account) => (
                  <li key={account.id}>
                    {account.username} - {account.email}
                  </li>
                ))
              ) : (
                <li>Nenhuma conta associada</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    );
  }
  
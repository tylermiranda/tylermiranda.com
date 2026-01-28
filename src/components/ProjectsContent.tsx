import { projects } from '../content/projects';

export function ProjectsContent() {
  return (
    <div className="font-mono text-sm">
      <div className="flex items-center gap-2 mb-4 text-gray-500">
        <span>📁</span>
        <span>~/projects/</span>
      </div>

      <div className="grid gap-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-amber-400 hover:shadow-sm transition-all bg-white"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span>📦</span>
                <a
                  href={project.url || project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-gray-900 hover:text-amber-600 transition-colors"
                >
                  {project.name}
                </a>
              </div>
              <div className="flex gap-2">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="GitHub"
                  >
                    🐙
                  </a>
                )}
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Live site"
                  >
                    🔗
                  </a>
                )}
              </div>
            </div>

            <p className="text-gray-600 text-xs mb-3">{project.description}</p>

            <div className="flex flex-wrap gap-1">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 bg-cream text-gray-600 rounded text-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { workLog, workProjects } from '../content/workLog';

export function WorkLogContent() {
  return (
    <div className="font-mono text-sm p-4">
      <div className="flex items-center gap-2 mb-4 text-gray-500">
        <span>📋</span>
        <span>~/work.log</span>
      </div>

      <p className="text-gray-600 text-xs mb-6 leading-relaxed">
        Recent engineering work across self-hosted apps, AI tooling, and infrastructure.
        Sourced from a personal knowledge base; local preview only.
      </p>

      <h3 className="text-xs uppercase tracking-wide text-gray-400 mb-3">Recent</h3>
      <ol className="space-y-3 mb-8">
        {workLog.map((entry) => (
          <li key={`${entry.date}-${entry.text.slice(0, 24)}`} className="flex gap-3">
            <time className="shrink-0 text-amber-700 text-xs font-semibold w-24">
              {entry.date}
            </time>
            <span className="text-gray-700 text-xs leading-relaxed">{entry.text}</span>
          </li>
        ))}
      </ol>

      <h3 className="text-xs uppercase tracking-wide text-gray-400 mb-3">Capabilities</h3>
      <div className="grid gap-3">
        {workProjects.map((project) => {
          const primaryHref = project.url || project.github;
          return (
            <div
              key={project.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-amber-400 hover:shadow-sm transition-all bg-white"
            >
              <div className="flex items-start justify-between mb-2 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span>📦</span>
                  {primaryHref ? (
                    <a
                      href={primaryHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-gray-900 hover:text-amber-600 transition-colors truncate"
                    >
                      {project.title}
                    </a>
                  ) : (
                    <span className="font-bold text-gray-900 truncate">{project.title}</span>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
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

              <p className="text-gray-600 text-xs mb-2">{project.summary}</p>
              {project.linkNote && (
                <p className="text-gray-400 text-xs mb-3 italic">{project.linkNote}</p>
              )}

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
          );
        })}
      </div>
    </div>
  );
}

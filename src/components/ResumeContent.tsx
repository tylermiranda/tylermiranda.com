export function ResumeContent() {
  return (
    <div className="font-mono text-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-500">
          <span>📄</span>
          <span>resume.pdf</span>
        </div>
        <a
          href="/resume.pdf"
          download
          className="px-3 py-1.5 bg-amber-500 text-white rounded text-xs hover:bg-amber-600 transition-colors flex items-center gap-1"
        >
          <span>⬇️</span>
          Download PDF
        </a>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <header className="text-center mb-6 pb-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Tyler Miranda</h1>
            <p className="text-gray-600">Software Engineer</p>
            <p className="text-xs text-gray-500 mt-1">
              tyler@example.com • github.com/tylermiranda • linkedin.com/in/tylermiranda
            </p>
          </header>

          <section className="mb-6">
            <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Experience
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-gray-900">Software Engineer</h3>
                  <span className="text-xs text-gray-500">2022 - Present</span>
                </div>
                <p className="text-gray-600 text-xs">Company Name</p>
                <ul className="text-xs text-gray-700 mt-1 list-disc list-inside">
                  <li>Accomplishment one with measurable impact</li>
                  <li>Accomplishment two demonstrating skills</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Education
            </h2>
            <div>
              <div className="flex justify-between items-baseline">
                <h3 className="font-medium text-gray-900">Computer Science, B.S.</h3>
                <span className="text-xs text-gray-500">2018 - 2022</span>
              </div>
              <p className="text-gray-600 text-xs">University Name</p>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Skills
            </h2>
            <p className="text-xs text-gray-700">
              TypeScript, JavaScript, Python, React, Node.js, PostgreSQL, AWS, Docker, Git
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

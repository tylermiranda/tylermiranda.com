export function AboutContent() {
  return (
    <div className="font-mono text-sm">
      <div className="text-gray-500 mb-4"># about.txt</div>

      <div className="flex gap-6 mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center text-4xl">
          👨‍💻
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Tyler Miranda</h1>
          <p className="text-gray-600">Senior VDI Platform Engineer</p>
          <p className="text-gray-500 text-xs mt-1">📍 Remote</p>
        </div>
      </div>

      <div className="space-y-4 text-gray-700">
        <p>
          Senior Citrix Engineer with 15+ years designing, supporting, and optimizing
          enterprise virtual desktop infrastructure (VDI) solutions.
        </p>

        <p>
          Expert in Citrix DaaS, NetScaler Gateway, and Azure VDI environments, with
          deep scripting experience using PowerShell and REST APIs. Architect of
          internal platforms that reduce support overhead by bridging gaps in Citrix
          and Azure interfaces.
        </p>

        <div className="bg-cream p-3 rounded border border-gray-200">
          <div className="text-gray-500 text-xs mb-1">// Currently focused on</div>
          <ul className="list-disc list-inside space-y-1">
            <li>End-to-end automation & performance engineering</li>
            <li>AI-powered tooling with Azure OpenAI</li>
            <li>Secure, scalable EUC solutions</li>
          </ul>
        </div>

        <div className="flex gap-2 pt-2">
          <a
            href="https://www.linkedin.com/in/tyler-miranda-pro/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
          >
            LinkedIn →
          </a>
          <a
            href="mailto:tyler.miranda@gmail.com"
            className="px-3 py-1.5 bg-gray-900 text-white rounded text-xs hover:bg-gray-800 transition-colors"
          >
            Email →
          </a>
        </div>
      </div>
    </div>
  );
}

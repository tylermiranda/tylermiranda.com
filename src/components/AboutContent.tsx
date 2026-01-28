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
          <p className="text-gray-600">Software Engineer</p>
          <p className="text-gray-500 text-xs mt-1">📍 Location TBD</p>
        </div>
      </div>

      <div className="space-y-4 text-gray-700">
        <p>
          Hey! I'm Tyler, a software engineer who builds things for the web.
        </p>

        <p>
          I love creating tools that make developers' lives easier and
          products that users actually enjoy using.
        </p>

        <div className="bg-cream p-3 rounded border border-gray-200">
          <div className="text-gray-500 text-xs mb-1">// Currently interested in</div>
          <ul className="list-disc list-inside space-y-1">
            <li>Building delightful user experiences</li>
            <li>Developer tooling</li>
            <li>Making complex things simple</li>
          </ul>
        </div>

        <div className="flex gap-2 pt-2">
          <a
            href="https://github.com/tylermiranda"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-gray-900 text-white rounded text-xs hover:bg-gray-800 transition-colors"
          >
            GitHub →
          </a>
          <a
            href="https://linkedin.com/in/tylermiranda"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
          >
            LinkedIn →
          </a>
        </div>
      </div>
    </div>
  );
}

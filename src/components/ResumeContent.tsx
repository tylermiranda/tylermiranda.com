export function ResumeContent() {
  return (
    <div className="font-mono text-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-500">
          <span>📄</span>
          <span>resume.pdf</span>
        </div>
        <a
          href="https://docs.google.com/document/d/18HLUyYZaaRRvGUiA7XVZnfgjbHsR5C62/edit?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 bg-amber-500 text-white rounded text-xs hover:bg-amber-600 transition-colors flex items-center gap-1"
        >
          <span>📄</span>
          View Full Resume
        </a>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <header className="text-center mb-6 pb-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Tyler Miranda</h1>
            <p className="text-gray-600">Senior VDI Platform Engineer</p>
            <p className="text-xs text-gray-500 mt-1">
              tyler.miranda@gmail.com • linkedin.com/in/tyler-miranda-pro
            </p>
          </header>

          <section className="mb-6">
            <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Experience
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-gray-900">Senior VDI Platform Engineer</h3>
                  <span className="text-xs text-gray-500">2021 - Present</span>
                </div>
                <p className="text-gray-600 text-xs">Edward Jones (Remote)</p>
                <ul className="text-xs text-gray-700 mt-1 list-disc list-inside">
                  <li>Led migration of 10,000+ persistent VDIs to Citrix DaaS</li>
                  <li>Built custom internal platform integrating Citrix, Azure, ServiceNow</li>
                  <li>Implemented AI-based tooling with Azure OpenAI for NLP and reports</li>
                </ul>
              </div>

              <div>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-gray-900">Enterprise Architect</h3>
                  <span className="text-xs text-gray-500">2020 - 2021</span>
                </div>
                <p className="text-gray-600 text-xs">Equity Bank (Wichita, KS)</p>
                <ul className="text-xs text-gray-700 mt-1 list-disc list-inside">
                  <li>Re-architected Citrix environments, migrated to Citrix Cloud</li>
                  <li>Cut logon time from 65s to 16s with FsLogix and Citrix WEM</li>
                </ul>
              </div>

              <div>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-gray-900">Senior Citrix Engineer</h3>
                  <span className="text-xs text-gray-500">2019 - 2020</span>
                </div>
                <p className="text-gray-600 text-xs">Confie (Remote)</p>
              </div>

              <div>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-gray-900">Citrix Engineer</h3>
                  <span className="text-xs text-gray-500">2016 - 2019</span>
                </div>
                <p className="text-gray-600 text-xs">Costco Wholesale (Issaquah, WA)</p>
              </div>

              <div>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-gray-900">Citrix Systems Engineer</h3>
                  <span className="text-xs text-gray-500">2011 - 2016</span>
                </div>
                <p className="text-gray-600 text-xs">Equity Bank (Wichita, KS)</p>
              </div>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Certifications
            </h2>
            <ul className="text-xs text-gray-700 list-disc list-inside">
              <li>AZ-140 Azure Virtual Desktop</li>
              <li>CCE-V Citrix Certified Expert - Virtualization</li>
              <li>CCP-V Citrix Certified Professional - Virtualization</li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Skills
            </h2>
            <p className="text-xs text-gray-700">
              Citrix DaaS, NetScaler Gateway, Azure VDI, PowerShell, REST APIs, ControlUp, FsLogix, Splunk, Azure OpenAI
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

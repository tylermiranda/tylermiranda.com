const skills = {
  virtualization: ['Citrix DaaS', 'Citrix XenDesktop', 'Citrix XenApp', 'Azure VDI', 'VMware vSphere'],
  networking: ['NetScaler Gateway', 'Citrix ADC', 'GSLB', 'ICA Proxy'],
  automation: ['PowerShell', 'REST APIs', 'Jenkins CI', 'Python'],
  cloud: ['Azure', 'Azure OpenAI', 'Citrix Cloud', 'Microsoft 365'],
  tools: ['ControlUp', 'FsLogix', 'Splunk', 'ServiceNow', 'Citrix WEM'],
};

export function SkillsContent() {
  return (
    <div className="font-mono text-sm bg-gray-900 text-gray-100 p-4 rounded h-full overflow-auto">
      <div className="text-gray-500 mb-2">// skills.json</div>
      <pre className="text-xs leading-relaxed">
        <span className="text-gray-500">{'{'}</span>
        {'\n'}

        {Object.entries(skills).map(([category, items], i) => (
          <span key={category}>
            {'  '}<span className="text-purple-400">"{category}"</span>
            <span className="text-gray-500">:</span>
            <span className="text-gray-500">[</span>
            {'\n'}
            {items.map((item, j) => (
              <span key={item}>
                {'    '}<span className="text-green-400">"{item}"</span>
                {j < items.length - 1 && <span className="text-gray-500">,</span>}
                {j === 0 && category === 'automation' && (
                  <span className="text-gray-600"> // 15+ years of scripting</span>
                )}
                {'\n'}
              </span>
            ))}
            {'  '}<span className="text-gray-500">]</span>
            {i < Object.keys(skills).length - 1 && <span className="text-gray-500">,</span>}
            {'\n'}
          </span>
        ))}

        <span className="text-gray-500">{'}'}</span>
      </pre>
    </div>
  );
}

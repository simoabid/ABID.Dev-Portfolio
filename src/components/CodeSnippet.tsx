/**
 * CodeSnippet Component
 *
 * A styled code block with terminal-style header and syntax highlighting.
 * Displays a developer profile object with colorized properties.
 */
export default function CodeSnippet() {
  return (
    <div
      className="w-full max-w-md bg-[#1e1e3f] rounded-2xl overflow-hidden shadow-2xl shadow-[var(--color-shadow-accent)] border border-[var(--color-border-muted)]"
      aria-hidden="true"
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#15152a] border-b border-[var(--color-border-muted)]">
        <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
        <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <span className="w-3 h-3 rounded-full bg-[#27ca40]" />
      </div>

      {/* Code Content */}
      <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
        <pre className="text-[var(--color-foreground)]">
          <code>
            {/* const coder = { */}
            <span className="text-[#c792ea]">const</span>{' '}
            <span className="text-[#82aaff]">coder</span>{' '}
            <span className="text-[#89ddff]">=</span>{' '}
            <span className="text-[#89ddff]">{'{'}</span>
            {'\n'}
            {/* name */}
            {'  '}
            <span className="text-[#f78c6c]">name</span>
            <span className="text-[#89ddff]">:</span>{' '}
            <span className="text-[#c3e88d]">
              &apos;Mohamed Amine Abid&apos;
            </span>
            <span className="text-[#89ddff]">,</span>
            {'\n'}
            {/* skills */}
            {'  '}
            <span className="text-[#f78c6c]">skills</span>
            <span className="text-[#89ddff]">:</span>{' '}
            <span className="text-[#89ddff]">[</span>
            <span className="text-[#c3e88d]">&apos;React&apos;</span>
            <span className="text-[#89ddff]">,</span>{' '}
            <span className="text-[#c3e88d]">&apos;NextJS&apos;</span>
            <span className="text-[#89ddff]">,</span>{' '}
            <span className="text-[#c3e88d]">&apos;Node&apos;</span>
            <span className="text-[#89ddff]">,</span>
            {'\n'}
            {'    '}
            <span className="text-[#c3e88d]">&apos;MongoDB&apos;</span>
            <span className="text-[#89ddff]">,</span>{' '}
            <span className="text-[#c3e88d]">&apos;PHP&apos;</span>
            <span className="text-[#89ddff]">,</span>{' '}
            <span className="text-[#c3e88d]">&apos;Laravel&apos;</span>
            <span className="text-[#89ddff]">]</span>
            <span className="text-[#89ddff]">,</span>
            {'\n'}
            {/* hardWorker */}
            {'  '}
            <span className="text-[#f78c6c]">hardWorker</span>
            <span className="text-[#89ddff]">:</span>{' '}
            <span className="text-[#ff9cac]">true</span>
            <span className="text-[#89ddff]">,</span>
            {'\n'}
            {/* quickLearner */}
            {'  '}
            <span className="text-[#f78c6c]">quickLearner</span>
            <span className="text-[#89ddff]">:</span>{' '}
            <span className="text-[#ff9cac]">true</span>
            <span className="text-[#89ddff]">,</span>
            {'\n'}
            {/* problemSolver */}
            {'  '}
            <span className="text-[#f78c6c]">problemSolver</span>
            <span className="text-[#89ddff]">:</span>{' '}
            <span className="text-[#ff9cac]">true</span>
            <span className="text-[#89ddff]">,</span>
            {'\n'}
            {/* hireable function */}
            {'  '}
            <span className="text-[#ffcb6b]">hireable</span>
            <span className="text-[#89ddff]">:</span>{' '}
            <span className="text-[#c792ea]">function</span>
            <span className="text-[#89ddff]">()</span>{' '}
            <span className="text-[#89ddff]">{'{'}</span>
            {'\n'}
            {'    '}
            <span className="text-[#c792ea]">return</span>{' '}
            <span className="text-[#89ddff]">(</span>
            {'\n'}
            {'      '}
            <span className="text-[#82aaff]">this</span>
            <span className="text-[#89ddff]">.</span>
            <span className="text-[#f78c6c]">hardWorker</span>{' '}
            <span className="text-[#89ddff]">&&</span>
            {'\n'}
            {'      '}
            <span className="text-[#82aaff]">this</span>
            <span className="text-[#89ddff]">.</span>
            <span className="text-[#f78c6c]">problemSolver</span>{' '}
            <span className="text-[#89ddff]">&&</span>
            {'\n'}
            {'      '}
            <span className="text-[#82aaff]">this</span>
            <span className="text-[#89ddff]">.</span>
            <span className="text-[#f78c6c]">skills</span>
            <span className="text-[#89ddff]">.</span>
            <span className="text-[#82aaff]">length</span>{' '}
            <span className="text-[#89ddff]">&gt;=</span>{' '}
            <span className="text-[#f78c6c]">5</span>
            {'\n'}
            {'    '}
            <span className="text-[#89ddff]">)</span>
            <span className="text-[#89ddff]">;</span>
            {'\n'}
            {'  '}
            <span className="text-[#89ddff]">{'}'}</span>
            {'\n'}
            <span className="text-[#89ddff]">{'}'}</span>
            <span className="text-[#89ddff]">;</span>
          </code>
        </pre>
      </div>
    </div>
  );
}

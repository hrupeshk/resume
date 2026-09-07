import React from 'react';
import type { DocumentCategory } from '../../lib/schema';

interface ResumeBuilderProps {
  category: DocumentCategory;
}

export default function ResumeBuilder({ category }: ResumeBuilderProps) {
  return (
    <div className="w-full min-h-screen bg-canvas text-ink">
      {/* Builder Header / Navigation Bar */}
      <header className="border-b border-hairline bg-canvas-elevated px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/" className="text-sm font-semibold tracking-tight text-ink hover:text-body transition-colors">
            ← Home
          </a>
          <span className="text-hairline">|</span>
          <span className="text-xs font-mono uppercase tracking-wider text-mute">
            Builder / {category}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-mute font-mono">Phase 0 Scaffolding</span>
        </div>
      </header>

      {/* Main Builder Grid: Form on Left, Live Preview on Right */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column placeholder */}
          <section className="lg:col-span-6 rounded-md border border-hairline bg-canvas-elevated p-6 shadow-xs">
            <div className="mb-4 pb-3 border-b border-hairline">
              <h2 className="text-lg font-semibold tracking-tight text-ink">Editor</h2>
              <p className="text-xs text-mute mt-1">Form steps and inputs will be mounted here in Phase 1.</p>
            </div>
            <div className="rounded border border-dashed border-hairline-soft p-8 text-center text-sm text-mute">
              Active Category: <strong className="font-mono text-ink">{category}</strong>
            </div>
          </section>

          {/* Live Preview Column placeholder */}
          <section className="lg:col-span-6 rounded-md border border-hairline bg-canvas-elevated p-6 shadow-xs sticky top-8">
            <div className="mb-4 pb-3 border-b border-hairline flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-ink">Live Preview</h2>
                <p className="text-xs text-mute mt-1">Real-time template rendering will be mounted here in Phase 1.</p>
              </div>
              <span className="text-xs font-mono bg-canvas px-2.5 py-1 rounded border border-hairline text-mute">
                Print A4
              </span>
            </div>
            <div className="rounded border border-dashed border-hairline-soft p-12 text-center text-sm text-mute min-h-[380px] flex items-center justify-center">
              Preview Pane Scaffolding
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

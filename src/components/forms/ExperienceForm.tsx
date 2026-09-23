import React from 'react';
import type { ExperienceEntry } from '../../lib/schema';

interface ExperienceFormProps {
  experience: ExperienceEntry[];
  onChangeExperience: (updated: ExperienceEntry[]) => void;
}

export default function ExperienceForm({
  experience,
  onChangeExperience,
}: ExperienceFormProps) {
  const handleAddExperience = () => {
    onChangeExperience([
      ...experience,
      {
        company: '',
        role: '',
        startDate: '',
        endDate: '',
        bullets: [''],
      },
    ]);
  };

  const handleUpdateEntry = (index: number, field: keyof ExperienceEntry, value: any) => {
    const updated = [...experience];
    updated[index] = { ...updated[index], [field]: value };
    onChangeExperience(updated);
  };

  const handleRemoveEntry = (index: number) => {
    onChangeExperience(experience.filter((_, i) => i !== index));
  };

  const handleBulletChange = (expIndex: number, bulletIndex: number, text: string) => {
    const updated = [...experience];
    const updatedBullets = [...(updated[expIndex].bullets || [])];
    updatedBullets[bulletIndex] = text;
    updated[expIndex] = { ...updated[expIndex], bullets: updatedBullets };
    onChangeExperience(updated);
  };

  const handleAddBullet = (expIndex: number) => {
    const updated = [...experience];
    const updatedBullets = [...(updated[expIndex].bullets || []), ''];
    updated[expIndex] = { ...updated[expIndex], bullets: updatedBullets };
    onChangeExperience(updated);
  };

  const handleRemoveBullet = (expIndex: number, bulletIndex: number) => {
    const updated = [...experience];
    const updatedBullets = (updated[expIndex].bullets || []).filter((_, i) => i !== bulletIndex);
    updated[expIndex] = { ...updated[expIndex], bullets: updatedBullets };
    onChangeExperience(updated);
  };

  const handleMoveEntry = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experience.length) return;
    const updated = [...experience];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChangeExperience(updated);
  };

  const handleMoveBullet = (expIndex: number, bulletIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? bulletIndex - 1 : bulletIndex + 1;
    const bullets = [...(experience[expIndex].bullets || [])];
    if (targetIndex < 0 || targetIndex >= bullets.length) return;
    const temp = bullets[bulletIndex];
    bullets[bulletIndex] = bullets[targetIndex];
    bullets[targetIndex] = temp;
    const updated = [...experience];
    updated[expIndex] = { ...updated[expIndex], bullets };
    onChangeExperience(updated);
  };

  return (
    <div className="space-y-6 text-xs sm:text-sm">
      <div className="flex items-center justify-between border-b border-hairline pb-3">
        <div>
          <h3 className="text-base font-semibold text-ink">Work Experience</h3>
          <p className="text-xs text-mute mt-0.5">
            Your career history, responsibilities, and impactful achievements.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddExperience}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-sm bg-primary text-on-primary text-xs font-medium hover:opacity-90 transition-opacity"
        >
          + Add Role
        </button>
      </div>

      {experience.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-hairline rounded-sm bg-canvas">
          <p className="text-xs text-mute mb-2">No work experience added yet.</p>
          <button
            type="button"
            onClick={handleAddExperience}
            className="text-xs font-medium text-link hover:underline"
          >
            Add your primary job or internship
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {experience.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-sm border border-hairline bg-canvas space-y-3 relative group"
            >
              <div className="flex items-center justify-between border-b border-hairline pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-medium text-mute uppercase">
                    Role #{idx + 1}
                  </span>
                  <div className="inline-flex items-center border border-hairline rounded-sm bg-canvas-elevated shadow-2xs overflow-hidden">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveEntry(idx, 'up')}
                      className="px-1.5 py-0.5 text-[10px] text-mute hover:text-ink disabled:opacity-25 disabled:cursor-not-allowed hover:bg-canvas transition-colors cursor-pointer"
                      title="Move role up"
                      aria-label="Move role up"
                    >
                      ▲
                    </button>
                    <div className="h-3 w-px bg-hairline" />
                    <button
                      type="button"
                      disabled={idx === experience.length - 1}
                      onClick={() => handleMoveEntry(idx, 'down')}
                      className="px-1.5 py-0.5 text-[10px] text-mute hover:text-ink disabled:opacity-25 disabled:cursor-not-allowed hover:bg-canvas transition-colors cursor-pointer"
                      title="Move role down"
                      aria-label="Move role down"
                    >
                      ▼
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveEntry(idx)}
                  className="text-xs text-mute hover:text-error transition-colors cursor-pointer"
                >
                  Delete Role
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-body mb-1">
                    Job Title / Role
                  </label>
                  <input
                    type="text"
                    value={item.role}
                    onChange={(e) => handleUpdateEntry(idx, 'role', e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full px-3 py-1.5 rounded-sm border border-hairline bg-canvas-elevated text-ink text-xs focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-body mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={item.company}
                    onChange={(e) => handleUpdateEntry(idx, 'company', e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-3 py-1.5 rounded-sm border border-hairline bg-canvas-elevated text-ink text-xs focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-body mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={item.startDate}
                    onChange={(e) => handleUpdateEntry(idx, 'startDate', e.target.value)}
                    placeholder="e.g. Jan 2022"
                    className="w-full px-3 py-1.5 rounded-sm border border-hairline bg-canvas-elevated text-ink text-xs focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-body mb-1">
                    End Date
                  </label>
                  <input
                    type="text"
                    value={item.endDate}
                    onChange={(e) => handleUpdateEntry(idx, 'endDate', e.target.value)}
                    placeholder="e.g. Present or Dec 2023"
                    className="w-full px-3 py-1.5 rounded-sm border border-hairline bg-canvas-elevated text-ink text-xs focus:outline-none focus:border-ink"
                  />
                </div>
              </div>

              {/* Bullet Points */}
              <div className="space-y-2 pt-2 border-t border-hairline">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-body">
                    Key Achievements & Responsibilities
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddBullet(idx)}
                    className="text-xs font-medium text-link hover:text-link-deep transition-colors"
                  >
                    + Add Bullet
                  </button>
                </div>

                <div className="space-y-2">
                  {(item.bullets || []).map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-1.5">
                      <span className="mt-2 text-mute text-xs">•</span>
                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => handleBulletChange(idx, bIdx, e.target.value)}
                        placeholder="Action verb + context + measurable result (e.g. Increased page load speed by 30% by...)"
                        className="flex-1 px-3 py-1.5 rounded-sm border border-hairline bg-canvas-elevated text-ink text-xs focus:outline-none focus:border-ink leading-relaxed"
                      />
                      <div className="flex flex-col gap-0.5 pt-0.5">
                        <button
                          type="button"
                          disabled={bIdx === 0}
                          onClick={() => handleMoveBullet(idx, bIdx, 'up')}
                          className="px-1 py-0.5 text-[9px] text-mute hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed hover:bg-canvas rounded-xs transition-colors cursor-pointer"
                          title="Move bullet up"
                          aria-label="Move bullet up"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          disabled={bIdx === (item.bullets || []).length - 1}
                          onClick={() => handleMoveBullet(idx, bIdx, 'down')}
                          className="px-1 py-0.5 text-[9px] text-mute hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed hover:bg-canvas rounded-xs transition-colors cursor-pointer"
                          title="Move bullet down"
                          aria-label="Move bullet down"
                        >
                          ▼
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveBullet(idx, bIdx)}
                        className="mt-1 px-1.5 py-0.5 text-xs text-mute hover:text-error transition-colors cursor-pointer"
                        title="Delete bullet"
                        aria-label="Delete bullet"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

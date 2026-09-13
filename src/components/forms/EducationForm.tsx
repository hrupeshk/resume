import React from 'react';
import type { EducationEntry } from '../../lib/schema';

interface EducationFormProps {
  education: EducationEntry[];
  onChangeEducation: (updated: EducationEntry[]) => void;
}

export default function EducationForm({
  education,
  onChangeEducation,
}: EducationFormProps) {
  const handleAddEducation = () => {
    onChangeEducation([
      ...education,
      {
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        grade: '',
      },
    ]);
  };

  const handleUpdateEntry = (index: number, field: keyof EducationEntry, value: string) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    onChangeEducation(updated);
  };

  const handleRemoveEntry = (index: number) => {
    onChangeEducation(education.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 text-xs sm:text-sm">
      <div className="flex items-center justify-between border-b border-hairline pb-3">
        <div>
          <h3 className="text-base font-semibold text-ink">Education</h3>
          <p className="text-xs text-mute mt-0.5">
            Degrees, certifications, and academic background.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddEducation}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-sm bg-primary text-on-primary text-xs font-medium hover:opacity-90 transition-opacity"
        >
          + Add Education
        </button>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-hairline rounded-sm bg-canvas">
          <p className="text-xs text-mute mb-2">No education entries added yet.</p>
          <button
            type="button"
            onClick={handleAddEducation}
            className="text-xs font-medium text-link hover:underline"
          >
            Add your first degree or university
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-sm border border-hairline bg-canvas space-y-3 relative group"
            >
              <div className="flex items-center justify-between border-b border-hairline pb-2">
                <span className="text-xs font-mono font-medium text-mute uppercase">
                  Education #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveEntry(idx)}
                  className="text-xs text-mute hover:text-error transition-colors"
                >
                  Delete
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-medium text-body mb-1">
                    Institution / University
                  </label>
                  <input
                    type="text"
                    value={item.institution}
                    onChange={(e) => handleUpdateEntry(idx, 'institution', e.target.value)}
                    placeholder="e.g. UC Berkeley"
                    className="w-full px-3 py-1.5 rounded-sm border border-hairline bg-canvas-elevated text-ink text-xs focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-body mb-1">
                    Degree
                  </label>
                  <input
                    type="text"
                    value={item.degree}
                    onChange={(e) => handleUpdateEntry(idx, 'degree', e.target.value)}
                    placeholder="e.g. B.S."
                    className="w-full px-3 py-1.5 rounded-sm border border-hairline bg-canvas-elevated text-ink text-xs focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-body mb-1">
                    Field of Study / Major
                  </label>
                  <input
                    type="text"
                    value={item.field || ''}
                    onChange={(e) => handleUpdateEntry(idx, 'field', e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full px-3 py-1.5 rounded-sm border border-hairline bg-canvas-elevated text-ink text-xs focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-body mb-1">
                    Start Date / Year
                  </label>
                  <input
                    type="text"
                    value={item.startDate}
                    onChange={(e) => handleUpdateEntry(idx, 'startDate', e.target.value)}
                    placeholder="e.g. 2017"
                    className="w-full px-3 py-1.5 rounded-sm border border-hairline bg-canvas-elevated text-ink text-xs focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-body mb-1">
                    End Date / Year
                  </label>
                  <input
                    type="text"
                    value={item.endDate}
                    onChange={(e) => handleUpdateEntry(idx, 'endDate', e.target.value)}
                    placeholder="e.g. 2021"
                    className="w-full px-3 py-1.5 rounded-sm border border-hairline bg-canvas-elevated text-ink text-xs focus:outline-none focus:border-ink"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-medium text-body mb-1">
                    Grade / GPA (Optional)
                  </label>
                  <input
                    type="text"
                    value={item.grade || ''}
                    onChange={(e) => handleUpdateEntry(idx, 'grade', e.target.value)}
                    placeholder="e.g. 3.85 GPA or First Class"
                    className="w-full px-3 py-1.5 rounded-sm border border-hairline bg-canvas-elevated text-ink text-xs focus:outline-none focus:border-ink"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

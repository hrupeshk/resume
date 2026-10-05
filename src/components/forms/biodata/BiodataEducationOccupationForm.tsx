import React from 'react';
import type { BiodataEducationEntry, BiodataOccupation } from '../../../lib/schema';

interface BiodataEducationOccupationFormProps {
  education: BiodataEducationEntry[];
  occupation: BiodataOccupation;
  onChangeEducation: (education: BiodataEducationEntry[]) => void;
  onChangeOccupation: (occupation: BiodataOccupation) => void;
}

export default function BiodataEducationOccupationForm({
  education,
  occupation,
  onChangeEducation,
  onChangeOccupation,
}: BiodataEducationOccupationFormProps) {
  // Education entry handlers
  const handleAddEducation = () => {
    onChangeEducation([
      ...education,
      { degree: '', institution: '' },
    ]);
  };

  const handleUpdateEducationEntry = (
    index: number,
    field: keyof BiodataEducationEntry,
    value: string
  ) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    onChangeEducation(updated);
  };

  const handleRemoveEducation = (index: number) => {
    onChangeEducation(education.filter((_, i) => i !== index));
  };

  const handleMoveEducation = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= education.length) return;
    const updated = [...education];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChangeEducation(updated);
  };

  // Occupation handlers
  const handleUpdateOccupationField = (field: keyof BiodataOccupation, value: string) => {
    onChangeOccupation({
      ...occupation,
      [field]: value,
    });
  };

  return (
    <div className="space-y-8 text-xs sm:text-sm">
      {/* Education Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
          <div>
            <h3 className="text-base font-semibold text-ink">Educational Qualifications</h3>
            <p className="text-xs text-mute mt-0.5">
              Degrees, colleges, and schooling details. Empty entries are suppressed automatically.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddEducation}
            className="px-3 py-1.5 rounded-sm bg-neutral-900 text-white font-medium text-xs hover:bg-neutral-800 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
          >
            <span>+ Add Degree / Qualification</span>
          </button>
        </div>

        {education.length === 0 ? (
          <div className="p-4 rounded-sm border border-dashed border-hairline bg-canvas/40 text-center space-y-2">
            <p className="text-xs text-mute">No educational qualifications added yet.</p>
            <button
              type="button"
              onClick={handleAddEducation}
              className="text-xs text-ink font-semibold hover:underline cursor-pointer"
            >
              + Add first degree or schooling
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {education.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-sm border border-hairline bg-canvas-elevated space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between border-b border-hairline pb-2">
                  <span className="text-xs font-semibold text-ink">
                    Qualification #{index + 1}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveEducation(index, 'up')}
                      className="p-1 text-mute hover:text-ink disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={index === education.length - 1}
                      onClick={() => handleMoveEducation(index, 'down')}
                      className="p-1 text-mute hover:text-ink disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(index)}
                      className="text-xs text-error hover:underline cursor-pointer ml-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-body mb-1">
                      Degree / Program / Schooling
                    </label>
                    <input
                      type="text"
                      value={item.degree}
                      onChange={(e) =>
                        handleUpdateEducationEntry(index, 'degree', e.target.value)
                      }
                      placeholder="e.g. B.Tech in Computer Science"
                      className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas text-ink placeholder:text-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-body mb-1">
                      Institution / University / Details
                    </label>
                    <input
                      type="text"
                      value={item.institution}
                      onChange={(e) =>
                        handleUpdateEducationEntry(index, 'institution', e.target.value)
                      }
                      placeholder="e.g. NIT Jaipur, 2018 (First Class)"
                      className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas text-ink placeholder:text-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Occupation / Profession Section */}
      <div className="space-y-4 pt-4 border-t border-hairline">
        <div className="border-b border-hairline pb-3">
          <h3 className="text-base font-semibold text-ink">Occupation & Professional Career</h3>
          <p className="text-xs text-mute mt-0.5">
            Current job designation, employer, and package. All fields are completely optional.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="bioDesignation" className="block text-xs font-medium text-body mb-1">
              Designation / Profession
            </label>
            <input
              id="bioDesignation"
              type="text"
              value={occupation.designation || ''}
              onChange={(e) => handleUpdateOccupationField('designation', e.target.value)}
              placeholder="e.g. Senior Software Engineer / CA / Bank Officer"
              className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors"
            />
          </div>

          <div>
            <label htmlFor="bioCompany" className="block text-xs font-medium text-body mb-1">
              Company / Organization / Location
            </label>
            <input
              id="bioCompany"
              type="text"
              value={occupation.company || ''}
              onChange={(e) => handleUpdateOccupationField('company', e.target.value)}
              placeholder="e.g. Microsoft India, Hyderabad / Govt. Sector"
              className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="bioIncome" className="block text-xs font-medium text-body mb-1">
              Annual Income / CTC <span className="text-mute">(Optional — leave blank if you prefer not to disclose)</span>
            </label>
            <input
              id="bioIncome"
              type="text"
              value={occupation.income || ''}
              onChange={(e) => handleUpdateOccupationField('income', e.target.value)}
              placeholder="e.g. ₹32 LPA or ₹15 - 20 LPA"
              className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

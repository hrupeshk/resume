import React from 'react';
import type { BiodataFamily, SiblingEntry } from '../../../lib/schema';

interface BiodataFamilyFormProps {
  family: BiodataFamily;
  onChangeFamily: (family: BiodataFamily) => void;
}

export default function BiodataFamilyForm({
  family,
  onChangeFamily,
}: BiodataFamilyFormProps) {
  const handleUpdateFamilyField = (field: keyof BiodataFamily, value: any) => {
    onChangeFamily({
      ...family,
      [field]: value,
    });
  };

  const handleAddSibling = () => {
    const updated = [
      ...(family.siblings || []),
      { name: '', relation: '', occupation: '' },
    ];
    handleUpdateFamilyField('siblings', updated);
  };

  const handleUpdateSiblingEntry = (
    index: number,
    field: keyof SiblingEntry,
    value: string
  ) => {
    const updated = [...(family.siblings || [])];
    updated[index] = { ...updated[index], [field]: value };
    handleUpdateFamilyField('siblings', updated);
  };

  const handleRemoveSibling = (index: number) => {
    const updated = (family.siblings || []).filter((_, i) => i !== index);
    handleUpdateFamilyField('siblings', updated);
  };

  return (
    <div className="space-y-6 text-xs sm:text-sm">
      <div className="border-b border-hairline pb-3">
        <h3 className="text-base font-semibold text-ink">Family Background</h3>
        <p className="text-xs text-mute mt-0.5">
          Parents, siblings, and ancestral hometown. Empty fields are omitted automatically.
        </p>
      </div>

      {/* Parents Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="bioFatherName" className="block text-xs font-medium text-body mb-1">
            Father&apos;s Name
          </label>
          <input
            id="bioFatherName"
            type="text"
            value={family.fatherName || ''}
            onChange={(e) => handleUpdateFamilyField('fatherName', e.target.value)}
            placeholder="e.g. Dr. Ramesh Chandra Sharma"
            className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors"
          />
        </div>

        <div>
          <label htmlFor="bioFatherOcc" className="block text-xs font-medium text-body mb-1">
            Father&apos;s Profession / Status
          </label>
          <input
            id="bioFatherOcc"
            type="text"
            value={family.fatherOccupation || ''}
            onChange={(e) => handleUpdateFamilyField('fatherOccupation', e.target.value)}
            placeholder="e.g. Professor & HOD (Physics) / Retired Bank Manager"
            className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors"
          />
        </div>

        <div>
          <label htmlFor="bioMotherName" className="block text-xs font-medium text-body mb-1">
            Mother&apos;s Name
          </label>
          <input
            id="bioMotherName"
            type="text"
            value={family.motherName || ''}
            onChange={(e) => handleUpdateFamilyField('motherName', e.target.value)}
            placeholder="e.g. Mrs. Sunita Sharma"
            className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors"
          />
        </div>

        <div>
          <label htmlFor="bioMotherOcc" className="block text-xs font-medium text-body mb-1">
            Mother&apos;s Profession / Status
          </label>
          <input
            id="bioMotherOcc"
            type="text"
            value={family.motherOccupation || ''}
            onChange={(e) => handleUpdateFamilyField('motherOccupation', e.target.value)}
            placeholder="e.g. Homemaker / School Teacher / Govt. Officer"
            className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="bioNativePlace" className="block text-xs font-medium text-body mb-1">
            Native Place / Ancestral Town
          </label>
          <input
            id="bioNativePlace"
            type="text"
            value={family.nativePlace || ''}
            onChange={(e) => handleUpdateFamilyField('nativePlace', e.target.value)}
            placeholder="e.g. Jaipur, Rajasthan (Ancestral: Alwar)"
            className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors"
          />
        </div>
      </div>

      {/* Siblings Section */}
      <div className="space-y-4 pt-4 border-t border-hairline">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-2">
          <div>
            <h4 className="text-sm font-semibold text-ink">Brothers & Sisters (Siblings)</h4>
            <p className="text-xs text-mute">Details of brothers and sisters including marital status and career.</p>
          </div>
          <button
            type="button"
            onClick={handleAddSibling}
            className="px-3 py-1 rounded-sm bg-neutral-900 text-white font-medium text-xs hover:bg-neutral-800 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
          >
            <span>+ Add Brother / Sister</span>
          </button>
        </div>

        {(!family.siblings || family.siblings.length === 0) ? (
          <div className="p-3.5 rounded-sm border border-dashed border-hairline bg-canvas/40 text-center space-y-1">
            <p className="text-xs text-mute">No siblings added yet (Leave empty if only child).</p>
            <button
              type="button"
              onClick={handleAddSibling}
              className="text-xs text-ink font-semibold hover:underline cursor-pointer"
            >
              + Add sibling information
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {family.siblings.map((sibling, index) => (
              <div
                key={index}
                className="p-3.5 rounded-sm border border-hairline bg-canvas-elevated space-y-2.5 shadow-2xs"
              >
                <div className="flex items-center justify-between border-b border-hairline pb-1.5">
                  <span className="text-xs font-semibold text-ink">Sibling #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSibling(index)}
                    className="text-xs text-error hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-body mb-1">Sibling Name</label>
                    <input
                      type="text"
                      value={sibling.name}
                      onChange={(e) => handleUpdateSiblingEntry(index, 'name', e.target.value)}
                      placeholder="e.g. Pooja Sharma"
                      className="w-full px-2.5 py-1.5 rounded-sm border border-hairline bg-canvas text-ink placeholder:text-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-body mb-1">Relation / Status</label>
                    <input
                      type="text"
                      value={sibling.relation}
                      onChange={(e) => handleUpdateSiblingEntry(index, 'relation', e.target.value)}
                      placeholder="e.g. Elder Sister (Married)"
                      className="w-full px-2.5 py-1.5 rounded-sm border border-hairline bg-canvas text-ink placeholder:text-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-body mb-1">Occupation / City</label>
                    <input
                      type="text"
                      value={sibling.occupation}
                      onChange={(e) => handleUpdateSiblingEntry(index, 'occupation', e.target.value)}
                      placeholder="e.g. Architect, Bengaluru"
                      className="w-full px-2.5 py-1.5 rounded-sm border border-hairline bg-canvas text-ink placeholder:text-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

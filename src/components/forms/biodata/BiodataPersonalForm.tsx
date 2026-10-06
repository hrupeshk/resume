import React from 'react';
import type { BiodataPersonalInfo } from '../../../lib/schema';

interface BiodataPersonalFormProps {
  personalInfo: BiodataPersonalInfo;
  onChangePersonalInfo: (updated: BiodataPersonalInfo) => void;
}

export default function BiodataPersonalForm({
  personalInfo,
  onChangePersonalInfo,
}: BiodataPersonalFormProps) {
  const handleChangeField = (field: keyof BiodataPersonalInfo, value: string) => {
    onChangePersonalInfo({
      ...personalInfo,
      [field]: value,
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      alert('Please select an image smaller than 4MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        handleChangeField('photoUrl', result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    handleChangeField('photoUrl', '');
  };

  return (
    <div className="space-y-6 text-xs sm:text-sm">
      <div className="border-b border-hairline pb-3">
        <h3 className="text-base font-semibold text-ink">Personal & Physical Details</h3>
        <p className="text-xs text-mute mt-0.5">
          Basic profile, physical attributes, and contact information. All fields left empty are omitted automatically.
        </p>
      </div>

      {/* Photo Upload Section */}
      <div className="p-4 rounded-sm border border-hairline bg-canvas/40 space-y-3">
        <label className="block text-xs font-semibold text-ink">
          Candidate Portrait / Photo <span className="text-mute font-normal">(Optional, displayed prominently in biodata templates)</span>
        </label>
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-20 h-24 rounded-md border-2 border-dashed border-hairline bg-canvas overflow-hidden flex-shrink-0 flex items-center justify-center text-mute shadow-2xs">
            {personalInfo.photoUrl ? (
              <img
                src={personalInfo.photoUrl}
                alt="Candidate Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-2">
                <svg className="w-7 h-7 mx-auto text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-[10px] text-mute block mt-1">No Photo</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-[200px] space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="text-xs text-body file:mr-2 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-on-primary hover:file:opacity-90 cursor-pointer"
            />
            <p className="text-[11px] text-mute">
              Recommended: A clear, formal portrait or ethnic-wear photograph (JPG or PNG up to 4MB).
            </p>
            {personalInfo.photoUrl && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="text-xs text-error hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>✕ Remove photograph</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Personal Identity Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label htmlFor="bioFullName" className="block text-xs font-medium text-body mb-1">
            Candidate Full Name <span className="text-error">*</span>
          </label>
          <input
            id="bioFullName"
            type="text"
            value={personalInfo.fullName || ''}
            onChange={(e) => handleChangeField('fullName', e.target.value)}
            placeholder="e.g. Aditya Sharma"
            className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors"
          />
        </div>

        <div>
          <label htmlFor="bioDob" className="block text-xs font-medium text-body mb-1">
            Date of Birth
          </label>
          <input
            id="bioDob"
            type="text"
            value={personalInfo.dateOfBirth || ''}
            onChange={(e) => handleChangeField('dateOfBirth', e.target.value)}
            placeholder="e.g. 14 August 1996"
            className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors"
          />
        </div>

        <div>
          <label htmlFor="bioTob" className="block text-xs font-medium text-body mb-1">
            Time of Birth
          </label>
          <input
            id="bioTob"
            type="text"
            value={personalInfo.timeOfBirth || ''}
            onChange={(e) => handleChangeField('timeOfBirth', e.target.value)}
            placeholder="e.g. 07:45 AM"
            className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors"
          />
        </div>

        <div>
          <label htmlFor="bioPob" className="block text-xs font-medium text-body mb-1">
            Place of Birth
          </label>
          <input
            id="bioPob"
            type="text"
            value={personalInfo.placeOfBirth || ''}
            onChange={(e) => handleChangeField('placeOfBirth', e.target.value)}
            placeholder="e.g. Jaipur, Rajasthan"
            className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors"
          />
        </div>

        <div>
          <label htmlFor="bioHeight" className="block text-xs font-medium text-body mb-1">
            Height
          </label>
          <input
            id="bioHeight"
            type="text"
            value={personalInfo.height || ''}
            onChange={(e) => handleChangeField('height', e.target.value)}
            placeholder="e.g. 5' 11&quot; (180 cm)"
            className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors"
          />
        </div>

        <div>
          <label htmlFor="bioComplexion" className="block text-xs font-medium text-body mb-1">
            Complexion
          </label>
          <input
            id="bioComplexion"
            type="text"
            value={personalInfo.complexion || ''}
            onChange={(e) => handleChangeField('complexion', e.target.value)}
            placeholder="e.g. Fair / Wheatish"
            className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors"
          />
        </div>

        <div>
          <label htmlFor="bioDiet" className="block text-xs font-medium text-body mb-1">
            Diet / Eating Habits
          </label>
          <input
            id="bioDiet"
            type="text"
            value={personalInfo.diet || ''}
            onChange={(e) => handleChangeField('diet', e.target.value)}
            placeholder="e.g. Vegetarian / Non-Vegetarian / Jain"
            className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors"
          />
        </div>

        <div>
          <label htmlFor="bioPhone" className="block text-xs font-medium text-body mb-1">
            Contact Number <span className="text-mute">(Optional)</span>
          </label>
          <input
            id="bioPhone"
            type="tel"
            value={personalInfo.phone || ''}
            onChange={(e) => handleChangeField('phone', e.target.value)}
            placeholder="e.g. +91 90000 00000"
            className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors"
          />
        </div>

        <div>
          <label htmlFor="bioEmail" className="block text-xs font-medium text-body mb-1">
            Email Address <span className="text-mute">(Optional)</span>
          </label>
          <input
            id="bioEmail"
            type="email"
            value={personalInfo.email || ''}
            onChange={(e) => handleChangeField('email', e.target.value)}
            placeholder="e.g. aditya.sharma@example.com"
            className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors"
          />
        </div>
      </div>
    </div>
  );
}

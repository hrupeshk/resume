import React from 'react';
import type { ResumePersonalInfo } from '../../lib/schema';

interface PersonalFormProps {
  personalInfo: ResumePersonalInfo;
  summary: string;
  onChangePersonalInfo: (updated: ResumePersonalInfo) => void;
  onChangeSummary: (summary: string) => void;
}

export default function PersonalForm({
  personalInfo,
  summary,
  onChangePersonalInfo,
  onChangeSummary,
}: PersonalFormProps) {
  const handleChangeField = (field: keyof ResumePersonalInfo, value: string) => {
    onChangePersonalInfo({
      ...personalInfo,
      [field]: value,
    });
  };

  const handleLinkChange = (index: number, field: 'label' | 'url', value: string) => {
    const updatedLinks = [...(personalInfo.links || [])];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    onChangePersonalInfo({
      ...personalInfo,
      links: updatedLinks,
    });
  };

  const handleAddLink = () => {
    onChangePersonalInfo({
      ...personalInfo,
      links: [...(personalInfo.links || []), { label: 'Link', url: '' }],
    });
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinks = (personalInfo.links || []).filter((_, i) => i !== index);
    onChangePersonalInfo({
      ...personalInfo,
      links: updatedLinks,
    });
  };

  return (
    <div className="space-y-6 text-xs sm:text-sm">
      <div className="border-b border-hairline pb-3">
        <h3 className="text-base font-semibold text-ink">Personal Information</h3>
        <p className="text-xs text-mute mt-0.5">
          Your contact details and elevator pitch. Empty fields are hidden automatically.
        </p>
      </div>

      {/* Grid for Contact Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="fullName" className="block text-xs font-medium text-body mb-1">
            Full Name <span className="text-mute">(e.g. Rupesh Kumar)</span>
          </label>
          <input
            id="fullName"
            type="text"
            value={personalInfo.fullName || ''}
            onChange={(e) => handleChangeField('fullName', e.target.value)}
            placeholder="Jane Doe"
            className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus:border-ink transition-colors"
          />
        </div>

        <div>
          <label htmlFor="title" className="block text-xs font-medium text-body mb-1">
            Target Role / Headline <span className="text-mute">(e.g. Web Developer)</span>
          </label>
          <input
            id="title"
            type="text"
            value={personalInfo.title || ''}
            onChange={(e) => handleChangeField('title', e.target.value)}
            placeholder="Web Developer / Full-Stack Engineer"
            className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus:border-ink transition-colors"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-medium text-body mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={personalInfo.email || ''}
            onChange={(e) => handleChangeField('email', e.target.value)}
            placeholder="jane.doe@example.com"
            className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus:border-ink transition-colors"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-xs font-medium text-body mb-1">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={personalInfo.phone || ''}
            onChange={(e) => handleChangeField('phone', e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus:border-ink transition-colors"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-xs font-medium text-body mb-1">
            Location
          </label>
          <input
            id="location"
            type="text"
            value={personalInfo.location || ''}
            onChange={(e) => handleChangeField('location', e.target.value)}
            placeholder="Darbhanga, India or Remote"
            className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus:border-ink transition-colors"
          />
        </div>

        <div className="sm:col-span-2 pt-2 border-t border-hairline">
          <label className="block text-xs font-medium text-body mb-2">
            Profile Photo / Headshot <span className="text-mute">(Optional, shown in templates that support photos)</span>
          </label>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full border-2 border-hairline bg-canvas overflow-hidden flex-shrink-0 flex items-center justify-center text-mute">
              {personalInfo.photoUrl ? (
                <img src={personalInfo.photoUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-6 h-6 text-neutral-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
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
                }}
                className="text-xs text-body file:mr-2 file:py-1 file:px-2.5 file:rounded-sm file:border-0 file:text-xs file:font-medium file:bg-primary file:text-on-primary hover:file:opacity-90 cursor-pointer"
              />

              {personalInfo.photoUrl && (
                <button
                  type="button"
                  onClick={() => handleChangeField('photoUrl', '')}
                  className="px-2.5 py-1 rounded-sm text-xs text-mute hover:text-error transition-colors cursor-pointer border border-hairline"
                >
                  Remove Photo
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Social & Professional Links */}
      <div className="space-y-3 pt-2 border-t border-hairline">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-body">
            Links & Profiles (GitHub, LinkedIn, Portfolio)
          </label>
          <button
            type="button"
            onClick={handleAddLink}
            className="text-xs font-medium text-link hover:text-link-deep transition-colors"
          >
            + Add Link
          </button>
        </div>

        {(personalInfo.links || []).map((link, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={link.label}
              onChange={(e) => handleLinkChange(idx, 'label', e.target.value)}
              placeholder="Label (e.g. GitHub)"
              className="w-1/3 px-3 py-1.5 rounded-sm border border-hairline bg-canvas-elevated text-ink text-xs focus:outline-none focus:border-ink"
            />
            <input
              type="url"
              value={link.url}
              onChange={(e) => handleLinkChange(idx, 'url', e.target.value)}
              placeholder="https://..."
              className="flex-1 px-3 py-1.5 rounded-sm border border-hairline bg-canvas-elevated text-ink text-xs focus:outline-none focus:border-ink"
            />
            <button
              type="button"
              onClick={() => handleRemoveLink(idx)}
              className="px-2 py-1 text-xs text-mute hover:text-error transition-colors"
              title="Remove link"
              aria-label="Remove link"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Professional Summary */}
      <div className="space-y-2 pt-2 border-t border-hairline">
        <label htmlFor="summary" className="block text-xs font-medium text-body">
          Professional Summary
        </label>
        <textarea
          id="summary"
          rows={4}
          value={summary || ''}
          onChange={(e) => onChangeSummary(e.target.value)}
          placeholder="Experienced engineer passionate about building reliable web systems..."
          className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus:border-ink transition-colors leading-relaxed text-xs sm:text-sm"
        />
      </div>
    </div>
  );
}

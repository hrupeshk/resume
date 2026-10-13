import React, { useState } from 'react';
import type { BiodataHoroscope, BiodataContact } from '../../../lib/schema';

const SUGGESTED_BIODATA_HOBBIES = [
  'Reading',
  'Traveling',
  'Cooking',
  'Classical Music',
  'Cricket',
  'Photography',
  'Yoga & Fitness',
  'Gardening',
  'Badminton',
  'Painting & Art',
  'Movies & Cinema',
  'Writing',
];

interface BiodataHoroscopePreferencesFormProps {
  horoscope: BiodataHoroscope;
  contact: BiodataContact;
  partnerPreferences: string;
  hobbies?: string[];
  onChangeHoroscope: (horoscope: BiodataHoroscope) => void;
  onChangeContact: (contact: BiodataContact) => void;
  onChangePartnerPreferences: (preferences: string) => void;
  onChangeHobbies?: (hobbies: string[]) => void;
}

export default function BiodataHoroscopePreferencesForm({
  horoscope,
  contact,
  partnerPreferences,
  hobbies = [],
  onChangeHoroscope,
  onChangeContact,
  onChangePartnerPreferences,
  onChangeHobbies,
}: BiodataHoroscopePreferencesFormProps) {
  const handleUpdateHoroscopeField = (field: keyof BiodataHoroscope, value: string) => {
    onChangeHoroscope({
      ...horoscope,
      [field]: value,
    });
  };

  const handleUpdateContactField = (field: keyof BiodataContact, value: string) => {
    onChangeContact({
      ...contact,
      [field]: value,
    });
  };

  const [hobbyInput, setHobbyInput] = useState('');

  const addHobbies = (newItems: string[]) => {
    if (!onChangeHobbies) return;
    const cleaned = newItems
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (cleaned.length === 0) return;

    const next = [...hobbies];
    for (const item of cleaned) {
      if (!next.some((h) => h.toLowerCase() === item.toLowerCase())) {
        next.push(item);
      }
    }
    onChangeHobbies(next);
  };

  const handleAddHobby = () => {
    const trimmed = hobbyInput.trim();
    if (!trimmed) return;
    const items = trimmed.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean);
    addHobbies(items);
    setHobbyInput('');
  };

  const handleKeyDownHobby = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddHobby();
    } else if (e.key === 'Backspace' && !hobbyInput && hobbies.length > 0) {
      handleRemoveHobby(hobbies.length - 1);
    }
  };

  const handleHobbyInputChange = (val: string) => {
    if (val.includes(',') || val.includes(';')) {
      const parts = val.split(/[,;]/);
      const completed = parts
        .slice(0, -1)
        .map((s) => s.trim())
        .filter(Boolean);
      const remainder = parts[parts.length - 1];

      if (completed.length > 0) {
        addHobbies(completed);
      }
      setHobbyInput(remainder.trimStart());
    } else {
      setHobbyInput(val);
    }
  };

  const handlePasteHobby = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text');
    if (pasted.includes(',') || pasted.includes(';') || pasted.includes('\n')) {
      e.preventDefault();
      const items = pasted
        .split(/[,;\n]/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (items.length > 0) {
        addHobbies(items);
      }
      setHobbyInput('');
    }
  };

  const handleBlurHobby = () => {
    if (hobbyInput.trim()) {
      handleAddHobby();
    }
  };

  const handleRemoveHobby = (index: number) => {
    if (onChangeHobbies) {
      onChangeHobbies(hobbies.filter((_, i) => i !== index));
    }
  };

  const handleClearAllHobbies = () => {
    if (onChangeHobbies) {
      onChangeHobbies([]);
    }
  };

  const handleEditHobby = (index: number) => {
    const item = hobbies[index];
    if (item) {
      setHobbyInput(item);
      handleRemoveHobby(index);
    }
  };

  const handleAddSuggested = (suggested: string) => {
    addHobbies([suggested]);
  };

  return (
    <div className="space-y-8 text-xs sm:text-sm">
      {/* Horoscope / Kundali Section */}
      <div className="space-y-4">
        <div className="border-b border-hairline pb-3">
          <h3 className="text-base font-semibold text-ink">Horoscope & Kundali Details</h3>
          <p className="text-xs text-mute mt-0.5">
            Astro credentials (Gothra, Nakshatra, Rashi, Manglik, Kuldevta). All fields are strictly optional.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="bioGothra" className="block text-xs font-medium text-body mb-1">
              Gothra / Gotra
            </label>
            <input
              id="bioGothra"
              type="text"
              value={horoscope.gothra || ''}
              onChange={(e) => handleUpdateHoroscopeField('gothra', e.target.value)}
              placeholder="e.g. Kaushik / Kashyap / Bharadwaja"
              className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors"
            />
          </div>

          <div>
            <label htmlFor="bioRashi" className="block text-xs font-medium text-body mb-1">
              Rashi / Moon Sign
            </label>
            <input
              id="bioRashi"
              type="text"
              value={horoscope.rashi || ''}
              onChange={(e) => handleUpdateHoroscopeField('rashi', e.target.value)}
              placeholder="e.g. Karka (Cancer) / Simha (Leo)"
              className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors"
            />
          </div>

          <div>
            <label htmlFor="bioNakshatra" className="block text-xs font-medium text-body mb-1">
              Nakshatra / Birth Star
            </label>
            <input
              id="bioNakshatra"
              type="text"
              value={horoscope.nakshatra || ''}
              onChange={(e) => handleUpdateHoroscopeField('nakshatra', e.target.value)}
              placeholder="e.g. Pushya / Rohini / Ashwini"
              className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors"
            />
          </div>

          <div>
            <label htmlFor="bioManglik" className="block text-xs font-medium text-body mb-1">
              Manglik Dosha Status
            </label>
            <input
              id="bioManglik"
              type="text"
              value={horoscope.manglik || ''}
              onChange={(e) => handleUpdateHoroscopeField('manglik', e.target.value)}
              placeholder="e.g. Non-Manglik / Manglik / Anshik"
              className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="bioKuldevta" className="block text-xs font-medium text-body mb-1">
              Kuldevta / Kuldevi (Family Spiritual Deity) <span className="text-mute">(Optional)</span>
            </label>
            <input
              id="bioKuldevta"
              type="text"
              value={horoscope.kuldevta || ''}
              onChange={(e) => handleUpdateHoroscopeField('kuldevta', e.target.value)}
              placeholder="e.g. Shri Shakambhari Mata / Karni Mata / Bheruji Maharaj"
              className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Partner Preferences & Hobbies Section */}
      <div className="space-y-4 pt-4 border-t border-hairline">
        <div className="border-b border-hairline pb-3">
          <h3 className="text-base font-semibold text-ink">Partner Preferences & Hobbies</h3>
          <p className="text-xs text-mute mt-0.5">
            Describe desired partner qualities and showcase candidate interests.
          </p>
        </div>

        <div>
          <label htmlFor="bioPartnerPreferences" className="block text-xs font-medium text-body mb-1">
            Expectations / Desired Partner Qualities
          </label>
          <textarea
            id="bioPartnerPreferences"
            rows={4}
            value={partnerPreferences || ''}
            onChange={(e) => onChangePartnerPreferences(e.target.value)}
            placeholder="e.g. Looking for a well-educated, cultured, and understanding partner with good family values. Professionally qualified (Engineer, Doctor, CA, MBA, or equivalent). Respectful towards traditions with an open-minded outlook."
            className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors leading-relaxed"
          />
        </div>

        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <label htmlFor="bioHobbies" className="block text-xs font-medium text-body">
              Hobbies & Interests{' '}
              <span className="text-mute font-normal">(Press Enter or comma to add)</span>
            </label>
            {hobbies && hobbies.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllHobbies}
                className="text-[11px] text-mute hover:text-red-500 transition-colors cursor-pointer"
              >
                Clear all ({hobbies.length})
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <input
              id="bioHobbies"
              type="text"
              value={hobbyInput}
              onChange={(e) => handleHobbyInputChange(e.target.value)}
              onKeyDown={handleKeyDownHobby}
              onBlur={handleBlurHobby}
              onPaste={handlePasteHobby}
              placeholder="Type a hobby (e.g. Classical Music, Cricket, Traveling) and press Enter or comma"
              className="flex-1 px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 text-xs focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors"
            />
            <button
              type="button"
              onClick={handleAddHobby}
              disabled={!hobbyInput.trim()}
              className="px-4 py-2 rounded-sm bg-primary text-on-primary text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
            >
              + Add
            </button>
          </div>

          {/* Quick Add Suggestions */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-mute">
              Quick Add Suggestions:
            </span>
            <div className="flex flex-wrap gap-1">
              {SUGGESTED_BIODATA_HOBBIES.map((item) => {
                const alreadyAdded = (hobbies || []).some(
                  (h) => h.toLowerCase() === item.toLowerCase()
                );
                return (
                  <button
                    key={item}
                    type="button"
                    disabled={alreadyAdded}
                    onClick={() => handleAddSuggested(item)}
                    className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-colors cursor-pointer ${
                      alreadyAdded
                        ? 'border-hairline bg-canvas text-mute opacity-40 cursor-default'
                        : 'border-hairline bg-canvas-elevated hover:bg-neutral-100 hover:border-ink/40 text-body'
                    }`}
                  >
                    {alreadyAdded ? '✓ ' : '+ '}
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Hobbies Badges */}
          {hobbies && hobbies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              {hobbies.map((hobby, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-canvas-elevated border border-hairline text-ink text-xs shadow-2xs group"
                >
                  <button
                    type="button"
                    onClick={() => handleEditHobby(idx)}
                    className="hover:underline text-left cursor-pointer"
                    title="Click to edit hobby"
                  >
                    {hobby}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveHobby(idx)}
                    className="text-mute hover:text-red-500 cursor-pointer transition-colors text-sm leading-none px-0.5"
                    aria-label={`Remove hobby ${hobby}`}
                    title="Remove hobby"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact & Residential Address Section */}
      <div className="space-y-4 pt-4 border-t border-hairline">
        <div className="border-b border-hairline pb-3">
          <h3 className="text-base font-semibold text-ink">Contact & Address Details</h3>
          <p className="text-xs text-mute mt-0.5">
            Residential address and parent/guardian contact numbers for matrimonial correspondence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="bioAddress" className="block text-xs font-medium text-body mb-1">
              Residential Address
            </label>
            <input
              id="bioAddress"
              type="text"
              value={contact.address || ''}
              onChange={(e) => handleUpdateContactField('address', e.target.value)}
              placeholder="e.g. B-42, Shyam Nagar, Ajmer Road, Jaipur - 302019"
              className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="bioRefPhone" className="block text-xs font-medium text-body mb-1">
              Family / Parent Reference Phone Number
            </label>
            <input
              id="bioRefPhone"
              type="text"
              value={contact.referencePhone || ''}
              onChange={(e) => handleUpdateContactField('referencePhone', e.target.value)}
              placeholder="e.g. +91 90000 00000 (Father) / +91 90000 00001"
              className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink placeholder:text-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

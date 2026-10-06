import React from 'react';
import type { BiodataHoroscope, BiodataContact } from '../../../lib/schema';

interface BiodataHoroscopePreferencesFormProps {
  horoscope: BiodataHoroscope;
  contact: BiodataContact;
  partnerPreferences: string;
  onChangeHoroscope: (horoscope: BiodataHoroscope) => void;
  onChangeContact: (contact: BiodataContact) => void;
  onChangePartnerPreferences: (preferences: string) => void;
}

export default function BiodataHoroscopePreferencesForm({
  horoscope,
  contact,
  partnerPreferences,
  onChangeHoroscope,
  onChangeContact,
  onChangePartnerPreferences,
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

  return (
    <div className="space-y-8 text-xs sm:text-sm">
      {/* Horoscope / Kundali Section */}
      <div className="space-y-4">
        <div className="border-b border-hairline pb-3">
          <h3 className="text-base font-semibold text-ink">Horoscope & Kundali Details</h3>
          <p className="text-xs text-mute mt-0.5">
            Astro credentials (Gothra, Nakshatra, Rashi, Manglik). All fields are strictly optional.
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
        </div>
      </div>

      {/* Partner Preferences / Expectations Section */}
      <div className="space-y-4 pt-4 border-t border-hairline">
        <div className="border-b border-hairline pb-3">
          <h3 className="text-base font-semibold text-ink">Partner Preferences & Expectations</h3>
          <p className="text-xs text-mute mt-0.5">
            Describe desired educational background, values, lifestyle, or family preferences.
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

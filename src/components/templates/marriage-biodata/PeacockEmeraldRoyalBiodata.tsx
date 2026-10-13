import React from 'react';
import type { BiodataDocument } from '../../../lib/schema';

interface PeacockEmeraldRoyalBiodataProps {
  data: BiodataDocument;
  spacingDensity?: 'compact' | 'balanced' | 'spacious';
  fontSizeScale?: number;
}

export default function PeacockEmeraldRoyalBiodata({
  data,
  spacingDensity = 'balanced',
  fontSizeScale = 100,
}: PeacockEmeraldRoyalBiodataProps) {
  const { personalInfo, sections } = data;
  const { education, occupation, family, horoscope, contact, partnerPreferences, achievements, hobbies } = sections || {};

  // Strict empty section omission guards
  const hasHoroscope = Boolean(
    horoscope?.gothra?.trim() ||
    horoscope?.rashi?.trim() ||
    horoscope?.nakshatra?.trim() ||
    horoscope?.manglik?.trim() ||
    horoscope?.kuldevta?.trim()
  );

  const hasEducation = Boolean(
    education && education.some((e) => e.degree.trim() || e.institution.trim())
  );

  const hasOccupation = Boolean(
    occupation?.designation?.trim() ||
    occupation?.company?.trim() ||
    occupation?.income?.trim()
  );

  const hasAchievements = Boolean(
    achievements && achievements.some((a) => a.trim().length > 0)
  );

  const hasEducationOrOccupation = hasEducation || hasOccupation || hasAchievements;

  const hasSiblings = Boolean(
    family?.siblings &&
    family.siblings.some((s) => s.name.trim() || s.relation.trim() || s.occupation.trim())
  );

  const hasRelatives = Boolean(
    family?.relatives &&
    family.relatives.some((r) => r.name.trim() || r.relation.trim() || r.occupation.trim())
  );

  const hasFamily = Boolean(
    family?.fatherName?.trim() ||
    family?.motherName?.trim() ||
    family?.nativePlace?.trim() ||
    hasSiblings ||
    hasRelatives
  );

  const hasPreferences = Boolean(partnerPreferences?.trim());

  const hasHobbies = Boolean(
    hobbies && hobbies.some((h) => h.trim().length > 0)
  );

  const hasContact = Boolean(
    contact?.address?.trim() ||
    contact?.referencePhone?.trim() ||
    personalInfo.phone?.trim() ||
    personalInfo.email?.trim()
  );

  const hasCulturalIdentity = Boolean(
    personalInfo.religion?.trim() ||
    personalInfo.caste?.trim() ||
    personalInfo.subCaste?.trim() ||
    personalInfo.motherTongue?.trim() ||
    personalInfo.languagesKnown?.trim()
  );

  // Density configurations for crisp single A4 page containment
  const config = {
    compact: {
      outerPadding: 'p-2 sm:p-2.5',
      innerPadding: 'p-2 sm:p-2.5',
      columnGap: 'gap-2.5 sm:gap-3',
      sectionGap: 'space-y-1.5',
      cardPadding: 'p-1.5',
      photoSize: 'w-20 h-25',
      headerMargin: 'mb-1 sm:mb-1.5',
      headingSize: 'text-[11px]',
      fontSizeMultiplier: 0.94,
    },
    balanced: {
      outerPadding: 'p-3 sm:p-3.5',
      innerPadding: 'p-3 sm:p-3.5',
      columnGap: 'gap-3.5 sm:gap-4',
      sectionGap: 'space-y-2 sm:space-y-2.5',
      cardPadding: 'p-2',
      photoSize: 'w-22 h-27 sm:w-24 sm:h-29',
      headerMargin: 'mb-1.5 sm:mb-2',
      headingSize: 'text-xs',
      fontSizeMultiplier: 1.0,
    },
    spacious: {
      outerPadding: 'p-3.5 sm:p-4',
      innerPadding: 'p-3.5 sm:p-4',
      columnGap: 'gap-4 sm:gap-5',
      sectionGap: 'space-y-2.5 sm:space-y-3',
      cardPadding: 'p-2.5',
      photoSize: 'w-24 h-29 sm:w-26 sm:h-32',
      headerMargin: 'mb-2 sm:mb-2.5',
      headingSize: 'text-xs sm:text-[13px]',
      fontSizeMultiplier: 1.05,
    },
  }[spacingDensity];

  const scale = (fontSizeScale / 100) * config.fontSizeMultiplier;

  return (
    <div
      className="peacock-emerald-royal-biodata w-full h-full bg-[#fbf9f4] text-[#1a2620] relative box-border font-serif flex flex-col justify-between"
      style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        padding: config.outerPadding,
        // @ts-ignore
        '--fs': scale,
      }}
    >
      {/* Outer Regal Gold & Emerald Double Frame */}
      <div className="border-[2.5px] border-[#0c3b2e] rounded-xs p-1 relative flex-1 flex flex-col w-full h-full shadow-xs">
        <div className={`border border-[#c59b27] ${config.innerPadding} relative bg-[#fffdfa]/95 flex-1 flex flex-col justify-between w-full h-full`}>
          
          {/* Ornate Indian Peacock Feather Corner Filigrees */}
          {/* Top-Left */}
          <div className="absolute top-1 left-1 w-9 h-9 sm:w-11 sm:h-11 text-[#c59b27] pointer-events-none select-none">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full opacity-90">
              <path d="M0,0 L55,0 C45,15 32,25 24,42 C18,55 12,75 0,100 L0,0 Z" fill="#0c3b2e" fillOpacity="0.08" />
              <path d="M2,2 L50,2 C40,14 30,22 22,38 C16,50 10,70 2,95 L2,2 Z" stroke="#c59b27" strokeWidth="1.5" />
              {/* Peacock Eye Motif */}
              <ellipse cx="22" cy="22" rx="11" ry="8" transform="rotate(-45 22 22)" stroke="#c59b27" strokeWidth="1.5" fill="#f8f4e9" />
              <ellipse cx="22" cy="22" rx="6.5" ry="4" transform="rotate(-45 22 22)" fill="#0c3b2e" />
              <circle cx="22" cy="22" r="2.5" fill="#d4af37" />
              <circle cx="48" cy="6" r="1.5" fill="#c59b27" />
              <circle cx="6" cy="48" r="1.5" fill="#c59b27" />
            </svg>
          </div>

          {/* Top-Right */}
          <div className="absolute top-1 right-1 w-9 h-9 sm:w-11 sm:h-11 text-[#c59b27] pointer-events-none select-none rotate-90">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full opacity-90">
              <path d="M0,0 L55,0 C45,15 32,25 24,42 C18,55 12,75 0,100 L0,0 Z" fill="#0c3b2e" fillOpacity="0.08" />
              <path d="M2,2 L50,2 C40,14 30,22 22,38 C16,50 10,70 2,95 L2,2 Z" stroke="#c59b27" strokeWidth="1.5" />
              <ellipse cx="22" cy="22" rx="11" ry="8" transform="rotate(-45 22 22)" stroke="#c59b27" strokeWidth="1.5" fill="#f8f4e9" />
              <ellipse cx="22" cy="22" rx="6.5" ry="4" transform="rotate(-45 22 22)" fill="#0c3b2e" />
              <circle cx="22" cy="22" r="2.5" fill="#d4af37" />
              <circle cx="48" cy="6" r="1.5" fill="#c59b27" />
              <circle cx="6" cy="48" r="1.5" fill="#c59b27" />
            </svg>
          </div>

          {/* Bottom-Left */}
          <div className="absolute bottom-1 left-1 w-9 h-9 sm:w-11 sm:h-11 text-[#c59b27] pointer-events-none select-none -rotate-90">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full opacity-90">
              <path d="M0,0 L55,0 C45,15 32,25 24,42 C18,55 12,75 0,100 L0,0 Z" fill="#0c3b2e" fillOpacity="0.08" />
              <path d="M2,2 L50,2 C40,14 30,22 22,38 C16,50 10,70 2,95 L2,2 Z" stroke="#c59b27" strokeWidth="1.5" />
              <ellipse cx="22" cy="22" rx="11" ry="8" transform="rotate(-45 22 22)" stroke="#c59b27" strokeWidth="1.5" fill="#f8f4e9" />
              <ellipse cx="22" cy="22" rx="6.5" ry="4" transform="rotate(-45 22 22)" fill="#0c3b2e" />
              <circle cx="22" cy="22" r="2.5" fill="#d4af37" />
              <circle cx="48" cy="6" r="1.5" fill="#c59b27" />
              <circle cx="6" cy="48" r="1.5" fill="#c59b27" />
            </svg>
          </div>

          {/* Bottom-Right */}
          <div className="absolute bottom-1 right-1 w-9 h-9 sm:w-11 sm:h-11 text-[#c59b27] pointer-events-none select-none rotate-180">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full opacity-90">
              <path d="M0,0 L55,0 C45,15 32,25 24,42 C18,55 12,75 0,100 L0,0 Z" fill="#0c3b2e" fillOpacity="0.08" />
              <path d="M2,2 L50,2 C40,14 30,22 22,38 C16,50 10,70 2,95 L2,2 Z" stroke="#c59b27" strokeWidth="1.5" />
              <ellipse cx="22" cy="22" rx="11" ry="8" transform="rotate(-45 22 22)" stroke="#c59b27" strokeWidth="1.5" fill="#f8f4e9" />
              <ellipse cx="22" cy="22" rx="6.5" ry="4" transform="rotate(-45 22 22)" fill="#0c3b2e" />
              <circle cx="22" cy="22" r="2.5" fill="#d4af37" />
              <circle cx="48" cy="6" r="1.5" fill="#c59b27" />
              <circle cx="6" cy="48" r="1.5" fill="#c59b27" />
            </svg>
          </div>

          {/* Main Content Body */}
          <div className="flex-1 flex flex-col justify-between relative z-10">
            
            {/* Header: Sacred Vedic Invocation & Candidate Crown */}
            <div>
              {/* Invocation Bar */}
              <div className="text-center mb-1">
                <div className="flex items-center justify-center gap-2 mb-0.5">
                  <span className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#c59b27]" />
                  <span className="text-[#0c3b2e] text-xs sm:text-sm">🪷</span>
                  <span
                    className="text-[#0c3b2e] font-bold text-xs sm:text-sm tracking-widest uppercase"
                    style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
                  >
                    ॥ ॐ श्री गणेशाय नमः ॥
                  </span>
                  <span className="text-[#0c3b2e] text-xs sm:text-sm">🪷</span>
                  <span className="h-[1px] w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#c59b27]" />
                </div>
                <div
                  className="text-[10px] text-[#7a5f22] tracking-widest font-medium"
                  style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
                >
                  ॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥
                </div>
              </div>

              {/* Candidate Spotlight Banner */}
              <div className={`text-center ${config.headerMargin} pb-1.5 border-b border-[#e2d5b8]`}>
                {personalInfo.photoUrl && (
                  <div className="flex justify-center mb-1">
                    <div className="p-1 rounded-sm border-2 border-[#c59b27] bg-white shadow-xs ring-2 ring-[#0c3b2e]/15">
                      <img
                        src={personalInfo.photoUrl}
                        alt={personalInfo.fullName || 'Candidate'}
                        className={`${config.photoSize} object-cover rounded-xs`}
                      />
                    </div>
                  </div>
                )}

                <h1
                  className="text-lg sm:text-2xl font-bold text-[#0c3b2e] tracking-wide uppercase leading-tight"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {personalInfo.fullName || 'Candidate Name'}
                </h1>

                <div className="flex items-center justify-center gap-2 mt-0.5">
                  <span className="h-[1px] w-6 bg-[#c59b27]/60" />
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#916b1f] font-semibold">
                    Royal Matrimonial Biodata
                  </span>
                  <span className="h-[1px] w-6 bg-[#c59b27]/60" />
                </div>
              </div>
            </div>

            {/* Dynamic Two-Pillar Darbar Layout */}
            <div className={`grid grid-cols-12 ${config.columnGap} items-start flex-1`}>
              
              {/* Left Pillar (5 Columns): Personal, Vedic Kundali, Social Roots & Contact */}
              <div className={`col-span-5 ${config.sectionGap}`}>
                
                {/* 1. Personal & Physical Coordinates */}
                <div className={`bg-[#f9f6ed] ${config.cardPadding} rounded-xs border border-[#e4d7bd] shadow-2xs`}>
                  <div className="flex items-center gap-1 mb-1 pb-0.5 border-b border-[#d8c8a8]">
                    <span className="text-[#0c3b2e] text-[10px]">❖</span>
                    <h2
                      className={`${config.headingSize} font-bold tracking-wider text-[#0c3b2e] uppercase`}
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      Personal Details
                    </h2>
                  </div>

                  <div className="space-y-0.5 text-[10.5px]">
                    {personalInfo.dateOfBirth && (
                      <div className="flex justify-between items-baseline">
                        <span className="text-[#6d5b43] font-medium">Date of Birth:</span>
                        <span className="font-semibold text-[#1a2620]">{personalInfo.dateOfBirth}</span>
                      </div>
                    )}
                    {personalInfo.timeOfBirth && (
                      <div className="flex justify-between items-baseline">
                        <span className="text-[#6d5b43] font-medium">Time of Birth:</span>
                        <span className="font-semibold text-[#1a2620]">{personalInfo.timeOfBirth}</span>
                      </div>
                    )}
                    {personalInfo.placeOfBirth && (
                      <div className="flex justify-between items-baseline">
                        <span className="text-[#6d5b43] font-medium">Place of Birth:</span>
                        <span className="font-semibold text-[#1a2620] text-right">{personalInfo.placeOfBirth}</span>
                      </div>
                    )}
                    {personalInfo.height && (
                      <div className="flex justify-between items-baseline">
                        <span className="text-[#6d5b43] font-medium">Height:</span>
                        <span className="font-semibold text-[#1a2620]">{personalInfo.height}</span>
                      </div>
                    )}
                    {personalInfo.complexion && (
                      <div className="flex justify-between items-baseline">
                        <span className="text-[#6d5b43] font-medium">Complexion:</span>
                        <span className="font-semibold text-[#1a2620]">{personalInfo.complexion}</span>
                      </div>
                    )}
                    {personalInfo.diet && (
                      <div className="flex justify-between items-baseline">
                        <span className="text-[#6d5b43] font-medium">Diet:</span>
                        <span className="font-semibold text-[#1a2620]">{personalInfo.diet}</span>
                      </div>
                    )}
                    {personalInfo.bloodGroup && (
                      <div className="flex justify-between items-baseline">
                        <span className="text-[#6d5b43] font-medium">Blood Group:</span>
                        <span className="font-semibold text-[#1a2620]">{personalInfo.bloodGroup}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Vedic Horoscope / Kundali Card */}
                {hasHoroscope && (
                  <div className={`bg-[#fbf7eb] ${config.cardPadding} rounded-xs border-2 border-[#c59b27]/70 shadow-2xs relative`}>
                    <div className="flex items-center justify-between mb-1 pb-0.5 border-b border-[#e5d5b5]">
                      <div className="flex items-center gap-1">
                        <span className="text-[#c59b27] text-xs">ॐ</span>
                        <h2
                          className={`${config.headingSize} font-bold tracking-wider text-[#0c3b2e] uppercase`}
                          style={{ fontFamily: "'Cinzel', serif" }}
                        >
                          Kundali / Horoscope
                        </h2>
                      </div>
                      <span className="text-[9px] uppercase px-1 py-0.2 rounded-xs bg-[#0c3b2e]/10 text-[#0c3b2e] font-semibold">
                        Vedic
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10.5px]">
                      {horoscope.gothra && (
                        <div>
                          <span className="text-[#78644b] block text-[9.5px]">Gotra:</span>
                          <span className="font-semibold text-[#1a2620]">{horoscope.gothra}</span>
                        </div>
                      )}
                      {horoscope.rashi && (
                        <div>
                          <span className="text-[#78644b] block text-[9.5px]">Rashi:</span>
                          <span className="font-semibold text-[#1a2620]">{horoscope.rashi}</span>
                        </div>
                      )}
                      {horoscope.nakshatra && (
                        <div>
                          <span className="text-[#78644b] block text-[9.5px]">Nakshatra:</span>
                          <span className="font-semibold text-[#1a2620]">{horoscope.nakshatra}</span>
                        </div>
                      )}
                      {horoscope.manglik && (
                        <div>
                          <span className="text-[#78644b] block text-[9.5px]">Manglik:</span>
                          <span className="font-bold text-[#800020]">{horoscope.manglik}</span>
                        </div>
                      )}
                      {horoscope.kuldevta && (
                        <div className="col-span-2 pt-0.5 border-t border-[#e5d5b5]/70">
                          <span className="text-[#78644b] block text-[9px]">Kuldevta / Kuldevi:</span>
                          <span className="font-semibold text-[#0c3b2e]">{horoscope.kuldevta}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Social & Cultural Heritage */}
                {hasCulturalIdentity && (
                  <div className={`bg-[#f9f6ed] ${config.cardPadding} rounded-xs border border-[#e4d7bd] shadow-2xs`}>
                    <div className="flex items-center gap-1 mb-1 pb-0.5 border-b border-[#d8c8a8]">
                      <span className="text-[#0c3b2e] text-[10px]">❖</span>
                      <h2
                        className={`${config.headingSize} font-bold tracking-wider text-[#0c3b2e] uppercase`}
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        Social & Community
                      </h2>
                    </div>

                    <div className="space-y-0.5 text-[10.5px]">
                      {personalInfo.religion && (
                        <div className="flex justify-between items-baseline">
                          <span className="text-[#6d5b43] font-medium">Religion:</span>
                          <span className="font-semibold text-[#1a2620]">{personalInfo.religion}</span>
                        </div>
                      )}
                      {personalInfo.caste && (
                        <div className="flex justify-between items-baseline">
                          <span className="text-[#6d5b43] font-medium">Caste:</span>
                          <span className="font-semibold text-[#1a2620]">
                            {personalInfo.caste}
                            {personalInfo.subCaste ? ` (${personalInfo.subCaste})` : ''}
                          </span>
                        </div>
                      )}
                      {personalInfo.motherTongue && (
                        <div className="flex justify-between items-baseline">
                          <span className="text-[#6d5b43] font-medium">Mother Tongue:</span>
                          <span className="font-semibold text-[#1a2620]">{personalInfo.motherTongue}</span>
                        </div>
                      )}
                      {personalInfo.languagesKnown && (
                        <div className="pt-0.5">
                          <span className="text-[#6d5b43] block text-[9.5px]">Languages:</span>
                          <span className="font-medium text-[#1a2620]">{personalInfo.languagesKnown}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. Contact & Correspondence */}
                {hasContact && (
                  <div className={`bg-[#f9f6ed] ${config.cardPadding} rounded-xs border border-[#e4d7bd] shadow-2xs`}>
                    <div className="flex items-center gap-1 mb-1 pb-0.5 border-b border-[#d8c8a8]">
                      <span className="text-[#0c3b2e] text-[10px]">❖</span>
                      <h2
                        className={`${config.headingSize} font-bold tracking-wider text-[#0c3b2e] uppercase`}
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        Contact Details
                      </h2>
                    </div>

                    <div className="space-y-0.5 text-[10.5px]">
                      {contact?.referencePhone && (
                        <div>
                          <span className="text-[#78644b] block text-[9px]">Contact Phone:</span>
                          <span className="font-bold text-[#0c3b2e]">{contact.referencePhone}</span>
                        </div>
                      )}
                      {personalInfo.phone && !contact?.referencePhone?.includes(personalInfo.phone) && (
                        <div>
                          <span className="text-[#78644b] block text-[9px]">Direct Phone:</span>
                          <span className="font-semibold text-[#1a2620]">{personalInfo.phone}</span>
                        </div>
                      )}
                      {personalInfo.email && (
                        <div>
                          <span className="text-[#78644b] block text-[9px]">Email:</span>
                          <span className="font-semibold text-[#1a2620] break-all">{personalInfo.email}</span>
                        </div>
                      )}
                      {contact?.address && (
                        <div>
                          <span className="text-[#78644b] block text-[9px]">Residence:</span>
                          <span className="font-medium text-[#1a2620] leading-tight">{contact.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Pillar (7 Columns): Education, Profession, Family Heritage & Preferences */}
              <div className={`col-span-7 ${config.sectionGap}`}>
                
                {/* 1. Education & Profession */}
                {hasEducationOrOccupation && (
                  <div className={`bg-[#f9f6ed] ${config.cardPadding} rounded-xs border border-[#e4d7bd] shadow-2xs`}>
                    <div className="flex items-center gap-1 mb-1 pb-0.5 border-b border-[#d8c8a8]">
                      <span className="text-[#0c3b2e] text-[10px]">❖</span>
                      <h2
                        className={`${config.headingSize} font-bold tracking-wider text-[#0c3b2e] uppercase`}
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        Education & Profession
                      </h2>
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      {hasEducation && (
                        <div>
                          <span className="text-[#78644b] font-medium text-[9.5px] block uppercase tracking-wider mb-0.5">
                            Academic Qualifications
                          </span>
                          <div className="space-y-0.5 pl-2 border-l-2 border-[#0c3b2e]/60">
                            {education
                              .filter((e) => e.degree.trim() || e.institution.trim())
                              .map((edu, idx) => (
                                <div key={idx} className="leading-snug">
                                  <span className="font-semibold text-[#0c3b2e]">{edu.degree}</span>
                                  {edu.institution && (
                                    <span className="text-[#555] block text-[10px]">{edu.institution}</span>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {hasOccupation && (
                        <div className="pt-1 border-t border-[#e2d5b8]/70">
                          <span className="text-[#78644b] font-medium text-[9.5px] block uppercase tracking-wider mb-0.5">
                            Professional Standing
                          </span>
                          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                            {occupation.designation && (
                              <div className="col-span-2 sm:col-span-1">
                                <span className="text-[#78644b] block text-[9px]">Designation:</span>
                                <span className="font-semibold text-[#1a2620]">{occupation.designation}</span>
                              </div>
                            )}
                            {occupation.company && (
                              <div className="col-span-2 sm:col-span-1">
                                <span className="text-[#78644b] block text-[9px]">Organization:</span>
                                <span className="font-semibold text-[#1a2620]">{occupation.company}</span>
                              </div>
                            )}
                            {occupation.income && (
                              <div className="col-span-2 pt-0.5">
                                <span className="text-[#78644b] block text-[9px]">Annual Income:</span>
                                <span className="font-bold text-[#0c3b2e] bg-[#0c3b2e]/10 px-1.5 py-0.5 rounded-xs inline-block">
                                  {occupation.income}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {hasAchievements && (
                        <div className="pt-1 border-t border-[#e2d5b8]/70">
                          <span className="text-[#78644b] font-medium text-[9.5px] block uppercase tracking-wider mb-0.5">
                            Honors & Accomplishments
                          </span>
                          <div className="space-y-0.5 pl-2 border-l-2 border-[#c59b27]">
                            {achievements
                              .filter((a) => a.trim().length > 0)
                              .map((ach, idx) => (
                                <div key={idx} className="text-[#1a2620] text-[10px] leading-snug">
                                  • {ach}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. Family Background & Lineage */}
                {hasFamily && (
                  <div className={`bg-[#f9f6ed] ${config.cardPadding} rounded-xs border border-[#e4d7bd] shadow-2xs`}>
                    <div className="flex items-center gap-1 mb-1 pb-0.5 border-b border-[#d8c8a8]">
                      <span className="text-[#0c3b2e] text-[10px]">❖</span>
                      <h2
                        className={`${config.headingSize} font-bold tracking-wider text-[#0c3b2e] uppercase`}
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        Family Background
                      </h2>
                    </div>

                    <div className="space-y-1 text-[11px]">
                      {family.fatherName && (
                        <div className="flex flex-wrap items-baseline gap-1">
                          <span className="text-[#6d5b43] font-medium w-24 flex-shrink-0">Father:</span>
                          <span className="font-semibold text-[#1a2620]">
                            {family.fatherName}
                            {family.fatherOccupation && (
                              <span className="font-normal text-[#555] block text-[10px]">
                                ({family.fatherOccupation})
                              </span>
                            )}
                          </span>
                        </div>
                      )}

                      {family.motherName && (
                        <div className="flex flex-wrap items-baseline gap-1">
                          <span className="text-[#6d5b43] font-medium w-24 flex-shrink-0">Mother:</span>
                          <span className="font-semibold text-[#1a2620]">
                            {family.motherName}
                            {family.motherOccupation && (
                              <span className="font-normal text-[#555] block text-[10px]">
                                ({family.motherOccupation})
                              </span>
                            )}
                          </span>
                        </div>
                      )}

                      {hasSiblings && (
                        <div className="pt-0.5">
                          <span className="text-[#6d5b43] font-medium block text-[9.5px] mb-0.5">Siblings:</span>
                          <div className="space-y-0.5 pl-2 border-l-2 border-[#0c3b2e]/60">
                            {family.siblings
                              .filter((s) => s.name.trim() || s.relation.trim() || s.occupation.trim())
                              .map((sibling, idx) => (
                                <div key={idx} className="leading-snug text-[10px]">
                                  <span className="font-semibold text-[#1a2620]">{sibling.name}</span>
                                  {sibling.relation && (
                                    <span className="text-[#0c3b2e] font-medium ml-1">({sibling.relation})</span>
                                  )}
                                  {sibling.occupation && (
                                    <span className="text-[#555] ml-1">— {sibling.occupation}</span>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {hasRelatives && (
                        <div className="pt-0.5">
                          <span className="text-[#6d5b43] font-medium block text-[9.5px] mb-0.5">Respected Relatives:</span>
                          <div className="space-y-0.5 pl-2 border-l-2 border-[#c59b27]">
                            {family.relatives
                              .filter((r) => r.name.trim() || r.relation.trim() || r.occupation.trim())
                              .map((rel, idx) => (
                                <div key={idx} className="leading-snug text-[10px]">
                                  <span className="font-semibold text-[#1a2620]">{rel.name}</span>
                                  {rel.relation && (
                                    <span className="text-[#0c3b2e] font-medium ml-1">({rel.relation})</span>
                                  )}
                                  {rel.occupation && (
                                    <span className="text-[#555] ml-1">— {rel.occupation}</span>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {family.nativePlace && (
                        <div className="pt-0.5 flex items-baseline gap-1">
                          <span className="text-[#6d5b43] font-medium w-24 flex-shrink-0">Native Place:</span>
                          <span className="font-semibold text-[#1a2620] text-[10.5px]">{family.nativePlace}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Partner Preferences */}
                {hasPreferences && (
                  <div className={`bg-[#fbf8ef] ${config.cardPadding} rounded-xs border border-[#e4d7bd] shadow-2xs`}>
                    <div className="flex items-center gap-1 mb-1 pb-0.5 border-b border-[#d8c8a8]">
                      <span className="text-[#0c3b2e] text-[10px]">❖</span>
                      <h2
                        className={`${config.headingSize} font-bold tracking-wider text-[#0c3b2e] uppercase`}
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        Partner Expectations
                      </h2>
                    </div>
                    <p className="text-[10.5px] text-[#2c3d33] leading-relaxed italic bg-white/70 p-1.5 rounded-xs border border-[#ede2cd]">
                      &ldquo;{partnerPreferences}&rdquo;
                    </p>
                  </div>
                )}

                {/* 4. Hobbies / Personal Pursuits */}
                {hasHobbies && (
                  <div className={`bg-[#f9f6ed] ${config.cardPadding} rounded-xs border border-[#e4d7bd] shadow-2xs`}>
                    <div className="flex items-center gap-1 mb-1 pb-0.5 border-b border-[#d8c8a8]">
                      <span className="text-[#0c3b2e] text-[10px]">❖</span>
                      <h2
                        className={`${config.headingSize} font-bold tracking-wider text-[#0c3b2e] uppercase`}
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        Interests & Hobbies
                      </h2>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {hobbies.map((h, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-xs bg-[#0c3b2e]/10 border border-[#0c3b2e]/25 text-[#0c3b2e] text-[10px] font-medium"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Auspicious Closing Shanti Blessing */}
            <div className="text-center pt-1.5 border-t border-[#c59b27]/50 mt-1">
              <div
                className="text-[#0c3b2e] text-xs font-semibold tracking-widest"
                style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
              >
                ॥ परस्परं भावयन्तः श्रेयः परमवाप्स्यथ ॥
              </div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-[#916b1f] mt-0.5">
                May Auspicious Harmony Prevail
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import type { BiodataDocument } from '../../../lib/schema';

interface KesarMandapCrimsonBiodataProps {
  data: BiodataDocument;
  spacingDensity?: 'compact' | 'balanced' | 'spacious';
  fontSizeScale?: number;
}

export default function KesarMandapCrimsonBiodata({
  data,
  spacingDensity = 'balanced',
  fontSizeScale = 100,
}: KesarMandapCrimsonBiodataProps) {
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
      className="kesar-mandap-crimson-biodata w-full h-full bg-[#fffdf9] text-[#2c1316] relative box-border font-serif flex flex-col justify-between"
      style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        padding: config.outerPadding,
        // @ts-ignore
        '--fs': scale,
      }}
    >
      {/* Outer Sacred Kumkum Crimson & Haldi Saffron Triple Border */}
      <div className="border-[2.5px] border-[#821319] rounded-xs p-1 relative flex-1 flex flex-col w-full h-full shadow-xs">
        <div className={`border border-[#d97706] ${config.innerPadding} relative bg-[#fffcf7]/95 flex-1 flex flex-col justify-between w-full h-full`}>
          
          {/* Authentic Indian Paisley (Kalka / Mango) Corner Filigrees */}
          {/* Top-Left */}
          <div className="absolute top-1 left-1 w-9 h-9 sm:w-11 sm:h-11 text-[#d97706] pointer-events-none select-none">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full opacity-90">
              <path d="M0,0 L50,0 C42,12 32,22 25,38 C20,48 15,68 0,100 L0,0 Z" fill="#821319" fillOpacity="0.08" />
              <path d="M2,2 L46,2 C38,12 28,20 22,34 C16,46 12,68 2,94 L2,2 Z" stroke="#821319" strokeWidth="1.5" />
              {/* Paisley Swirl */}
              <path d="M12,12 C24,12 30,22 26,34 C22,46 10,42 16,28 C18,22 24,20 20,16 C16,14 12,18 12,12 Z" fill="#d97706" fillOpacity="0.85" />
              <circle cx="20" cy="20" r="3" fill="#821319" />
              <circle cx="44" cy="5" r="1.5" fill="#d97706" />
              <circle cx="5" cy="44" r="1.5" fill="#d97706" />
            </svg>
          </div>

          {/* Top-Right */}
          <div className="absolute top-1 right-1 w-9 h-9 sm:w-11 sm:h-11 text-[#d97706] pointer-events-none select-none rotate-90">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full opacity-90">
              <path d="M0,0 L50,0 C42,12 32,22 25,38 C20,48 15,68 0,100 L0,0 Z" fill="#821319" fillOpacity="0.08" />
              <path d="M2,2 L46,2 C38,12 28,20 22,34 C16,46 12,68 2,94 L2,2 Z" stroke="#821319" strokeWidth="1.5" />
              <path d="M12,12 C24,12 30,22 26,34 C22,46 10,42 16,28 C18,22 24,20 20,16 C16,14 12,18 12,12 Z" fill="#d97706" fillOpacity="0.85" />
              <circle cx="20" cy="20" r="3" fill="#821319" />
              <circle cx="44" cy="5" r="1.5" fill="#d97706" />
              <circle cx="5" cy="44" r="1.5" fill="#d97706" />
            </svg>
          </div>

          {/* Bottom-Left */}
          <div className="absolute bottom-1 left-1 w-9 h-9 sm:w-11 sm:h-11 text-[#d97706] pointer-events-none select-none -rotate-90">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full opacity-90">
              <path d="M0,0 L50,0 C42,12 32,22 25,38 C20,48 15,68 0,100 L0,0 Z" fill="#821319" fillOpacity="0.08" />
              <path d="M2,2 L46,2 C38,12 28,20 22,34 C16,46 12,68 2,94 L2,2 Z" stroke="#821319" strokeWidth="1.5" />
              <path d="M12,12 C24,12 30,22 26,34 C22,46 10,42 16,28 C18,22 24,20 20,16 C16,14 12,18 12,12 Z" fill="#d97706" fillOpacity="0.85" />
              <circle cx="20" cy="20" r="3" fill="#821319" />
              <circle cx="44" cy="5" r="1.5" fill="#d97706" />
              <circle cx="5" cy="44" r="1.5" fill="#d97706" />
            </svg>
          </div>

          {/* Bottom-Right */}
          <div className="absolute bottom-1 right-1 w-9 h-9 sm:w-11 sm:h-11 text-[#d97706] pointer-events-none select-none rotate-180">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full opacity-90">
              <path d="M0,0 L50,0 C42,12 32,22 25,38 C20,48 15,68 0,100 L0,0 Z" fill="#821319" fillOpacity="0.08" />
              <path d="M2,2 L46,2 C38,12 28,20 22,34 C16,46 12,68 2,94 L2,2 Z" stroke="#821319" strokeWidth="1.5" />
              <path d="M12,12 C24,12 30,22 26,34 C22,46 10,42 16,28 C18,22 24,20 20,16 C16,14 12,18 12,12 Z" fill="#d97706" fillOpacity="0.85" />
              <circle cx="20" cy="20" r="3" fill="#821319" />
              <circle cx="44" cy="5" r="1.5" fill="#d97706" />
              <circle cx="5" cy="44" r="1.5" fill="#d97706" />
            </svg>
          </div>

          {/* Content Body */}
          <div className="flex-1 flex flex-col justify-between relative z-10">
            
            {/* Grand Mandap Jharokha Arch Header */}
            <div>
              {/* Auspicious Invocation with Twin Deepam */}
              <div className="text-center mb-1">
                <div className="flex items-center justify-center gap-2 mb-0.5">
                  {/* Left Diya */}
                  <span className="text-[#d97706] text-xs">🪔</span>
                  <span className="h-[1px] w-8 sm:w-14 bg-gradient-to-r from-transparent to-[#821319]" />
                  <span
                    className="text-[#821319] font-bold text-xs sm:text-sm tracking-widest uppercase"
                    style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
                  >
                    ॥ ॐ श्री गणेशाय नमः ॥
                  </span>
                  <span className="h-[1px] w-8 sm:w-14 bg-gradient-to-l from-transparent to-[#821319]" />
                  {/* Right Diya */}
                  <span className="text-[#d97706] text-xs">🪔</span>
                </div>

                {/* Vivaha Mangalashtakam Auspicious Shloka */}
                <div
                  className="text-[9.5px] sm:text-[10px] text-[#9a3412] tracking-wider font-medium"
                  style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
                >
                  ॥ माङ्गल्यं तन्तुनानेन लोकजीवनहेतुना । कण्ठे बध्नामि सुभगे सञ्जीव शरदः शतम् ॥
                </div>
              </div>

              {/* Candidate Spotlight Banner */}
              <div className={`text-center ${config.headerMargin} pb-1.5 border-b border-[#f3d9b1]`}>
                {personalInfo.photoUrl && (
                  <div className="flex justify-center mb-1">
                    <div className="p-1 rounded-sm border-2 border-[#821319] bg-white shadow-xs ring-2 ring-[#d97706]/30">
                      <img
                        src={personalInfo.photoUrl}
                        alt={personalInfo.fullName || 'Candidate'}
                        className={`${config.photoSize} object-cover rounded-xs`}
                      />
                    </div>
                  </div>
                )}

                <h1
                  className="text-lg sm:text-2xl font-bold text-[#821319] tracking-wide uppercase leading-tight"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {personalInfo.fullName || 'Candidate Name'}
                </h1>

                <div className="flex items-center justify-center gap-2 mt-0.5">
                  <span className="h-[1px] w-6 bg-[#d97706]/60" />
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#b45309] font-semibold">
                    पवित्र विवाह पत्रिका • Matrimonial Profile
                  </span>
                  <span className="h-[1px] w-6 bg-[#d97706]/60" />
                </div>
              </div>
            </div>

            {/* Split Sanctuary Layout */}
            <div className={`grid grid-cols-12 ${config.columnGap} items-start flex-1`}>
              
              {/* Left Wing (5 Columns): Personal Coordinates, Kundali Grid, Cultural & Contact */}
              <div className={`col-span-5 ${config.sectionGap}`}>
                
                {/* 1. Personal & Physical Essentials */}
                <div className={`bg-[#fffaf0] ${config.cardPadding} rounded-xs border border-[#fae2c0] shadow-2xs`}>
                  <div className="flex items-center gap-1 mb-1 pb-0.5 border-b border-[#f3d0a2]">
                    <span className="text-[#821319] text-[10px]">❖</span>
                    <h2
                      className={`${config.headingSize} font-bold tracking-wider text-[#821319] uppercase`}
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      Personal Details
                    </h2>
                  </div>

                  <div className="space-y-0.5 text-[10.5px]">
                    {personalInfo.dateOfBirth && (
                      <div className="flex justify-between items-baseline">
                        <span className="text-[#78350f] font-medium">Date of Birth:</span>
                        <span className="font-semibold text-[#2c1316]">{personalInfo.dateOfBirth}</span>
                      </div>
                    )}
                    {personalInfo.timeOfBirth && (
                      <div className="flex justify-between items-baseline">
                        <span className="text-[#78350f] font-medium">Time of Birth:</span>
                        <span className="font-semibold text-[#2c1316]">{personalInfo.timeOfBirth}</span>
                      </div>
                    )}
                    {personalInfo.placeOfBirth && (
                      <div className="flex justify-between items-baseline">
                        <span className="text-[#78350f] font-medium">Place of Birth:</span>
                        <span className="font-semibold text-[#2c1316] text-right">{personalInfo.placeOfBirth}</span>
                      </div>
                    )}
                    {personalInfo.height && (
                      <div className="flex justify-between items-baseline">
                        <span className="text-[#78350f] font-medium">Height:</span>
                        <span className="font-semibold text-[#2c1316]">{personalInfo.height}</span>
                      </div>
                    )}
                    {personalInfo.complexion && (
                      <div className="flex justify-between items-baseline">
                        <span className="text-[#78350f] font-medium">Complexion:</span>
                        <span className="font-semibold text-[#2c1316]">{personalInfo.complexion}</span>
                      </div>
                    )}
                    {personalInfo.diet && (
                      <div className="flex justify-between items-baseline">
                        <span className="text-[#78350f] font-medium">Diet:</span>
                        <span className="font-semibold text-[#2c1316]">{personalInfo.diet}</span>
                      </div>
                    )}
                    {personalInfo.bloodGroup && (
                      <div className="flex justify-between items-baseline">
                        <span className="text-[#78350f] font-medium">Blood Group:</span>
                        <span className="font-semibold text-[#2c1316]">{personalInfo.bloodGroup}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Vedic Horoscope / Kundali Card */}
                {hasHoroscope && (
                  <div className={`bg-[#fff8eb] ${config.cardPadding} rounded-xs border-2 border-[#d97706]/70 shadow-2xs relative`}>
                    <div className="flex items-center justify-between mb-1 pb-0.5 border-b border-[#f0c88b]">
                      <div className="flex items-center gap-1">
                        <span className="text-[#d97706] text-xs">卐</span>
                        <h2
                          className={`${config.headingSize} font-bold tracking-wider text-[#821319] uppercase`}
                          style={{ fontFamily: "'Cinzel', serif" }}
                        >
                          Kundali & Horoscope
                        </h2>
                      </div>
                      <span className="text-[9px] uppercase px-1 py-0.2 rounded-xs bg-[#821319]/10 text-[#821319] font-bold">
                        ग्रह-नक्षत्र
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10.5px]">
                      {horoscope.gothra && (
                        <div>
                          <span className="text-[#9a3412] block text-[9.5px]">Gotra:</span>
                          <span className="font-semibold text-[#2c1316]">{horoscope.gothra}</span>
                        </div>
                      )}
                      {horoscope.rashi && (
                        <div>
                          <span className="text-[#9a3412] block text-[9.5px]">Rashi:</span>
                          <span className="font-semibold text-[#2c1316]">{horoscope.rashi}</span>
                        </div>
                      )}
                      {horoscope.nakshatra && (
                        <div>
                          <span className="text-[#9a3412] block text-[9.5px]">Nakshatra:</span>
                          <span className="font-semibold text-[#2c1316]">{horoscope.nakshatra}</span>
                        </div>
                      )}
                      {horoscope.manglik && (
                        <div>
                          <span className="text-[#9a3412] block text-[9.5px]">Manglik Status:</span>
                          <span className="font-bold text-[#821319]">{horoscope.manglik}</span>
                        </div>
                      )}
                      {horoscope.kuldevta && (
                        <div className="col-span-2 pt-0.5 border-t border-[#f0c88b]/70">
                          <span className="text-[#9a3412] block text-[9px]">Kuldevta / Kuldevi:</span>
                          <span className="font-semibold text-[#821319]">{horoscope.kuldevta}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Community & Cultural Identity */}
                {hasCulturalIdentity && (
                  <div className={`bg-[#fffaf0] ${config.cardPadding} rounded-xs border border-[#fae2c0] shadow-2xs`}>
                    <div className="flex items-center gap-1 mb-1 pb-0.5 border-b border-[#f3d0a2]">
                      <span className="text-[#821319] text-[10px]">❖</span>
                      <h2
                        className={`${config.headingSize} font-bold tracking-wider text-[#821319] uppercase`}
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        Social & Community
                      </h2>
                    </div>

                    <div className="space-y-0.5 text-[10.5px]">
                      {personalInfo.religion && (
                        <div className="flex justify-between items-baseline">
                          <span className="text-[#78350f] font-medium">Religion:</span>
                          <span className="font-semibold text-[#2c1316]">{personalInfo.religion}</span>
                        </div>
                      )}
                      {personalInfo.caste && (
                        <div className="flex justify-between items-baseline">
                          <span className="text-[#78350f] font-medium">Caste:</span>
                          <span className="font-semibold text-[#2c1316]">
                            {personalInfo.caste}
                            {personalInfo.subCaste ? ` (${personalInfo.subCaste})` : ''}
                          </span>
                        </div>
                      )}
                      {personalInfo.motherTongue && (
                        <div className="flex justify-between items-baseline">
                          <span className="text-[#78350f] font-medium">Mother Tongue:</span>
                          <span className="font-semibold text-[#2c1316]">{personalInfo.motherTongue}</span>
                        </div>
                      )}
                      {personalInfo.languagesKnown && (
                        <div className="pt-0.5">
                          <span className="text-[#78350f] block text-[9.5px]">Languages:</span>
                          <span className="font-medium text-[#2c1316]">{personalInfo.languagesKnown}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. Contact & Correspondence */}
                {hasContact && (
                  <div className={`bg-[#fffaf0] ${config.cardPadding} rounded-xs border border-[#fae2c0] shadow-2xs`}>
                    <div className="flex items-center gap-1 mb-1 pb-0.5 border-b border-[#f3d0a2]">
                      <span className="text-[#821319] text-[10px]">❖</span>
                      <h2
                        className={`${config.headingSize} font-bold tracking-wider text-[#821319] uppercase`}
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        Contact & Residence
                      </h2>
                    </div>

                    <div className="space-y-0.5 text-[10.5px]">
                      {contact?.referencePhone && (
                        <div>
                          <span className="text-[#9a3412] block text-[9px]">Contact Phone:</span>
                          <span className="font-bold text-[#821319]">{contact.referencePhone}</span>
                        </div>
                      )}
                      {personalInfo.phone && !contact?.referencePhone?.includes(personalInfo.phone) && (
                        <div>
                          <span className="text-[#9a3412] block text-[9px]">Direct Phone:</span>
                          <span className="font-semibold text-[#2c1316]">{personalInfo.phone}</span>
                        </div>
                      )}
                      {personalInfo.email && (
                        <div>
                          <span className="text-[#9a3412] block text-[9px]">Email:</span>
                          <span className="font-semibold text-[#2c1316] break-all">{personalInfo.email}</span>
                        </div>
                      )}
                      {contact?.address && (
                        <div>
                          <span className="text-[#9a3412] block text-[9px]">Residence:</span>
                          <span className="font-medium text-[#2c1316] leading-tight">{contact.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Wing (7 Columns): Education, Profession, Family Lineage & Preferences */}
              <div className={`col-span-7 ${config.sectionGap}`}>
                
                {/* 1. Education & Profession */}
                {hasEducationOrOccupation && (
                  <div className={`bg-[#fffaf0] ${config.cardPadding} rounded-xs border border-[#fae2c0] shadow-2xs`}>
                    <div className="flex items-center gap-1 mb-1 pb-0.5 border-b border-[#f3d0a2]">
                      <span className="text-[#821319] text-[10px]">❖</span>
                      <h2
                        className={`${config.headingSize} font-bold tracking-wider text-[#821319] uppercase`}
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        Education & Profession
                      </h2>
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      {hasEducation && (
                        <div>
                          <span className="text-[#9a3412] font-medium text-[9.5px] block uppercase tracking-wider mb-0.5">
                            Academic Qualifications
                          </span>
                          <div className="space-y-0.5 pl-2 border-l-2 border-[#821319]/70">
                            {education
                              .filter((e) => e.degree.trim() || e.institution.trim())
                              .map((edu, idx) => (
                                <div key={idx} className="leading-snug">
                                  <span className="font-semibold text-[#821319]">{edu.degree}</span>
                                  {edu.institution && (
                                    <span className="text-[#555] block text-[10px]">{edu.institution}</span>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {hasOccupation && (
                        <div className="pt-1 border-t border-[#f3d0a2]/70">
                          <span className="text-[#9a3412] font-medium text-[9.5px] block uppercase tracking-wider mb-0.5">
                            Professional Career
                          </span>
                          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                            {occupation.designation && (
                              <div className="col-span-2 sm:col-span-1">
                                <span className="text-[#9a3412] block text-[9px]">Designation:</span>
                                <span className="font-semibold text-[#2c1316]">{occupation.designation}</span>
                              </div>
                            )}
                            {occupation.company && (
                              <div className="col-span-2 sm:col-span-1">
                                <span className="text-[#9a3412] block text-[9px]">Organization:</span>
                                <span className="font-semibold text-[#2c1316]">{occupation.company}</span>
                              </div>
                            )}
                            {occupation.income && (
                              <div className="col-span-2 pt-0.5">
                                <span className="text-[#9a3412] block text-[9px]">Annual Income:</span>
                                <span className="font-bold text-[#821319] bg-[#821319]/10 px-1.5 py-0.5 rounded-xs inline-block">
                                  {occupation.income}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {hasAchievements && (
                        <div className="pt-1 border-t border-[#f3d0a2]/70">
                          <span className="text-[#9a3412] font-medium text-[9.5px] block uppercase tracking-wider mb-0.5">
                            Accolades & Achievements
                          </span>
                          <div className="space-y-0.5 pl-2 border-l-2 border-[#d97706]">
                            {achievements
                              .filter((a) => a.trim().length > 0)
                              .map((ach, idx) => (
                                <div key={idx} className="text-[#2c1316] text-[10px] leading-snug">
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
                  <div className={`bg-[#fffaf0] ${config.cardPadding} rounded-xs border border-[#fae2c0] shadow-2xs`}>
                    <div className="flex items-center gap-1 mb-1 pb-0.5 border-b border-[#f3d0a2]">
                      <span className="text-[#821319] text-[10px]">❖</span>
                      <h2
                        className={`${config.headingSize} font-bold tracking-wider text-[#821319] uppercase`}
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        Family Background
                      </h2>
                    </div>

                    <div className="space-y-1 text-[11px]">
                      {family.fatherName && (
                        <div className="flex flex-wrap items-baseline gap-1">
                          <span className="text-[#78350f] font-medium w-24 flex-shrink-0">Father:</span>
                          <span className="font-semibold text-[#2c1316]">
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
                          <span className="text-[#78350f] font-medium w-24 flex-shrink-0">Mother:</span>
                          <span className="font-semibold text-[#2c1316]">
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
                          <span className="text-[#78350f] font-medium block text-[9.5px] mb-0.5">Siblings:</span>
                          <div className="space-y-0.5 pl-2 border-l-2 border-[#821319]/70">
                            {family.siblings
                              .filter((s) => s.name.trim() || s.relation.trim() || s.occupation.trim())
                              .map((sibling, idx) => (
                                <div key={idx} className="leading-snug text-[10px]">
                                  <span className="font-semibold text-[#2c1316]">{sibling.name}</span>
                                  {sibling.relation && (
                                    <span className="text-[#821319] font-medium ml-1">({sibling.relation})</span>
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
                          <span className="text-[#78350f] font-medium block text-[9.5px] mb-0.5">Distinguished Relatives:</span>
                          <div className="space-y-0.5 pl-2 border-l-2 border-[#d97706]">
                            {family.relatives
                              .filter((r) => r.name.trim() || r.relation.trim() || r.occupation.trim())
                              .map((rel, idx) => (
                                <div key={idx} className="leading-snug text-[10px]">
                                  <span className="font-semibold text-[#2c1316]">{rel.name}</span>
                                  {rel.relation && (
                                    <span className="text-[#821319] font-medium ml-1">({rel.relation})</span>
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
                          <span className="text-[#78350f] font-medium w-24 flex-shrink-0">Native Place:</span>
                          <span className="font-semibold text-[#2c1316] text-[10.5px]">{family.nativePlace}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Partner Preferences */}
                {hasPreferences && (
                  <div className={`bg-[#fffaf0] ${config.cardPadding} rounded-xs border border-[#fae2c0] shadow-2xs`}>
                    <div className="flex items-center gap-1 mb-1 pb-0.5 border-b border-[#f3d0a2]">
                      <span className="text-[#821319] text-[10px]">❖</span>
                      <h2
                        className={`${config.headingSize} font-bold tracking-wider text-[#821319] uppercase`}
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        Partner Expectations
                      </h2>
                    </div>
                    <p className="text-[10.5px] text-[#3b191c] leading-relaxed italic bg-white/70 p-1.5 rounded-xs border border-[#f5dfc2]">
                      &ldquo;{partnerPreferences}&rdquo;
                    </p>
                  </div>
                )}

                {/* 4. Interests / Hobbies */}
                {hasHobbies && (
                  <div className={`bg-[#fffaf0] ${config.cardPadding} rounded-xs border border-[#fae2c0] shadow-2xs`}>
                    <div className="flex items-center gap-1 mb-1 pb-0.5 border-b border-[#f3d0a2]">
                      <span className="text-[#821319] text-[10px]">❖</span>
                      <h2
                        className={`${config.headingSize} font-bold tracking-wider text-[#821319] uppercase`}
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        Hobbies & Interests
                      </h2>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {hobbies.map((h, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-xs bg-[#821319]/10 border border-[#821319]/25 text-[#821319] text-[10px] font-medium"
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
            <div className="text-center pt-1.5 border-t border-[#d97706]/50 mt-1">
              <div
                className="text-[#821319] text-xs font-semibold tracking-widest"
                style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
              >
                ॥ शुभम् भवतु ॥ कल्याणमस्तु ॥
              </div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-[#b45309] mt-0.5">
                May All Auspicious Blessings Abide
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

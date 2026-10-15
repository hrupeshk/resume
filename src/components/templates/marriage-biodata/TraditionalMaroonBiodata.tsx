import React from 'react';
import type { BiodataDocument } from '../../../lib/schema';
import { t, translateValue, getScriptFontFamily, isRTL } from '../../../lib/translations';

interface TraditionalMaroonBiodataProps {
  data: BiodataDocument;
  spacingDensity?: 'compact' | 'balanced' | 'spacious';
  fontSizeScale?: number;
}

export default function TraditionalMaroonBiodata({
  data,
  spacingDensity = 'balanced',
  fontSizeScale = 100,
}: TraditionalMaroonBiodataProps) {
  const lang = data.language || 'en';
  const { personalInfo, sections } = data;
  const { education, occupation, family, horoscope, contact, partnerPreferences, achievements, hobbies } = sections || {};

  // Check if sections have content to respect strict empty section omission
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

  // Density configurations
  const config = {
    compact: {
      sectionMargin: 'mb-1 sm:mb-1.5',
      gridGapY: 'gap-y-0.5',
      boxPadding: 'p-1.5',
      photoSize: 'w-18 h-22 sm:w-20 sm:h-24',
      headerMargin: 'mb-1.5',
      headingSize: 'text-xs',
      fontSizeMultiplier: 0.94,
    },
    balanced: {
      sectionMargin: 'mb-2 sm:mb-2.5',
      gridGapY: 'gap-y-1',
      boxPadding: 'p-2',
      photoSize: 'w-20 h-25 sm:w-22 sm:h-27',
      headerMargin: 'mb-2.5',
      headingSize: 'text-xs',
      fontSizeMultiplier: 1.0,
    },
    spacious: {
      sectionMargin: 'mb-3 sm:mb-3.5',
      gridGapY: 'gap-y-1.5',
      boxPadding: 'p-2.5',
      photoSize: 'w-22 h-27 sm:w-24 sm:h-30',
      headerMargin: 'mb-3.5',
      headingSize: 'text-xs sm:text-sm',
      fontSizeMultiplier: 1.05,
    },
  }[spacingDensity];

  const scale = (fontSizeScale / 100) * config.fontSizeMultiplier;
  const scriptFont = getScriptFontFamily(lang, 'serif');
  const rtl = isRTL(lang);

  return (
    <div
      data-lang={lang}
      dir={rtl ? 'rtl' : 'ltr'}
      className="traditional-maroon-biodata w-full h-full bg-[#fdfbf7] text-[#2c1810] relative box-border font-serif p-3 sm:p-3.5 flex flex-col justify-between"
      style={{
        fontFamily: scriptFont,
        // @ts-ignore
        '--fs': scale,
      }}
    >
      {/* Outer Ornate Double Border with Corner Accents spanning full A4 page */}
      <div className="border-2 border-[#800020] p-1 rounded-sm relative flex-1 flex flex-col w-full h-full">
        <div className="border border-[#c59b27] p-3 sm:p-3.5 relative bg-[#fffefa]/90 flex-1 flex flex-col justify-between w-full h-full">
          
          {/* Ornamental SVG Corner Filigrees */}
          {/* Top-Left Corner */}
          <div className="absolute top-0.5 left-0.5 w-6 h-6 sm:w-7 sm:h-7 text-[#c59b27] pointer-events-none select-none">
            <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full opacity-80">
              <path d="M0,0 L40,0 C30,10 20,20 15,35 C10,50 10,70 0,100 L0,0 Z M12,12 L35,12 C28,18 20,26 16,36 C13,44 12,58 6,80 L6,6 L12,12 Z" />
              <circle cx="20" cy="20" r="4" fill="#800020" />
            </svg>
          </div>
          {/* Top-Right Corner */}
          <div className="absolute top-0.5 right-0.5 w-6 h-6 sm:w-7 sm:h-7 text-[#c59b27] pointer-events-none select-none rotate-90">
            <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full opacity-80">
              <path d="M0,0 L40,0 C30,10 20,20 15,35 C10,50 10,70 0,100 L0,0 Z M12,12 L35,12 C28,18 20,26 16,36 C13,44 12,58 6,80 L6,6 L12,12 Z" />
              <circle cx="20" cy="20" r="4" fill="#800020" />
            </svg>
          </div>
          {/* Bottom-Left Corner */}
          <div className="absolute bottom-0.5 left-0.5 w-6 h-6 sm:w-7 sm:h-7 text-[#c59b27] pointer-events-none select-none -rotate-90">
            <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full opacity-80">
              <path d="M0,0 L40,0 C30,10 20,20 15,35 C10,50 10,70 0,100 L0,0 Z M12,12 L35,12 C28,18 20,26 16,36 C13,44 12,58 6,80 L6,6 L12,12 Z" />
              <circle cx="20" cy="20" r="4" fill="#800020" />
            </svg>
          </div>
          {/* Bottom-Right Corner */}
          <div className="absolute bottom-0.5 right-0.5 w-6 h-6 sm:w-7 sm:h-7 text-[#c59b27] pointer-events-none select-none rotate-180">
            <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full opacity-80">
              <path d="M0,0 L40,0 C30,10 20,20 15,35 C10,50 10,70 0,100 L0,0 Z M12,12 L35,12 C28,18 20,26 16,36 C13,44 12,58 6,80 L6,6 L12,12 Z" />
              <circle cx="20" cy="20" r="4" fill="#800020" />
            </svg>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col justify-between">
            {/* Top Invocation & Candidate Header (Sanskrit Invocations preserved verbatim in Sanskrit) */}
            <div>
              <div className="text-center mb-1.5">
                <div
                  className="text-[#800020] font-semibold text-sm sm:text-base tracking-wider"
                  style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
                >
                  ॥ श्री गणेशाय नमः ॥
                </div>
                <div className="flex items-center justify-center gap-2 mt-0.5">
                  <span className="h-[1px] w-10 bg-gradient-to-r from-transparent to-[#c59b27]" />
                  <span className="text-[#c59b27] text-xs">❖</span>
                  <span className="h-[1px] w-10 bg-gradient-to-l from-transparent to-[#c59b27]" />
                </div>
              </div>

              {/* Candidate Header & Centered Photo Banner */}
              <div className={`text-center ${config.headerMargin}`}>
                {personalInfo.photoUrl && (
                  <div className="flex justify-center mb-1">
                    <div className="p-0.5 rounded-sm border-2 border-[#c59b27] bg-[#fff] shadow-2xs">
                      <img
                        src={personalInfo.photoUrl}
                        alt={personalInfo.fullName || t('candidateNameFallback', lang)}
                        className={`${config.photoSize} object-cover rounded-xs`}
                      />
                    </div>
                  </div>
                )}

                <h1
                  className="text-lg sm:text-2xl font-bold text-[#800020] tracking-wide uppercase leading-tight"
                  style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}
                >
                  {personalInfo.fullName || t('candidateNameFallback', lang)}
                </h1>
                <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#b8860b] font-medium mt-0.5">
                  {t('marriageBiodata', lang)}
                </div>
              </div>
            </div>

            {/* Sections Flow */}
            <div className="flex-1 flex flex-col justify-around">
              {/* Section 1: Personal & Physical Details */}
              <div className={config.sectionMargin}>
                <div className="flex items-center gap-1.5 mb-1 pb-0.5 border-b border-[#c59b27]/60">
                  <span className="text-[#800020] text-xs">❖</span>
                  <h2
                    className={`${config.headingSize} font-bold tracking-wider text-[#800020] uppercase`}
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {t('personalDetails', lang)}
                  </h2>
                </div>

                <div className={`grid grid-cols-2 gap-x-5 ${config.gridGapY} text-xs`}>
                  {personalInfo.dateOfBirth && (
                    <div className="flex items-baseline">
                      <span className="w-26 text-[#7a5830] font-medium flex-shrink-0">{t('dateOfBirth', lang)}:</span>
                      <span className="text-[#1a1a1a] font-semibold">{personalInfo.dateOfBirth}</span>
                    </div>
                  )}
                  {personalInfo.timeOfBirth && (
                    <div className="flex items-baseline">
                      <span className="w-26 text-[#7a5830] font-medium flex-shrink-0">{t('timeOfBirth', lang)}:</span>
                      <span className="text-[#1a1a1a] font-semibold">{personalInfo.timeOfBirth}</span>
                    </div>
                  )}
                  {personalInfo.placeOfBirth && (
                    <div className="flex items-baseline">
                      <span className="w-26 text-[#7a5830] font-medium flex-shrink-0">{t('placeOfBirth', lang)}:</span>
                      <span className="text-[#1a1a1a] font-semibold">{personalInfo.placeOfBirth}</span>
                    </div>
                  )}
                  {personalInfo.height && (
                    <div className="flex items-baseline">
                      <span className="w-26 text-[#7a5830] font-medium flex-shrink-0">{t('height', lang)}:</span>
                      <span className="text-[#1a1a1a] font-semibold">{personalInfo.height}</span>
                    </div>
                  )}
                  {personalInfo.complexion && (
                    <div className="flex items-baseline">
                      <span className="w-26 text-[#7a5830] font-medium flex-shrink-0">{t('complexion', lang)}:</span>
                      <span className="text-[#1a1a1a] font-semibold">{translateValue(personalInfo.complexion, lang)}</span>
                    </div>
                  )}
                  {personalInfo.diet && (
                    <div className="flex items-baseline">
                      <span className="w-26 text-[#7a5830] font-medium flex-shrink-0">{t('diet', lang)}:</span>
                      <span className="text-[#1a1a1a] font-semibold">{translateValue(personalInfo.diet, lang)}</span>
                    </div>
                  )}
                  {personalInfo.bloodGroup && (
                    <div className="flex items-baseline">
                      <span className="w-26 text-[#7a5830] font-medium flex-shrink-0">{t('bloodGroup', lang)}:</span>
                      <span className="text-[#1a1a1a] font-semibold">{personalInfo.bloodGroup}</span>
                    </div>
                  )}
                  {personalInfo.religion && (
                    <div className="flex items-baseline">
                      <span className="w-26 text-[#7a5830] font-medium flex-shrink-0">{t('religion', lang)}:</span>
                      <span className="text-[#1a1a1a] font-semibold">{personalInfo.religion}</span>
                    </div>
                  )}
                  {personalInfo.caste && (
                    <div className="flex items-baseline">
                      <span className="w-26 text-[#7a5830] font-medium flex-shrink-0">{t('caste', lang)}:</span>
                      <span className="text-[#1a1a1a] font-semibold">
                        {personalInfo.caste}
                        {personalInfo.subCaste ? ` (${personalInfo.subCaste})` : ''}
                      </span>
                    </div>
                  )}
                  {personalInfo.motherTongue && (
                    <div className="flex items-baseline">
                      <span className="w-26 text-[#7a5830] font-medium flex-shrink-0">{t('motherTongue', lang)}:</span>
                      <span className="text-[#1a1a1a] font-semibold">{personalInfo.motherTongue}</span>
                    </div>
                  )}
                  {personalInfo.languagesKnown && (
                    <div className="flex items-baseline col-span-2">
                      <span className="w-26 text-[#7a5830] font-medium flex-shrink-0">{t('languages', lang)}:</span>
                      <span className="text-[#1a1a1a] font-semibold">{personalInfo.languagesKnown}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 2: Horoscope / Kundali */}
              {hasHoroscope && (
                <div className={config.sectionMargin}>
                  <div className="flex items-center gap-1.5 mb-1 pb-0.5 border-b border-[#c59b27]/60">
                    <span className="text-[#800020] text-xs">❖</span>
                    <h2
                      className={`${config.headingSize} font-bold tracking-wider text-[#800020] uppercase`}
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {t('horoscopeDetails', lang)}
                    </h2>
                  </div>

                  <div className={`grid grid-cols-2 gap-x-5 ${config.gridGapY} text-xs bg-[#fbf7ee] ${config.boxPadding} rounded-sm border border-[#e8d8b5]`}>
                    {horoscope.gothra && (
                      <div className="flex items-baseline">
                        <span className="w-26 text-[#7a5830] font-medium flex-shrink-0">{t('gothra', lang)}:</span>
                        <span className="text-[#1a1a1a] font-semibold">{horoscope.gothra}</span>
                      </div>
                    )}
                    {horoscope.rashi && (
                      <div className="flex items-baseline">
                        <span className="w-26 text-[#7a5830] font-medium flex-shrink-0">{t('rashi', lang)}:</span>
                        <span className="text-[#1a1a1a] font-semibold">{horoscope.rashi}</span>
                      </div>
                    )}
                    {horoscope.nakshatra && (
                      <div className="flex items-baseline">
                        <span className="w-26 text-[#7a5830] font-medium flex-shrink-0">{t('nakshatra', lang)}:</span>
                        <span className="text-[#1a1a1a] font-semibold">{horoscope.nakshatra}</span>
                      </div>
                    )}
                    {horoscope.manglik && (
                      <div className="flex items-baseline">
                        <span className="w-26 text-[#7a5830] font-medium flex-shrink-0">{t('manglikStatus', lang)}:</span>
                        <span className="text-[#800020] font-semibold">{translateValue(horoscope.manglik, lang)}</span>
                      </div>
                    )}
                    {horoscope.kuldevta && (
                      <div className="flex items-baseline col-span-2 pt-0.5">
                        <span className="w-26 text-[#7a5830] font-medium flex-shrink-0">{t('kuldevta', lang)}:</span>
                        <span className="text-[#800020] font-semibold">{horoscope.kuldevta}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Section 3: Education & Career */}
              {hasEducationOrOccupation && (
                <div className={config.sectionMargin}>
                  <div className="flex items-center gap-1.5 mb-1 pb-0.5 border-b border-[#c59b27]/60">
                    <span className="text-[#800020] text-xs">❖</span>
                    <h2
                      className={`${config.headingSize} font-bold tracking-wider text-[#800020] uppercase`}
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {t('educationProfession', lang)}
                    </h2>
                  </div>

                  <div className="space-y-1 text-xs">
                    {hasEducation && (
                      <div>
                        <span className="text-[#7a5830] font-medium block mb-0.5">{t('qualifications', lang)}:</span>
                        <div className="space-y-0.5 pl-2.5 border-l-2 border-[#c59b27]">
                          {education
                            .filter((e) => e.degree.trim() || e.institution.trim())
                            .map((edu, idx) => (
                              <div key={idx} className="flex flex-wrap items-baseline gap-1.5 leading-snug">
                                <span className="font-semibold text-[#1a1a1a]">{edu.degree}</span>
                                {edu.institution && (
                                  <span className="text-[#555]">— {edu.institution}</span>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {hasOccupation && (
                      <div className={`grid grid-cols-2 gap-x-5 ${config.gridGapY} pt-0.5`}>
                        {occupation.designation && (
                          <div className="flex items-baseline">
                            <span className="w-26 text-[#7a5830] font-medium flex-shrink-0">{t('designation', lang)}:</span>
                            <span className="text-[#1a1a1a] font-semibold">{occupation.designation}</span>
                          </div>
                        )}
                        {occupation.company && (
                          <div className="flex items-baseline">
                            <span className="w-26 text-[#7a5830] font-medium flex-shrink-0">{t('organization', lang)}:</span>
                            <span className="text-[#1a1a1a] font-semibold">{occupation.company}</span>
                          </div>
                        )}
                        {occupation.income && (
                          <div className="flex items-baseline col-span-2">
                            <span className="w-26 text-[#7a5830] font-medium flex-shrink-0">{t('annualPackage', lang)}:</span>
                            <span className="text-[#800020] font-semibold">{occupation.income}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {hasAchievements && (
                      <div className="pt-0.5">
                        <span className="text-[#7a5830] font-medium block mb-0.5">{t('honorsAchievements', lang)}:</span>
                        <div className="space-y-0.5 pl-2.5 border-l-2 border-[#c59b27]">
                          {achievements
                            .filter((a) => a.trim().length > 0)
                            .map((ach, idx) => (
                              <div key={idx} className="text-[#1a1a1a] font-medium leading-snug">
                                • {ach}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Section 4: Family Details */}
              {hasFamily && (
                <div className={config.sectionMargin}>
                  <div className="flex items-center gap-1.5 mb-1 pb-0.5 border-b border-[#c59b27]/60">
                    <span className="text-[#800020] text-xs">❖</span>
                    <h2
                      className={`${config.headingSize} font-bold tracking-wider text-[#800020] uppercase`}
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {t('familyBackground', lang)}
                    </h2>
                  </div>

                  <div className="space-y-0.5 text-xs">
                    {family.fatherName && (
                      <div className="flex items-baseline">
                        <span className="w-26 text-[#7a5830] font-medium flex-shrink-0">{t('fatherName', lang)}:</span>
                        <span className="text-[#1a1a1a] font-semibold">
                          {family.fatherName}
                          {family.fatherOccupation && (
                            <span className="font-normal text-[#555]"> ({family.fatherOccupation})</span>
                          )}
                        </span>
                      </div>
                    )}

                    {family.motherName && (
                      <div className="flex items-baseline">
                        <span className="w-26 text-[#7a5830] font-medium flex-shrink-0">{t('motherName', lang)}:</span>
                        <span className="text-[#1a1a1a] font-semibold">
                          {family.motherName}
                          {family.motherOccupation && (
                            <span className="font-normal text-[#555]"> ({family.motherOccupation})</span>
                          )}
                        </span>
                      </div>
                    )}

                    {hasSiblings && (
                      <div>
                        <span className="text-[#7a5830] font-medium block mb-0.5">{t('siblings', lang)}:</span>
                        <div className="space-y-0.5 pl-2.5 border-l-2 border-[#c59b27]">
                          {family.siblings
                            .filter((s) => s.name.trim() || s.relation.trim() || s.occupation.trim())
                            .map((sibling, idx) => (
                              <div key={idx} className="flex flex-wrap items-baseline gap-1.5 leading-snug">
                                <span className="font-semibold text-[#1a1a1a]">{sibling.name}</span>
                                {sibling.relation && (
                                  <span className="text-[#800020] font-medium">({sibling.relation})</span>
                                )}
                                {sibling.occupation && (
                                  <span className="text-[#555]">— {sibling.occupation}</span>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {hasRelatives && (
                      <div>
                        <span className="text-[#7a5830] font-medium block mb-0.5">{t('notableRelatives', lang)}:</span>
                        <div className="space-y-0.5 pl-2.5 border-l-2 border-[#c59b27]">
                          {family.relatives
                            .filter((r) => r.name.trim() || r.relation.trim() || r.occupation.trim())
                            .map((rel, idx) => (
                              <div key={idx} className="flex flex-wrap items-baseline gap-1.5 leading-snug">
                                <span className="font-semibold text-[#1a1a1a]">{rel.name}</span>
                                {rel.relation && (
                                  <span className="text-[#800020] font-medium">({rel.relation})</span>
                                )}
                                {rel.occupation && (
                                  <span className="text-[#555]">— {rel.occupation}</span>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {family.nativePlace && (
                      <div className="flex items-baseline pt-0.5">
                        <span className="w-26 text-[#7a5830] font-medium flex-shrink-0">{t('nativePlace', lang)}:</span>
                        <span className="text-[#1a1a1a] font-semibold">{family.nativePlace}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Section 5: Partner Preferences */}
              {hasPreferences && (
                <div className={config.sectionMargin}>
                  <div className="flex items-center gap-1.5 mb-1 pb-0.5 border-b border-[#c59b27]/60">
                    <span className="text-[#800020] text-xs">❖</span>
                    <h2
                      className={`${config.headingSize} font-bold tracking-wider text-[#800020] uppercase`}
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {t('partnerExpectations', lang)}
                    </h2>
                  </div>
                  <p className={`text-xs text-[#333] leading-relaxed italic bg-[#fbf7ee] ${config.boxPadding} rounded-sm border border-[#e8d8b5]`}>
                    &ldquo;{partnerPreferences}&rdquo;
                  </p>
                </div>
              )}

              {/* Section 6: Hobbies / Interests (if provided) */}
              {hasHobbies && (
                <div className={config.sectionMargin}>
                  <div className="flex items-center gap-1.5 mb-1 pb-0.5 border-b border-[#c59b27]/60">
                    <span className="text-[#800020] text-xs">❖</span>
                    <h2
                      className={`${config.headingSize} font-bold tracking-wider text-[#800020] uppercase`}
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {t('hobbiesInterests', lang)}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {hobbies.map((h, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-xs bg-[#fbf7ee] border border-[#e8d8b5] text-[#7a5830] font-medium"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 7: Contact & Address */}
              {hasContact && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1 pb-0.5 border-b border-[#c59b27]/60">
                    <span className="text-[#800020] text-xs">❖</span>
                    <h2
                      className={`${config.headingSize} font-bold tracking-wider text-[#800020] uppercase`}
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {t('contactDetails', lang)}
                    </h2>
                  </div>

                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-5 ${config.gridGapY} text-xs`}>
                    {contact?.address && (
                      <div className="sm:col-span-2 flex items-baseline">
                        <span className="w-26 text-[#7a5830] font-medium flex-shrink-0">{t('address', lang)}:</span>
                        <span className="text-[#1a1a1a] font-semibold">{contact.address}</span>
                      </div>
                    )}
                    {contact?.referencePhone && (
                      <div className="flex items-baseline">
                        <span className="w-26 text-[#7a5830] font-medium flex-shrink-0">{t('contactPhone', lang)}:</span>
                        <span className="text-[#800020] font-bold">{contact.referencePhone}</span>
                      </div>
                    )}
                    {personalInfo.phone && !contact?.referencePhone?.includes(personalInfo.phone) && (
                      <div className="flex items-baseline">
                        <span className="w-26 text-[#7a5830] font-medium flex-shrink-0">{t('candidatePhone', lang)}:</span>
                        <span className="text-[#1a1a1a] font-semibold">{personalInfo.phone}</span>
                      </div>
                    )}
                    {personalInfo.email && (
                      <div className="flex items-baseline">
                        <span className="w-26 text-[#7a5830] font-medium flex-shrink-0">{t('email', lang)}:</span>
                        <span className="text-[#1a1a1a] font-semibold">{personalInfo.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Auspicious Closing Shanti Blessing anchored at bottom inside border (Sanskrit shloka stays in Sanskrit) */}
            <div className="text-center pt-1.5 border-t border-[#c59b27]/40 mt-1">
              <div
                className="text-[#800020] text-xs font-medium tracking-widest"
                style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
              >
                ॥ शुभम् भवतु ॥
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

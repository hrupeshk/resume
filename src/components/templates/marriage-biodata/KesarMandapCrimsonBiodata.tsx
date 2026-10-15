import React from 'react';
import type { BiodataDocument } from '../../../lib/schema';
import { t, translateValue, getScriptFontFamily, isRTL } from '../../../lib/translations';

interface KesarMandapCrimsonBiodataProps {
  data: BiodataDocument;
  spacingDensity?: 'compact' | 'balanced' | 'spacious';
  fontSizeScale?: number;
  language?: string;
}

export default function KesarMandapCrimsonBiodata({
  data,
  spacingDensity = 'balanced',
  fontSizeScale = 100,
  language,
}: KesarMandapCrimsonBiodataProps) {
  const { personalInfo, sections } = data;
  const { education, occupation, family, horoscope, contact, partnerPreferences, achievements, hobbies } = sections || {};

  const lang = (data.language || language || 'en') as any;
  const rtl = isRTL(lang);
  const fontFamily = getScriptFontFamily(lang, 'serif');

  // Strict empty section omission guards
  const hasPersonalDetails = Boolean(
    personalInfo.dateOfBirth?.trim() ||
    personalInfo.timeOfBirth?.trim() ||
    personalInfo.placeOfBirth?.trim() ||
    personalInfo.height?.trim() ||
    personalInfo.complexion?.trim() ||
    personalInfo.diet?.trim() ||
    personalInfo.bloodGroup?.trim()
  );

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
      columnGap: 'gap-3',
      sidebarSpace: 'space-y-1.5',
      mainSpace: 'space-y-1.5',
      photoMaxW: 'max-w-[115px]',
      cardPadding: 'p-1.5',
      headerMargin: 'mb-1.5',
      headingSize: 'text-[11px]',
      fontSizeMultiplier: 0.94,
    },
    balanced: {
      outerPadding: 'p-3 sm:p-3.5',
      innerPadding: 'p-3 sm:p-3.5',
      columnGap: 'gap-3.5 sm:gap-4',
      sidebarSpace: 'space-y-2 sm:space-y-2.5',
      mainSpace: 'space-y-2 sm:space-y-2.5',
      photoMaxW: 'max-w-[130px]',
      cardPadding: 'p-2',
      headerMargin: 'mb-2',
      headingSize: 'text-xs',
      fontSizeMultiplier: 1.0,
    },
    spacious: {
      outerPadding: 'p-3.5 sm:p-4',
      innerPadding: 'p-3.5 sm:p-4',
      columnGap: 'gap-4 sm:gap-5',
      sidebarSpace: 'space-y-2.5 sm:space-y-3',
      mainSpace: 'space-y-2.5 sm:space-y-3',
      photoMaxW: 'max-w-[140px]',
      cardPadding: 'p-2.5',
      headerMargin: 'mb-2.5',
      headingSize: 'text-xs sm:text-[13px]',
      fontSizeMultiplier: 1.05,
    },
  }[spacingDensity];

  const scale = (fontSizeScale / 100) * config.fontSizeMultiplier;

  return (
    <div
      dir={rtl ? 'rtl' : 'ltr'}
      data-lang={lang}
      className={`kesar-mandap-crimson-biodata w-full h-full bg-[#fffdf9] text-[#2c1316] relative box-border font-serif ${config.outerPadding} flex flex-col justify-between indic-text`}
      style={{
        fontFamily: fontFamily || "'Playfair Display', Georgia, serif",
        // @ts-ignore
        '--fs': scale,
      }}
    >
      {/* Outer Auspicious Saffron Gold Frame with Kumkum Inlay */}
      <div className="border-2 border-[#d97706] rounded-sm p-1 relative flex-1 flex flex-col w-full h-full shadow-xs bg-[#fffdf9]">
        <div className="border border-[#821319]/30 rounded-xs p-0.5 relative flex-1 flex flex-col w-full h-full">
          <div className={`border border-[#e5a93b]/85 ${config.innerPadding} relative bg-[#fffcf7]/95 flex-1 flex flex-col justify-between w-full h-full`}>
            
            {/* Subtle traditional inner corner ornamental L-brackets */}
            <div className="absolute top-1.5 left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-[#d97706] pointer-events-none select-none" />
            <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#d97706] pointer-events-none select-none" />
            <div className="absolute bottom-1.5 left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-[#d97706] pointer-events-none select-none" />
            <div className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-[#d97706] pointer-events-none select-none" />

            {/* Authentic Indian Paisley (Kalka / Mango) Corner Filigrees in Saffron Gold */}
            {/* Top-Left */}
            <div className="absolute top-1 left-1 w-9 h-9 sm:w-11 sm:h-11 text-[#d97706] pointer-events-none select-none">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full opacity-90">
                <path d="M0,0 L50,0 C42,12 32,22 25,38 C20,48 15,68 0,100 L0,0 Z" fill="#821319" fillOpacity="0.04" />
                <path d="M2,2 L46,2 C38,12 28,20 22,34 C16,46 12,68 2,94 L2,2 Z" stroke="#d97706" strokeWidth="1.5" />
                <path d="M12,12 C24,12 30,22 26,34 C22,46 10,42 16,28 C18,22 24,20 20,16 C16,14 12,18 12,12 Z" fill="#d97706" fillOpacity="0.8" />
                <circle cx="20" cy="20" r="3" fill="#821319" />
                <circle cx="44" cy="5" r="1.5" fill="#d97706" />
                <circle cx="5" cy="44" r="1.5" fill="#d97706" />
              </svg>
            </div>

            {/* Top-Right */}
            <div className="absolute top-1 right-1 w-9 h-9 sm:w-11 sm:h-11 text-[#d97706] pointer-events-none select-none rotate-90">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full opacity-90">
                <path d="M0,0 L50,0 C42,12 32,22 25,38 C20,48 15,68 0,100 L0,0 Z" fill="#821319" fillOpacity="0.04" />
                <path d="M2,2 L46,2 C38,12 28,20 22,34 C16,46 12,68 2,94 L2,2 Z" stroke="#d97706" strokeWidth="1.5" />
                <path d="M12,12 C24,12 30,22 26,34 C22,46 10,42 16,28 C18,22 24,20 20,16 C16,14 12,18 12,12 Z" fill="#d97706" fillOpacity="0.8" />
                <circle cx="20" cy="20" r="3" fill="#821319" />
                <circle cx="44" cy="5" r="1.5" fill="#d97706" />
                <circle cx="5" cy="44" r="1.5" fill="#d97706" />
              </svg>
            </div>

            {/* Bottom-Left */}
            <div className="absolute bottom-1 left-1 w-9 h-9 sm:w-11 sm:h-11 text-[#d97706] pointer-events-none select-none -rotate-90">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full opacity-90">
                <path d="M0,0 L50,0 C42,12 32,22 25,38 C20,48 15,68 0,100 L0,0 Z" fill="#821319" fillOpacity="0.04" />
                <path d="M2,2 L46,2 C38,12 28,20 22,34 C16,46 12,68 2,94 L2,2 Z" stroke="#d97706" strokeWidth="1.5" />
                <path d="M12,12 C24,12 30,22 26,34 C22,46 10,42 16,28 C18,22 24,20 20,16 C16,14 12,18 12,12 Z" fill="#d97706" fillOpacity="0.8" />
                <circle cx="20" cy="20" r="3" fill="#821319" />
                <circle cx="44" cy="5" r="1.5" fill="#d97706" />
                <circle cx="5" cy="44" r="1.5" fill="#d97706" />
              </svg>
            </div>

            {/* Bottom-Right */}
            <div className="absolute bottom-1 right-1 w-9 h-9 sm:w-11 sm:h-11 text-[#d97706] pointer-events-none select-none rotate-180">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full opacity-90">
                <path d="M0,0 L50,0 C42,12 32,22 25,38 C20,48 15,68 0,100 L0,0 Z" fill="#821319" fillOpacity="0.04" />
                <path d="M2,2 L46,2 C38,12 28,20 22,34 C16,46 12,68 2,94 L2,2 Z" stroke="#d97706" strokeWidth="1.5" />
                <path d="M12,12 C24,12 30,22 26,34 C22,46 10,42 16,28 C18,22 24,20 20,16 C16,14 12,18 12,12 Z" fill="#d97706" fillOpacity="0.8" />
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
                    <span className="text-[#d97706] text-xs">🪔</span>
                    <span className="h-[1px] w-8 sm:w-14 bg-gradient-to-r from-transparent to-[#d97706]" />
                    <span
                      className="text-[#821319] font-bold text-xs sm:text-sm tracking-widest uppercase"
                      style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
                    >
                      ॥ ॐ श्री गणेशाय नमः ॥
                    </span>
                    <span className="h-[1px] w-8 sm:w-14 bg-gradient-to-l from-transparent to-[#d97706]" />
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

                {/* Candidate Crown Banner */}
                <div className={`text-center ${config.headerMargin} pb-1.5 border-b border-[#f3d9b1]`}>
                  <h1
                    className="text-lg sm:text-2xl font-bold text-[#821319] tracking-wide uppercase leading-tight"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {personalInfo.fullName || t('candidateNameFallback', lang)}
                  </h1>

                  {occupation?.designation ? (
                    <div className="text-[11px] text-[#9a3412] font-medium mt-0.5">
                      {occupation.designation} {occupation.company ? `• ${occupation.company}` : ''}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 mt-0.5">
                      <span className="h-[1px] w-6 bg-[#d97706]/60" />
                      <span className="text-[10px] uppercase tracking-[0.25em] text-[#b45309] font-semibold">
                        {t('sacredMatrimonialProfile', lang)}
                      </span>
                      <span className="h-[1px] w-6 bg-[#d97706]/60" />
                    </div>
                  )}
                </div>
              </div>

              {/* Structured Twin-Column Layout */}
              <div className={`grid grid-cols-12 ${config.columnGap} items-start flex-1`}>
                
                {/* Left Column (4 Columns): Photo + Kundali + Social + Contact + Hobbies */}
                <div className={`col-span-4 ${config.sidebarSpace}`}>
                  
                  {/* Candidate Photo in Left Column */}
                  {personalInfo.photoUrl && (
                    <div className="flex justify-center">
                      <div className={`w-full ${config.photoMaxW} aspect-[4/5] rounded-xs p-1 border-2 border-[#d97706] bg-white shadow-2xs ring-2 ring-[#821319]/20`}>
                        <img
                          src={personalInfo.photoUrl}
                          alt={personalInfo.fullName || t('candidateNameFallback', lang)}
                          className="w-full h-full object-cover rounded-xs"
                        />
                      </div>
                    </div>
                  )}

                  {/* 1. Vedic Horoscope / Kundali Card */}
                  {hasHoroscope && (
                    <div className={`bg-[#fff8eb] ${config.cardPadding} rounded-xs border-2 border-[#d97706]/70 shadow-2xs relative`}>
                      <div className="flex items-center justify-between mb-1 pb-0.5 border-b border-[#f0c88b]">
                        <div className="flex items-center gap-1">
                          <span className="text-[#d97706] text-xs">卐</span>
                          <h2
                            className={`${config.headingSize} font-bold tracking-wider text-[#821319] uppercase`}
                            style={{ fontFamily: "'Cinzel', serif" }}
                          >
                            {t('kundaliHoroscope', lang)}
                          </h2>
                        </div>
                        <span className="text-[9px] uppercase px-1 py-0.2 rounded-xs bg-[#821319]/10 text-[#821319] font-bold">
                          {t('horoscopeDetails', lang)}
                        </span>
                      </div>

                      <div className="space-y-0.5 text-[10.5px]">
                        {horoscope.gothra && (
                          <div className="flex justify-between items-baseline">
                            <span className="text-[#9a3412] text-[9.5px]">{t('gothra', lang)}:</span>
                            <span className="font-semibold text-[#2c1316]">{horoscope.gothra}</span>
                          </div>
                        )}
                        {horoscope.rashi && (
                          <div className="flex justify-between items-baseline">
                            <span className="text-[#9a3412] text-[9.5px]">{t('rashi', lang)}:</span>
                            <span className="font-semibold text-[#2c1316]">{horoscope.rashi}</span>
                          </div>
                        )}
                        {horoscope.nakshatra && (
                          <div className="flex justify-between items-baseline">
                            <span className="text-[#9a3412] text-[9.5px]">{t('nakshatra', lang)}:</span>
                            <span className="font-semibold text-[#2c1316]">{horoscope.nakshatra}</span>
                          </div>
                        )}
                        {horoscope.manglik && (
                          <div className="flex justify-between items-baseline">
                            <span className="text-[#9a3412] text-[9.5px]">{t('manglikStatus', lang)}:</span>
                            <span className="font-bold text-[#821319]">{translateValue(horoscope.manglik, lang)}</span>
                          </div>
                        )}
                        {horoscope.kuldevta && (
                          <div className="pt-0.5 border-t border-[#f0c88b]/70">
                            <span className="text-[#9a3412] block text-[9px]">{t('kuldevta', lang)}:</span>
                            <span className="font-semibold text-[#821319] text-[10px]">{horoscope.kuldevta}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 2. Community & Cultural Identity */}
                  {hasCulturalIdentity && (
                    <div className={`bg-[#fffaf0] ${config.cardPadding} rounded-xs border border-[#fae2c0] shadow-2xs`}>
                      <div className="flex items-center gap-1 mb-1 pb-0.5 border-b border-[#f3d0a2]">
                        <span className="text-[#821319] text-[10px]">❖</span>
                        <h2
                          className={`${config.headingSize} font-bold tracking-wider text-[#821319] uppercase`}
                          style={{ fontFamily: "'Cinzel', serif" }}
                        >
                          {t('socialCommunity', lang)}
                        </h2>
                      </div>

                      <div className="space-y-0.5 text-[10.5px]">
                        {personalInfo.religion && (
                          <div className="flex justify-between items-baseline">
                            <span className="text-[#78350f] font-medium text-[9.5px]">{t('religion', lang)}:</span>
                            <span className="font-semibold text-[#2c1316]">{translateValue(personalInfo.religion, lang)}</span>
                          </div>
                        )}
                        {personalInfo.caste && (
                          <div className="flex justify-between items-baseline">
                            <span className="text-[#78350f] font-medium text-[9.5px]">{t('caste', lang)}:</span>
                            <span className="font-semibold text-[#2c1316]">
                              {personalInfo.caste}
                              {personalInfo.subCaste ? ` (${personalInfo.subCaste})` : ''}
                            </span>
                          </div>
                        )}
                        {personalInfo.motherTongue && (
                          <div className="flex justify-between items-baseline">
                            <span className="text-[#78350f] font-medium text-[9.5px]">{t('motherTongue', lang)}:</span>
                            <span className="font-semibold text-[#2c1316]">{translateValue(personalInfo.motherTongue, lang)}</span>
                          </div>
                        )}
                        {personalInfo.languagesKnown && (
                          <div className="pt-0.5">
                            <span className="text-[#78350f] block text-[9px]">{t('languagesKnown', lang)}:</span>
                            <span className="font-medium text-[#2c1316] text-[10px]">{personalInfo.languagesKnown}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 3. Contact & Correspondence */}
                  {hasContact && (
                    <div className={`bg-[#fffaf0] ${config.cardPadding} rounded-xs border border-[#fae2c0] shadow-2xs`}>
                      <div className="flex items-center gap-1 mb-1 pb-0.5 border-b border-[#f3d0a2]">
                        <span className="text-[#821319] text-[10px]">❖</span>
                        <h2
                          className={`${config.headingSize} font-bold tracking-wider text-[#821319] uppercase`}
                          style={{ fontFamily: "'Cinzel', serif" }}
                        >
                          {t('contactResidence', lang)}
                        </h2>
                      </div>

                      <div className="space-y-0.5 text-[10.5px]">
                        {contact?.referencePhone && (
                          <div>
                            <span className="text-[#9a3412] block text-[9px]">{t('contactPhone', lang)}:</span>
                            <span className="font-bold text-[#821319]">{contact.referencePhone}</span>
                          </div>
                        )}
                        {personalInfo.phone && !contact?.referencePhone?.includes(personalInfo.phone) && (
                          <div>
                            <span className="text-[#9a3412] block text-[9px]">{t('candidatePhone', lang)}:</span>
                            <span className="font-semibold text-[#2c1316]">{personalInfo.phone}</span>
                          </div>
                        )}
                        {personalInfo.email && (
                          <div>
                            <span className="text-[#9a3412] block text-[9px]">{t('email', lang)}:</span>
                            <span className="font-semibold text-[#2c1316] break-all text-[10px]">{personalInfo.email}</span>
                          </div>
                        )}
                        {contact?.address && (
                          <div>
                            <span className="text-[#9a3412] block text-[9px]">{t('address', lang)}:</span>
                            <span className="font-medium text-[#2c1316] leading-tight text-[10px]">{contact.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 4. Interests & Hobbies (Placed in Left Column for Optimal Balance) */}
                  {hasHobbies && (
                    <div className={`bg-[#fffaf0] ${config.cardPadding} rounded-xs border border-[#fae2c0] shadow-2xs`}>
                      <div className="flex items-center gap-1 mb-1 pb-0.5 border-b border-[#f3d0a2]">
                        <span className="text-[#821319] text-[10px]">❖</span>
                        <h2
                          className={`${config.headingSize} font-bold tracking-wider text-[#821319] uppercase`}
                          style={{ fontFamily: "'Cinzel', serif" }}
                        >
                          {t('hobbiesInterests', lang)}
                        </h2>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {hobbies.map((h, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded-xs bg-[#821319]/10 border border-[#821319]/25 text-[#821319] text-[9.5px] font-medium"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column (8 Columns): Personal Details + Education + Family Background + Partner Expectations */}
                <div className={`col-span-8 ${config.mainSpace}`}>
                  
                  {/* 1. Personal & Physical Essentials */}
                  {hasPersonalDetails && (
                    <div className={`bg-[#fffaf0] ${config.cardPadding} rounded-xs border border-[#fae2c0] shadow-2xs`}>
                      <div className="flex items-center gap-1 mb-1 pb-0.5 border-b border-[#f3d0a2]">
                        <span className="text-[#821319] text-[10px]">❖</span>
                        <h2
                          className={`${config.headingSize} font-bold tracking-wider text-[#821319] uppercase`}
                          style={{ fontFamily: "'Cinzel', serif" }}
                        >
                          {t('personalDetails', lang)}
                        </h2>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10.5px]">
                        {personalInfo.dateOfBirth && (
                          <div className="flex items-baseline">
                            <span className="w-24 text-[#78350f] font-medium flex-shrink-0">{t('dateOfBirth', lang)}:</span>
                            <span className="font-semibold text-[#2c1316]">{personalInfo.dateOfBirth}</span>
                          </div>
                        )}
                        {personalInfo.timeOfBirth && (
                          <div className="flex items-baseline">
                            <span className="w-24 text-[#78350f] font-medium flex-shrink-0">{t('timeOfBirth', lang)}:</span>
                            <span className="font-semibold text-[#2c1316]">{personalInfo.timeOfBirth}</span>
                          </div>
                        )}
                        {personalInfo.placeOfBirth && (
                          <div className="flex items-baseline">
                            <span className="w-24 text-[#78350f] font-medium flex-shrink-0">{t('placeOfBirth', lang)}:</span>
                            <span className="font-semibold text-[#2c1316]">{personalInfo.placeOfBirth}</span>
                          </div>
                        )}
                        {personalInfo.height && (
                          <div className="flex items-baseline">
                            <span className="w-24 text-[#78350f] font-medium flex-shrink-0">{t('height', lang)}:</span>
                            <span className="font-semibold text-[#2c1316]">{personalInfo.height}</span>
                          </div>
                        )}
                        {personalInfo.complexion && (
                          <div className="flex items-baseline">
                            <span className="w-24 text-[#78350f] font-medium flex-shrink-0">{t('complexion', lang)}:</span>
                            <span className="font-semibold text-[#2c1316]">{translateValue(personalInfo.complexion, lang)}</span>
                          </div>
                        )}
                        {personalInfo.diet && (
                          <div className="flex items-baseline">
                            <span className="w-24 text-[#78350f] font-medium flex-shrink-0">{t('diet', lang)}:</span>
                            <span className="font-semibold text-[#2c1316]">{translateValue(personalInfo.diet, lang)}</span>
                          </div>
                        )}
                        {personalInfo.bloodGroup && (
                          <div className="flex items-baseline">
                            <span className="w-24 text-[#78350f] font-medium flex-shrink-0">{t('bloodGroup', lang)}:</span>
                            <span className="font-semibold text-[#2c1316]">{personalInfo.bloodGroup}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 2. Education & Profession */}
                  {hasEducationOrOccupation && (
                    <div className={`bg-[#fffaf0] ${config.cardPadding} rounded-xs border border-[#fae2c0] shadow-2xs`}>
                      <div className="flex items-center gap-1 mb-1 pb-0.5 border-b border-[#f3d0a2]">
                        <span className="text-[#821319] text-[10px]">❖</span>
                        <h2
                          className={`${config.headingSize} font-bold tracking-wider text-[#821319] uppercase`}
                          style={{ fontFamily: "'Cinzel', serif" }}
                        >
                          {t('educationProfession', lang)}
                        </h2>
                      </div>

                      <div className="space-y-1.5 text-[11px]">
                        {hasEducation && (
                          <div>
                            <span className="text-[#9a3412] font-medium text-[9.5px] block uppercase tracking-wider mb-0.5">
                              {t('academicQualifications', lang)}
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
                              {t('professionalCareer', lang)}
                            </span>
                            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                              {occupation.designation && (
                                <div className="col-span-2 sm:col-span-1">
                                  <span className="text-[#9a3412] block text-[9px]">{t('designation', lang)}:</span>
                                  <span className="font-semibold text-[#2c1316]">{occupation.designation}</span>
                                </div>
                              )}
                              {occupation.company && (
                                <div className="col-span-2 sm:col-span-1">
                                  <span className="text-[#9a3412] block text-[9px]">{t('organization', lang)}:</span>
                                  <span className="font-semibold text-[#2c1316]">{occupation.company}</span>
                                </div>
                              )}
                              {occupation.income && (
                                <div className="col-span-2 pt-0.5">
                                  <span className="text-[#9a3412] block text-[9px]">{t('annualPackage', lang)}:</span>
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
                              {t('accoladesAchievements', lang)}
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

                  {/* 3. Family Background & Lineage */}
                  {hasFamily && (
                    <div className={`bg-[#fffaf0] ${config.cardPadding} rounded-xs border border-[#fae2c0] shadow-2xs`}>
                      <div className="flex items-center gap-1 mb-1 pb-0.5 border-b border-[#f3d0a2]">
                        <span className="text-[#821319] text-[10px]">❖</span>
                        <h2
                          className={`${config.headingSize} font-bold tracking-wider text-[#821319] uppercase`}
                          style={{ fontFamily: "'Cinzel', serif" }}
                        >
                          {t('familyBackground', lang)}
                        </h2>
                      </div>

                      <div className="space-y-1 text-[11px]">
                        {family.fatherName && (
                          <div className="flex flex-wrap items-baseline gap-1">
                            <span className="text-[#78350f] font-medium w-24 flex-shrink-0">{t('father', lang)}:</span>
                            <span className="font-semibold text-[#2c1316]">
                              {family.fatherName}
                              {family.fatherOccupation && (
                                <span className="font-normal text-[#555] text-[10px]">
                                  {' '}• {family.fatherOccupation}
                                </span>
                              )}
                            </span>
                          </div>
                        )}

                        {family.motherName && (
                          <div className="flex flex-wrap items-baseline gap-1">
                            <span className="text-[#78350f] font-medium w-24 flex-shrink-0">{t('mother', lang)}:</span>
                            <span className="font-semibold text-[#2c1316]">
                              {family.motherName}
                              {family.motherOccupation && (
                                <span className="font-normal text-[#555] text-[10px]">
                                  {' '}• {family.motherOccupation}
                                </span>
                              )}
                            </span>
                          </div>
                        )}

                        {hasSiblings && (
                          <div className="pt-0.5">
                            <span className="text-[#78350f] font-medium block text-[9.5px] mb-0.5">{t('siblings', lang)}:</span>
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
                            <span className="text-[#78350f] font-medium block text-[9.5px] mb-0.5">{t('distinguishedRelatives', lang)}:</span>
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
                            <span className="text-[#78350f] font-medium w-24 flex-shrink-0">{t('nativePlace', lang)}:</span>
                            <span className="font-semibold text-[#2c1316] text-[10.5px]">{family.nativePlace}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 4. Partner Preferences */}
                  {hasPreferences && (
                    <div className={`bg-[#fffaf0] ${config.cardPadding} rounded-xs border border-[#fae2c0] shadow-2xs`}>
                      <div className="flex items-center gap-1 mb-1 pb-0.5 border-b border-[#f3d0a2]">
                        <span className="text-[#821319] text-[10px]">❖</span>
                        <h2
                          className={`${config.headingSize} font-bold tracking-wider text-[#821319] uppercase`}
                          style={{ fontFamily: "'Cinzel', serif" }}
                        >
                          {t('partnerExpectations', lang)}
                        </h2>
                      </div>
                      <p className="text-[10.5px] text-[#3b191c] leading-relaxed italic bg-white/70 p-1.5 rounded-xs border border-[#f5dfc2]">
                        &ldquo;{partnerPreferences}&rdquo;
                      </p>
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
                  {t('mayAllBlessingsAbide', lang)}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

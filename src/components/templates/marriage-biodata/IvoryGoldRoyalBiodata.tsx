import React from 'react';
import type { BiodataDocument } from '../../../lib/schema';

interface IvoryGoldRoyalBiodataProps {
  data: BiodataDocument;
  spacingDensity?: 'compact' | 'balanced' | 'spacious';
  fontSizeScale?: number;
}

export default function IvoryGoldRoyalBiodata({
  data,
  spacingDensity = 'balanced',
  fontSizeScale = 100,
}: IvoryGoldRoyalBiodataProps) {
  const { personalInfo, sections } = data;
  const { education, occupation, family, horoscope, contact, partnerPreferences, achievements, hobbies } = sections || {};

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
    personalInfo.bloodGroup?.trim() ||
    personalInfo.religion?.trim() ||
    personalInfo.caste?.trim() ||
    personalInfo.motherTongue?.trim() ||
    personalInfo.languagesKnown?.trim()
  );

  // Density configurations
  const config = {
    compact: {
      gap: 'gap-3',
      sidebarSpace: 'space-y-2',
      mainSpace: 'space-y-2',
      photoMaxW: 'max-w-[115px]',
      cardPadding: 'p-1.5',
      headerMargin: 'mb-1.5',
      fontSizeMultiplier: 0.94,
    },
    balanced: {
      gap: 'gap-4',
      sidebarSpace: 'space-y-2.5',
      mainSpace: 'space-y-2.5',
      photoMaxW: 'max-w-[130px]',
      cardPadding: 'p-2',
      headerMargin: 'mb-2',
      fontSizeMultiplier: 1.0,
    },
    spacious: {
      gap: 'gap-5',
      sidebarSpace: 'space-y-3.5',
      mainSpace: 'space-y-3.5',
      photoMaxW: 'max-w-[140px]',
      cardPadding: 'p-2.5',
      headerMargin: 'mb-3',
      fontSizeMultiplier: 1.05,
    },
  }[spacingDensity];

  const scale = (fontSizeScale / 100) * config.fontSizeMultiplier;

  return (
    <div
      className="ivory-gold-royal-biodata w-full h-full bg-[#fdfaf5] text-[#1c1917] relative box-border font-serif p-3 sm:p-3.5 flex flex-col justify-between"
      style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        // @ts-ignore
        '--fs': scale,
      }}
    >
      {/* Decorative Gold Border Frame spanning full A4 page */}
      <div className="border border-[#d4af37]/80 rounded-sm p-3 sm:p-3.5 bg-[#ffffff]/90 shadow-sm relative flex-1 flex flex-col justify-between w-full h-full">
        {/* Subtle decorative inner corner ornaments */}
        <div className="absolute top-1.5 left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-[#b8860b]" />
        <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#b8860b]" />
        <div className="absolute bottom-1.5 left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-[#b8860b]" />
        <div className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-[#b8860b]" />

        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Top Auspicious Invocation Banner (shubh removed) */}
            <div className="text-center mb-1.5 pb-1 border-b border-[#e5d5b5]">
              <div
                className="text-[#966b1e] text-xs sm:text-sm font-semibold tracking-widest uppercase"
                style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
              >
                ॥ ॐ श्री गणेशाय नमः ॥
              </div>
              <div className="text-[9.5px] tracking-[0.25em] uppercase text-[#a37d36] font-medium mt-0.5">
                Matrimonial Profile
              </div>
            </div>

            {/* Header: Candidate Name & Title */}
            <div className={`text-center ${config.headerMargin}`}>
              <h1
                className="text-lg sm:text-2xl font-bold text-[#1c1917] tracking-wider uppercase leading-tight"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {personalInfo.fullName || 'Candidate Name'}
              </h1>
              {occupation?.designation && (
                <div className="text-[11px] text-[#8c6b2d] font-medium mt-0.5">
                  {occupation.designation} {occupation.company ? `• ${occupation.company}` : ''}
                </div>
              )}
            </div>
          </div>

          {/* Fixed Twin-Column Structure for Both Preview and Print */}
          <div className={`grid grid-cols-12 ${config.gap} items-start flex-1`}>
            
            {/* Left Column (4 cols): Photo + Astro / Horoscope + Cultural + Contact + Hobbies */}
            <div className={`col-span-4 ${config.sidebarSpace}`}>
              {/* Candidate Photo */}
              {personalInfo.photoUrl ? (
                <div className="flex justify-center">
                  <div className={`w-full ${config.photoMaxW} aspect-[4/5] rounded-sm p-0.5 border border-[#d4af37] bg-white shadow-2xs`}>
                    <img
                      src={personalInfo.photoUrl}
                      alt={personalInfo.fullName || 'Candidate'}
                      className="w-full h-full object-cover rounded-xs"
                    />
                  </div>
                </div>
              ) : null}

              {/* Horoscope / Astro Details Card */}
              {hasHoroscope && (
                <div className={`bg-[#fcf8f0] ${config.cardPadding} rounded-sm border border-[#e8dcc4] space-y-1 text-xs`}>
                  <div className="text-[10px] font-bold tracking-wider text-[#8c6b2d] uppercase border-b border-[#e8dcc4] pb-0.5">
                    Horoscope Details
                  </div>
                  {horoscope.gothra && (
                    <div className="flex justify-between items-baseline text-[10.5px]">
                      <span className="text-[#666]">Gotra:</span>
                      <span className="font-semibold text-[#1c1917]">{horoscope.gothra}</span>
                    </div>
                  )}
                  {horoscope.rashi && (
                    <div className="flex justify-between items-baseline text-[10.5px]">
                      <span className="text-[#666]">Rashi:</span>
                      <span className="font-semibold text-[#1c1917]">{horoscope.rashi}</span>
                    </div>
                  )}
                  {horoscope.nakshatra && (
                    <div className="flex justify-between items-baseline text-[10.5px]">
                      <span className="text-[#666]">Nakshatra:</span>
                      <span className="font-semibold text-[#1c1917]">{horoscope.nakshatra}</span>
                    </div>
                  )}
                  {horoscope.manglik && (
                    <div className="flex justify-between items-baseline text-[10.5px]">
                      <span className="text-[#666]">Manglik:</span>
                      <span className="font-bold text-[#966b1e]">{horoscope.manglik}</span>
                    </div>
                  )}
                  {horoscope.kuldevta && (
                    <div className="pt-0.5 border-t border-[#e8dcc4]/60 text-[10.5px]">
                      <span className="text-[#666] block text-[9.5px]">Kuldevta / Devi:</span>
                      <span className="font-semibold text-[#8c6b2d]">{horoscope.kuldevta}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Cultural / Community Identity Card */}
              {hasCulturalIdentity && (
                <div className={`bg-[#fcf8f0] ${config.cardPadding} rounded-sm border border-[#e8dcc4] space-y-1 text-xs`}>
                  <div className="text-[10px] font-bold tracking-wider text-[#8c6b2d] uppercase border-b border-[#e8dcc4] pb-0.5">
                    Social & Cultural
                  </div>
                  {personalInfo.religion && (
                    <div className="flex justify-between items-baseline text-[10.5px]">
                      <span className="text-[#666]">Religion:</span>
                      <span className="font-semibold text-[#1c1917]">{personalInfo.religion}</span>
                    </div>
                  )}
                  {personalInfo.caste && (
                    <div className="flex justify-between items-baseline text-[10.5px]">
                      <span className="text-[#666]">Caste:</span>
                      <span className="font-semibold text-[#1c1917]">
                        {personalInfo.caste}
                        {personalInfo.subCaste ? ` (${personalInfo.subCaste})` : ''}
                      </span>
                    </div>
                  )}
                  {personalInfo.bloodGroup && (
                    <div className="flex justify-between items-baseline text-[10.5px]">
                      <span className="text-[#666]">Blood Group:</span>
                      <span className="font-semibold text-[#1c1917]">{personalInfo.bloodGroup}</span>
                    </div>
                  )}
                  {personalInfo.motherTongue && (
                    <div className="flex justify-between items-baseline text-[10.5px]">
                      <span className="text-[#666]">Mother Tongue:</span>
                      <span className="font-semibold text-[#1c1917]">{personalInfo.motherTongue}</span>
                    </div>
                  )}
                  {personalInfo.languagesKnown && (
                    <div className="text-[10px] pt-0.5">
                      <span className="text-[#666] block">Languages:</span>
                      <span className="font-medium text-[#1c1917]">{personalInfo.languagesKnown}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Contact Card */}
              {hasContact && (
                <div className={`bg-[#fcf8f0] ${config.cardPadding} rounded-sm border border-[#e8dcc4] space-y-1 text-xs`}>
                  <div className="text-[10px] font-bold tracking-wider text-[#8c6b2d] uppercase border-b border-[#e8dcc4] pb-0.5">
                    Contact
                  </div>
                  {contact?.referencePhone && (
                    <div>
                      <span className="text-[9px] text-[#777] block leading-none">Contact Phone:</span>
                      <span className="font-semibold text-[#1c1917] text-[10.5px]">{contact.referencePhone}</span>
                    </div>
                  )}
                  {personalInfo.phone && !contact?.referencePhone?.includes(personalInfo.phone) && (
                    <div>
                      <span className="text-[9px] text-[#777] block leading-none">Direct Phone:</span>
                      <span className="font-semibold text-[#1c1917] text-[10.5px]">{personalInfo.phone}</span>
                    </div>
                  )}
                  {personalInfo.email && (
                    <div>
                      <span className="text-[9px] text-[#777] block leading-none">Email:</span>
                      <span className="font-semibold text-[#1c1917] text-[10px] break-all">{personalInfo.email}</span>
                    </div>
                  )}
                  {contact?.address && (
                    <div>
                      <span className="text-[9px] text-[#777] block leading-none">Residence:</span>
                      <span className="font-medium text-[#1c1917] text-[10px] leading-snug">{contact.address}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Hobbies Card (if present) */}
              {hasHobbies && (
                <div className={`bg-[#fcf8f0] ${config.cardPadding} rounded-sm border border-[#e8dcc4] space-y-1 text-xs`}>
                  <div className="text-[10px] font-bold tracking-wider text-[#8c6b2d] uppercase border-b border-[#e8dcc4] pb-0.5">
                    Hobbies & Interests
                  </div>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {hobbies.map((h, i) => (
                      <span key={i} className="text-[9.5px] px-1.5 py-0.2 bg-white rounded-xs border border-[#e8dcc4] text-[#8c6b2d] font-medium">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column (8 cols): Personal Details, Education, Career, Family, Expectations */}
            <div className={`col-span-8 ${config.mainSpace}`}>
              
              {/* Section: Personal Info */}
              <div>
                <div className="flex items-center gap-1.5 mb-1 pb-0.5 border-b border-[#e5d5b5]">
                  <span className="text-[#8c6b2d] text-xs">◆</span>
                  <h2
                    className="text-xs font-bold tracking-wider text-[#1c1917] uppercase"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Personal Information
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
                  {personalInfo.dateOfBirth && (
                    <div className="flex items-baseline">
                      <span className="w-22 text-[#777] flex-shrink-0">DOB:</span>
                      <span className="font-semibold text-[#1c1917]">{personalInfo.dateOfBirth}</span>
                    </div>
                  )}
                  {personalInfo.timeOfBirth && (
                    <div className="flex items-baseline">
                      <span className="w-22 text-[#777] flex-shrink-0">Birth Time:</span>
                      <span className="font-semibold text-[#1c1917]">{personalInfo.timeOfBirth}</span>
                    </div>
                  )}
                  {personalInfo.placeOfBirth && (
                    <div className="flex items-baseline">
                      <span className="w-22 text-[#777] flex-shrink-0">Birth Place:</span>
                      <span className="font-semibold text-[#1c1917]">{personalInfo.placeOfBirth}</span>
                    </div>
                  )}
                  {personalInfo.height && (
                    <div className="flex items-baseline">
                      <span className="w-22 text-[#777] flex-shrink-0">Height:</span>
                      <span className="font-semibold text-[#1c1917]">{personalInfo.height}</span>
                    </div>
                  )}
                  {personalInfo.complexion && (
                    <div className="flex items-baseline">
                      <span className="w-22 text-[#777] flex-shrink-0">Complexion:</span>
                      <span className="font-semibold text-[#1c1917]">{personalInfo.complexion}</span>
                    </div>
                  )}
                  {personalInfo.diet && (
                    <div className="flex items-baseline">
                      <span className="w-22 text-[#777] flex-shrink-0">Diet:</span>
                      <span className="font-semibold text-[#1c1917]">{personalInfo.diet}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Section: Education & Profession */}
              {hasEducationOrOccupation && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1 pb-0.5 border-b border-[#e5d5b5]">
                    <span className="text-[#8c6b2d] text-xs">◆</span>
                    <h2
                      className="text-xs font-bold tracking-wider text-[#1c1917] uppercase"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      Education & Career
                    </h2>
                  </div>

                  <div className="space-y-1 text-xs">
                    {hasEducation && (
                      <div className="space-y-0.5">
                        {education
                          .filter((e) => e.degree.trim() || e.institution.trim())
                          .map((edu, idx) => (
                            <div key={idx} className="flex flex-wrap items-baseline gap-1.5 leading-snug">
                              <span className="text-[#8c6b2d] text-[10px]">▸</span>
                              <span className="font-semibold text-[#1c1917]">{edu.degree}</span>
                              {edu.institution && (
                                <span className="text-[#666]">({edu.institution})</span>
                              )}
                            </div>
                          ))}
                      </div>
                    )}

                    {hasOccupation && (
                      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 pt-0.5 border-t border-[#f0e6d2]">
                        {occupation.designation && (
                          <div className="flex items-baseline">
                            <span className="w-20 text-[#777] flex-shrink-0">Role:</span>
                            <span className="font-semibold text-[#1c1917]">{occupation.designation}</span>
                          </div>
                        )}
                        {occupation.company && (
                          <div className="flex items-baseline">
                            <span className="w-20 text-[#777] flex-shrink-0">Company:</span>
                            <span className="font-semibold text-[#1c1917]">{occupation.company}</span>
                          </div>
                        )}
                        {occupation.income && (
                          <div className="flex items-baseline col-span-2">
                            <span className="w-20 text-[#777] flex-shrink-0">Income:</span>
                            <span className="font-bold text-[#8c6b2d]">{occupation.income}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {hasAchievements && (
                      <div className="pt-0.5 border-t border-[#f0e6d2]">
                        <span className="text-[10.5px] font-semibold text-[#8c6b2d] block mb-0.5">Honors & Achievements:</span>
                        <div className="space-y-0.5 pl-2">
                          {achievements
                            .filter((a) => a.trim().length > 0)
                            .map((ach, idx) => (
                              <div key={idx} className="text-[#1c1917] text-[11px] leading-snug">
                                • {ach}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Section: Family Background */}
              {hasFamily && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1 pb-0.5 border-b border-[#e5d5b5]">
                    <span className="text-[#8c6b2d] text-xs">◆</span>
                    <h2
                      className="text-xs font-bold tracking-wider text-[#1c1917] uppercase"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      Family Details
                    </h2>
                  </div>

                  <div className="space-y-0.5 text-xs">
                    {family.fatherName && (
                      <div className="flex items-baseline">
                        <span className="w-20 text-[#777] flex-shrink-0">Father:</span>
                        <span className="font-semibold text-[#1c1917]">
                          {family.fatherName}
                          {family.fatherOccupation && (
                            <span className="font-normal text-[#666]"> ({family.fatherOccupation})</span>
                          )}
                        </span>
                      </div>
                    )}

                    {family.motherName && (
                      <div className="flex items-baseline">
                        <span className="w-20 text-[#777] flex-shrink-0">Mother:</span>
                        <span className="font-semibold text-[#1c1917]">
                          {family.motherName}
                          {family.motherOccupation && (
                            <span className="font-normal text-[#666]"> ({family.motherOccupation})</span>
                          )}
                        </span>
                      </div>
                    )}

                    {hasSiblings && (
                      <div>
                        <span className="text-[#777] block mb-0.5">Siblings:</span>
                        <div className="space-y-0.5 pl-2.5 border-l border-[#d4af37]">
                          {family.siblings
                            .filter((s) => s.name.trim() || s.relation.trim() || s.occupation.trim())
                            .map((sibling, idx) => (
                              <div key={idx} className="flex flex-wrap items-baseline gap-1.5 leading-snug">
                                <span className="font-semibold text-[#1c1917]">{sibling.name}</span>
                                {sibling.relation && (
                                  <span className="text-[#8c6b2d] font-medium">({sibling.relation})</span>
                                )}
                                {sibling.occupation && (
                                  <span className="text-[#666]">— {sibling.occupation}</span>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {hasRelatives && (
                      <div>
                        <span className="text-[#777] block mb-0.5">Notable Relatives:</span>
                        <div className="space-y-0.5 pl-2.5 border-l border-[#d4af37]">
                          {family.relatives
                            .filter((r) => r.name.trim() || r.relation.trim() || r.occupation.trim())
                            .map((rel, idx) => (
                              <div key={idx} className="flex flex-wrap items-baseline gap-1.5 leading-snug">
                                <span className="font-semibold text-[#1c1917]">{rel.name}</span>
                                {rel.relation && (
                                  <span className="text-[#8c6b2d] font-medium">({rel.relation})</span>
                                )}
                                {rel.occupation && (
                                  <span className="text-[#666]">— {rel.occupation}</span>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {family.nativePlace && (
                      <div className="flex items-baseline pt-0.5">
                        <span className="w-20 text-[#777] flex-shrink-0">Native Place:</span>
                        <span className="font-semibold text-[#1c1917]">{family.nativePlace}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Section: Partner Preferences */}
              {hasPreferences && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1 pb-0.5 border-b border-[#e5d5b5]">
                    <span className="text-[#8c6b2d] text-xs">◆</span>
                    <h2
                      className="text-xs font-bold tracking-wider text-[#1c1917] uppercase"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      Partner Expectations
                    </h2>
                  </div>
                  <p className={`text-xs text-[#333] leading-relaxed italic bg-[#fcf8f0] ${config.cardPadding} rounded-sm border border-[#e8dcc4]`}>
                    &ldquo;{partnerPreferences}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer Blessing anchored at bottom inside border frame */}
          <div className="text-center pt-1.5 border-t border-[#e5d5b5]/60 mt-1">
            <div
              className="text-[#966b1e] text-xs tracking-widest"
              style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
            >
              ॥ सदा सर्वदा मंगलम् ॥
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

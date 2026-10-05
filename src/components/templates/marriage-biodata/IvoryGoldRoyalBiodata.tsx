import React from 'react';
import type { BiodataDocument } from '../../../lib/schema';

interface IvoryGoldRoyalBiodataProps {
  data: BiodataDocument;
}

export default function IvoryGoldRoyalBiodata({ data }: IvoryGoldRoyalBiodataProps) {
  const { personalInfo, sections } = data;
  const { education, occupation, family, horoscope, contact, partnerPreferences } = sections || {};

  const hasHoroscope = Boolean(
    horoscope?.gothra?.trim() ||
    horoscope?.rashi?.trim() ||
    horoscope?.nakshatra?.trim() ||
    horoscope?.manglik?.trim()
  );

  const hasEducation = Boolean(
    education && education.some((e) => e.degree.trim() || e.institution.trim())
  );

  const hasOccupation = Boolean(
    occupation?.designation?.trim() ||
    occupation?.company?.trim() ||
    occupation?.income?.trim()
  );

  const hasEducationOrOccupation = hasEducation || hasOccupation;

  const hasSiblings = Boolean(
    family?.siblings &&
    family.siblings.some((s) => s.name.trim() || s.relation.trim() || s.occupation.trim())
  );

  const hasFamily = Boolean(
    family?.fatherName?.trim() ||
    family?.motherName?.trim() ||
    family?.nativePlace?.trim() ||
    hasSiblings
  );

  const hasPreferences = Boolean(partnerPreferences?.trim());

  const hasContact = Boolean(
    contact?.address?.trim() ||
    contact?.referencePhone?.trim() ||
    personalInfo.phone?.trim() ||
    personalInfo.email?.trim()
  );

  return (
    <div
      className="ivory-gold-royal-biodata w-full min-h-full bg-[#fdfaf5] text-[#1c1917] relative box-border font-serif p-6 sm:p-8"
      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
    >
      {/* Decorative Gold Border Frame */}
      <div className="border border-[#d4af37]/80 rounded-sm p-4 sm:p-6 bg-[#ffffff]/90 shadow-sm relative">
        {/* Subtle decorative inner corner ornaments */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#b8860b]" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#b8860b]" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#b8860b]" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#b8860b]" />

        {/* Top Auspicious Invocation Banner */}
        <div className="text-center mb-4 pb-2 border-b border-[#e5d5b5]">
          <div
            className="text-[#966b1e] text-sm sm:text-base font-semibold tracking-widest uppercase"
            style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
          >
            ॥ ॐ श्री गणेशाय नमः ॥
          </div>
          <div className="text-[10px] tracking-[0.25em] uppercase text-[#a37d36] font-medium mt-0.5">
            Matrimonial Profile
          </div>
        </div>

        {/* Header: Candidate Name & Title */}
        <div className="text-center mb-5">
          <h1
            className="text-2xl sm:text-3xl font-bold text-[#1c1917] tracking-wider uppercase"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {personalInfo.fullName || 'Candidate Name'}
          </h1>
          {occupation?.designation && (
            <div className="text-xs text-[#8c6b2d] font-medium mt-1">
              {occupation.designation} {occupation.company ? `• ${occupation.company}` : ''}
            </div>
          )}
        </div>

        {/* Layout Grid: Left Sidebar for Photo & Quick Specs, Right Main for Narrative Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          
          {/* Left Column (4 cols): Photo + Astro / Horoscope + Quick Specs + Contact */}
          <div className="md:col-span-4 space-y-4">
            {/* Candidate Photo */}
            {personalInfo.photoUrl ? (
              <div className="flex justify-center">
                <div className="w-full max-w-[160px] aspect-[4/5] rounded-sm p-1 border border-[#d4af37] bg-white shadow-xs">
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
              <div className="bg-[#fcf8f0] p-3 rounded-sm border border-[#e8dcc4] space-y-1.5 text-xs">
                <div className="text-[11px] font-bold tracking-wider text-[#8c6b2d] uppercase border-b border-[#e8dcc4] pb-1">
                  Horoscope Details
                </div>
                {horoscope.gothra && (
                  <div className="flex justify-between items-baseline">
                    <span className="text-[#666]">Gotra:</span>
                    <span className="font-semibold text-[#1c1917]">{horoscope.gothra}</span>
                  </div>
                )}
                {horoscope.rashi && (
                  <div className="flex justify-between items-baseline">
                    <span className="text-[#666]">Rashi:</span>
                    <span className="font-semibold text-[#1c1917]">{horoscope.rashi}</span>
                  </div>
                )}
                {horoscope.nakshatra && (
                  <div className="flex justify-between items-baseline">
                    <span className="text-[#666]">Nakshatra:</span>
                    <span className="font-semibold text-[#1c1917]">{horoscope.nakshatra}</span>
                  </div>
                )}
                {horoscope.manglik && (
                  <div className="flex justify-between items-baseline">
                    <span className="text-[#666]">Manglik:</span>
                    <span className="font-bold text-[#966b1e]">{horoscope.manglik}</span>
                  </div>
                )}
              </div>
            )}

            {/* Quick Contact Card */}
            {hasContact && (
              <div className="bg-[#fcf8f0] p-3 rounded-sm border border-[#e8dcc4] space-y-1.5 text-xs">
                <div className="text-[11px] font-bold tracking-wider text-[#8c6b2d] uppercase border-b border-[#e8dcc4] pb-1">
                  Contact
                </div>
                {contact?.referencePhone && (
                  <div>
                    <span className="text-[10px] text-[#777] block">Contact Phone:</span>
                    <span className="font-semibold text-[#1c1917]">{contact.referencePhone}</span>
                  </div>
                )}
                {personalInfo.phone && !contact?.referencePhone?.includes(personalInfo.phone) && (
                  <div>
                    <span className="text-[10px] text-[#777] block">Direct Phone:</span>
                    <span className="font-semibold text-[#1c1917]">{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.email && (
                  <div>
                    <span className="text-[10px] text-[#777] block">Email:</span>
                    <span className="font-semibold text-[#1c1917] break-all">{personalInfo.email}</span>
                  </div>
                )}
                {contact?.address && (
                  <div>
                    <span className="text-[10px] text-[#777] block">Residence:</span>
                    <span className="font-medium text-[#1c1917]">{contact.address}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column (8 cols): Personal Details, Education, Career, Family, Expectations */}
          <div className="md:col-span-8 space-y-4">
            
            {/* Section: Personal Info */}
            <div>
              <div className="flex items-center gap-2 mb-2 pb-1 border-b border-[#e5d5b5]">
                <span className="text-[#8c6b2d] text-xs">◆</span>
                <h2
                  className="text-xs sm:text-sm font-bold tracking-wider text-[#1c1917] uppercase"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                {personalInfo.dateOfBirth && (
                  <div className="flex items-baseline">
                    <span className="w-24 text-[#777] flex-shrink-0">DOB:</span>
                    <span className="font-semibold text-[#1c1917]">{personalInfo.dateOfBirth}</span>
                  </div>
                )}
                {personalInfo.timeOfBirth && (
                  <div className="flex items-baseline">
                    <span className="w-24 text-[#777] flex-shrink-0">Birth Time:</span>
                    <span className="font-semibold text-[#1c1917]">{personalInfo.timeOfBirth}</span>
                  </div>
                )}
                {personalInfo.placeOfBirth && (
                  <div className="flex items-baseline">
                    <span className="w-24 text-[#777] flex-shrink-0">Birth Place:</span>
                    <span className="font-semibold text-[#1c1917]">{personalInfo.placeOfBirth}</span>
                  </div>
                )}
                {personalInfo.height && (
                  <div className="flex items-baseline">
                    <span className="w-24 text-[#777] flex-shrink-0">Height:</span>
                    <span className="font-semibold text-[#1c1917]">{personalInfo.height}</span>
                  </div>
                )}
                {personalInfo.complexion && (
                  <div className="flex items-baseline">
                    <span className="w-24 text-[#777] flex-shrink-0">Complexion:</span>
                    <span className="font-semibold text-[#1c1917]">{personalInfo.complexion}</span>
                  </div>
                )}
                {personalInfo.diet && (
                  <div className="flex items-baseline">
                    <span className="w-24 text-[#777] flex-shrink-0">Diet:</span>
                    <span className="font-semibold text-[#1c1917]">{personalInfo.diet}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Section: Education & Profession */}
            {hasEducationOrOccupation && (
              <div>
                <div className="flex items-center gap-2 mb-2 pb-1 border-b border-[#e5d5b5]">
                  <span className="text-[#8c6b2d] text-xs">◆</span>
                  <h2
                    className="text-xs sm:text-sm font-bold tracking-wider text-[#1c1917] uppercase"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Education & Career
                  </h2>
                </div>

                <div className="space-y-2 text-xs">
                  {hasEducation && (
                    <div className="space-y-1">
                      {education
                        .filter((e) => e.degree.trim() || e.institution.trim())
                        .map((edu, idx) => (
                          <div key={idx} className="flex items-baseline gap-1.5">
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
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-1 border-t border-[#f0e6d2]">
                      {occupation.designation && (
                        <div className="flex items-baseline">
                          <span className="w-24 text-[#777] flex-shrink-0">Role:</span>
                          <span className="font-semibold text-[#1c1917]">{occupation.designation}</span>
                        </div>
                      )}
                      {occupation.company && (
                        <div className="flex items-baseline">
                          <span className="w-24 text-[#777] flex-shrink-0">Company:</span>
                          <span className="font-semibold text-[#1c1917]">{occupation.company}</span>
                        </div>
                      )}
                      {occupation.income && (
                        <div className="flex items-baseline col-span-2">
                          <span className="w-24 text-[#777] flex-shrink-0">Income:</span>
                          <span className="font-bold text-[#8c6b2d]">{occupation.income}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Section: Family Background */}
            {hasFamily && (
              <div>
                <div className="flex items-center gap-2 mb-2 pb-1 border-b border-[#e5d5b5]">
                  <span className="text-[#8c6b2d] text-xs">◆</span>
                  <h2
                    className="text-xs sm:text-sm font-bold tracking-wider text-[#1c1917] uppercase"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Family Details
                  </h2>
                </div>

                <div className="space-y-1.5 text-xs">
                  {family.fatherName && (
                    <div className="flex items-baseline">
                      <span className="w-24 text-[#777] flex-shrink-0">Father:</span>
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
                      <span className="w-24 text-[#777] flex-shrink-0">Mother:</span>
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
                      <div className="space-y-1 pl-3 border-l border-[#d4af37]">
                        {family.siblings
                          .filter((s) => s.name.trim() || s.relation.trim() || s.occupation.trim())
                          .map((sibling, idx) => (
                            <div key={idx} className="flex flex-wrap items-baseline gap-1.5">
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

                  {family.nativePlace && (
                    <div className="flex items-baseline pt-0.5">
                      <span className="w-24 text-[#777] flex-shrink-0">Native Place:</span>
                      <span className="font-semibold text-[#1c1917]">{family.nativePlace}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Section: Partner Preferences */}
            {hasPreferences && (
              <div>
                <div className="flex items-center gap-2 mb-2 pb-1 border-b border-[#e5d5b5]">
                  <span className="text-[#8c6b2d] text-xs">◆</span>
                  <h2
                    className="text-xs sm:text-sm font-bold tracking-wider text-[#1c1917] uppercase"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Partner Expectations
                  </h2>
                </div>
                <p className="text-xs text-[#333] leading-relaxed italic bg-[#fcf8f0] p-2.5 rounded-sm border border-[#e8dcc4]">
                  &ldquo;{partnerPreferences}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Blessing */}
        <div className="text-center mt-5 pt-3 border-t border-[#e5d5b5]/60">
          <div
            className="text-[#966b1e] text-xs tracking-widest"
            style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
          >
            ॥ सदा सर्वदा मंगलम् ॥
          </div>
        </div>
      </div>
    </div>
  );
}

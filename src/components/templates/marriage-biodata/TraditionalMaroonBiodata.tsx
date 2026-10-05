import React from 'react';
import type { BiodataDocument } from '../../../lib/schema';

interface TraditionalMaroonBiodataProps {
  data: BiodataDocument;
}

export default function TraditionalMaroonBiodata({ data }: TraditionalMaroonBiodataProps) {
  const { personalInfo, sections } = data;
  const { education, occupation, family, horoscope, contact, partnerPreferences } = sections || {};

  // Check if sections have content to respect strict empty section omission
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
      className="traditional-maroon-biodata w-full min-h-full bg-[#fdfbf7] text-[#2c1810] relative box-border font-serif p-6 sm:p-8"
      style={{
        fontFamily: "'Playfair Display', Georgia, serif",
      }}
    >
      {/* Outer Ornate Double Border with Corner Accents */}
      <div className="border-2 border-[#800020] p-1.5 rounded-sm relative">
        <div className="border border-[#c59b27] p-5 sm:p-7 relative bg-[#fffefa]/90">
          
          {/* Ornamental SVG Corner Filigrees */}
          {/* Top-Left Corner */}
          <div className="absolute top-1 left-1 w-8 h-8 text-[#c59b27] pointer-events-none select-none">
            <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full opacity-80">
              <path d="M0,0 L40,0 C30,10 20,20 15,35 C10,50 10,70 0,100 L0,0 Z M12,12 L35,12 C28,18 20,26 16,36 C13,44 12,58 6,80 L6,6 L12,12 Z" />
              <circle cx="20" cy="20" r="4" fill="#800020" />
            </svg>
          </div>
          {/* Top-Right Corner */}
          <div className="absolute top-1 right-1 w-8 h-8 text-[#c59b27] pointer-events-none select-none rotate-90">
            <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full opacity-80">
              <path d="M0,0 L40,0 C30,10 20,20 15,35 C10,50 10,70 0,100 L0,0 Z M12,12 L35,12 C28,18 20,26 16,36 C13,44 12,58 6,80 L6,6 L12,12 Z" />
              <circle cx="20" cy="20" r="4" fill="#800020" />
            </svg>
          </div>
          {/* Bottom-Left Corner */}
          <div className="absolute bottom-1 left-1 w-8 h-8 text-[#c59b27] pointer-events-none select-none -rotate-90">
            <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full opacity-80">
              <path d="M0,0 L40,0 C30,10 20,20 15,35 C10,50 10,70 0,100 L0,0 Z M12,12 L35,12 C28,18 20,26 16,36 C13,44 12,58 6,80 L6,6 L12,12 Z" />
              <circle cx="20" cy="20" r="4" fill="#800020" />
            </svg>
          </div>
          {/* Bottom-Right Corner */}
          <div className="absolute bottom-1 right-1 w-8 h-8 text-[#c59b27] pointer-events-none select-none rotate-180">
            <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full opacity-80">
              <path d="M0,0 L40,0 C30,10 20,20 15,35 C10,50 10,70 0,100 L0,0 Z M12,12 L35,12 C28,18 20,26 16,36 C13,44 12,58 6,80 L6,6 L12,12 Z" />
              <circle cx="20" cy="20" r="4" fill="#800020" />
            </svg>
          </div>

          {/* Auspicious Sacred Invocation */}
          <div className="text-center mb-3">
            <div
              className="text-[#800020] font-semibold text-base sm:text-lg tracking-wider"
              style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
            >
              ॥ श्री गणेशाय नमः ॥
            </div>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#c59b27]" />
              <span className="text-[#c59b27] text-xs">❖</span>
              <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#c59b27]" />
            </div>
          </div>

          {/* Candidate Header & Centered Photo Banner */}
          <div className="text-center mb-5">
            {personalInfo.photoUrl && (
              <div className="flex justify-center mb-3">
                <div className="p-1 rounded-sm border-2 border-[#c59b27] bg-[#fff] shadow-sm">
                  <img
                    src={personalInfo.photoUrl}
                    alt={personalInfo.fullName || 'Candidate'}
                    className="w-24 h-30 sm:w-28 sm:h-34 object-cover rounded-xs"
                  />
                </div>
              </div>
            )}

            <h1
              className="text-2xl sm:text-3xl font-bold text-[#800020] tracking-wide uppercase"
              style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}
            >
              {personalInfo.fullName || 'Candidate Name'}
            </h1>
            <div className="text-xs uppercase tracking-[0.2em] text-[#b8860b] font-medium mt-0.5">
              Marriage Biodata
            </div>
          </div>

          {/* Section 1: Personal Details */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2 pb-1 border-b border-[#c59b27]/60">
              <span className="text-[#800020] text-sm">❖</span>
              <h2
                className="text-xs sm:text-sm font-bold tracking-wider text-[#800020] uppercase"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Personal & Physical Details
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
              {personalInfo.dateOfBirth && (
                <div className="flex items-baseline">
                  <span className="w-28 text-[#7a5830] font-medium flex-shrink-0">Date of Birth:</span>
                  <span className="text-[#1a1a1a] font-semibold">{personalInfo.dateOfBirth}</span>
                </div>
              )}
              {personalInfo.timeOfBirth && (
                <div className="flex items-baseline">
                  <span className="w-28 text-[#7a5830] font-medium flex-shrink-0">Time of Birth:</span>
                  <span className="text-[#1a1a1a] font-semibold">{personalInfo.timeOfBirth}</span>
                </div>
              )}
              {personalInfo.placeOfBirth && (
                <div className="flex items-baseline">
                  <span className="w-28 text-[#7a5830] font-medium flex-shrink-0">Place of Birth:</span>
                  <span className="text-[#1a1a1a] font-semibold">{personalInfo.placeOfBirth}</span>
                </div>
              )}
              {personalInfo.height && (
                <div className="flex items-baseline">
                  <span className="w-28 text-[#7a5830] font-medium flex-shrink-0">Height:</span>
                  <span className="text-[#1a1a1a] font-semibold">{personalInfo.height}</span>
                </div>
              )}
              {personalInfo.complexion && (
                <div className="flex items-baseline">
                  <span className="w-28 text-[#7a5830] font-medium flex-shrink-0">Complexion:</span>
                  <span className="text-[#1a1a1a] font-semibold">{personalInfo.complexion}</span>
                </div>
              )}
              {personalInfo.diet && (
                <div className="flex items-baseline">
                  <span className="w-28 text-[#7a5830] font-medium flex-shrink-0">Diet:</span>
                  <span className="text-[#1a1a1a] font-semibold">{personalInfo.diet}</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Horoscope / Kundali (Omitted if empty) */}
          {hasHoroscope && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2 pb-1 border-b border-[#c59b27]/60">
                <span className="text-[#800020] text-sm">❖</span>
                <h2
                  className="text-xs sm:text-sm font-bold tracking-wider text-[#800020] uppercase"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Horoscope / Astro Details
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs bg-[#fbf7ee] p-2.5 rounded-sm border border-[#e8d8b5]">
                {horoscope.gothra && (
                  <div className="flex items-baseline">
                    <span className="w-28 text-[#7a5830] font-medium flex-shrink-0">Gothra:</span>
                    <span className="text-[#1a1a1a] font-semibold">{horoscope.gothra}</span>
                  </div>
                )}
                {horoscope.rashi && (
                  <div className="flex items-baseline">
                    <span className="w-28 text-[#7a5830] font-medium flex-shrink-0">Rashi (Sign):</span>
                    <span className="text-[#1a1a1a] font-semibold">{horoscope.rashi}</span>
                  </div>
                )}
                {horoscope.nakshatra && (
                  <div className="flex items-baseline">
                    <span className="w-28 text-[#7a5830] font-medium flex-shrink-0">Nakshatra:</span>
                    <span className="text-[#1a1a1a] font-semibold">{horoscope.nakshatra}</span>
                  </div>
                )}
                {horoscope.manglik && (
                  <div className="flex items-baseline">
                    <span className="w-28 text-[#7a5830] font-medium flex-shrink-0">Manglik Status:</span>
                    <span className="text-[#800020] font-semibold">{horoscope.manglik}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 3: Education & Career */}
          {hasEducationOrOccupation && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2 pb-1 border-b border-[#c59b27]/60">
                <span className="text-[#800020] text-sm">❖</span>
                <h2
                  className="text-xs sm:text-sm font-bold tracking-wider text-[#800020] uppercase"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Education & Profession
                </h2>
              </div>

              <div className="space-y-2 text-xs">
                {hasEducation && (
                  <div>
                    <span className="text-[#7a5830] font-medium block mb-1">Qualifications:</span>
                    <div className="space-y-1 pl-3 border-l-2 border-[#c59b27]">
                      {education
                        .filter((e) => e.degree.trim() || e.institution.trim())
                        .map((edu, idx) => (
                          <div key={idx} className="flex flex-wrap items-baseline gap-1.5">
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
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 pt-1">
                    {occupation.designation && (
                      <div className="flex items-baseline">
                        <span className="w-28 text-[#7a5830] font-medium flex-shrink-0">Designation:</span>
                        <span className="text-[#1a1a1a] font-semibold">{occupation.designation}</span>
                      </div>
                    )}
                    {occupation.company && (
                      <div className="flex items-baseline">
                        <span className="w-28 text-[#7a5830] font-medium flex-shrink-0">Organization:</span>
                        <span className="text-[#1a1a1a] font-semibold">{occupation.company}</span>
                      </div>
                    )}
                    {occupation.income && (
                      <div className="flex items-baseline col-span-2">
                        <span className="w-28 text-[#7a5830] font-medium flex-shrink-0">Annual Package:</span>
                        <span className="text-[#800020] font-semibold">{occupation.income}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 4: Family Details */}
          {hasFamily && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2 pb-1 border-b border-[#c59b27]/60">
                <span className="text-[#800020] text-sm">❖</span>
                <h2
                  className="text-xs sm:text-sm font-bold tracking-wider text-[#800020] uppercase"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Family Background
                </h2>
              </div>

              <div className="space-y-1.5 text-xs">
                {family.fatherName && (
                  <div className="flex items-baseline">
                    <span className="w-28 text-[#7a5830] font-medium flex-shrink-0">Father&apos;s Name:</span>
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
                    <span className="w-28 text-[#7a5830] font-medium flex-shrink-0">Mother&apos;s Name:</span>
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
                    <span className="text-[#7a5830] font-medium block mb-0.5">Siblings:</span>
                    <div className="space-y-1 pl-3 border-l-2 border-[#c59b27]">
                      {family.siblings
                        .filter((s) => s.name.trim() || s.relation.trim() || s.occupation.trim())
                        .map((sibling, idx) => (
                          <div key={idx} className="flex flex-wrap items-baseline gap-1.5">
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

                {family.nativePlace && (
                  <div className="flex items-baseline pt-0.5">
                    <span className="w-28 text-[#7a5830] font-medium flex-shrink-0">Native Place:</span>
                    <span className="text-[#1a1a1a] font-semibold">{family.nativePlace}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 5: Partner Preferences */}
          {hasPreferences && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2 pb-1 border-b border-[#c59b27]/60">
                <span className="text-[#800020] text-sm">❖</span>
                <h2
                  className="text-xs sm:text-sm font-bold tracking-wider text-[#800020] uppercase"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Partner Expectations
                </h2>
              </div>
              <p className="text-xs text-[#333] leading-relaxed italic bg-[#fbf7ee] p-2.5 rounded-sm border border-[#e8d8b5]">
                &ldquo;{partnerPreferences}&rdquo;
              </p>
            </div>
          )}

          {/* Section 6: Contact & Address */}
          {hasContact && (
            <div>
              <div className="flex items-center gap-2 mb-2 pb-1 border-b border-[#c59b27]/60">
                <span className="text-[#800020] text-sm">❖</span>
                <h2
                  className="text-xs sm:text-sm font-bold tracking-wider text-[#800020] uppercase"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Contact & Correspondence
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                {contact?.address && (
                  <div className="sm:col-span-2 flex items-baseline">
                    <span className="w-28 text-[#7a5830] font-medium flex-shrink-0">Address:</span>
                    <span className="text-[#1a1a1a] font-semibold">{contact.address}</span>
                  </div>
                )}
                {contact?.referencePhone && (
                  <div className="flex items-baseline">
                    <span className="w-28 text-[#7a5830] font-medium flex-shrink-0">Contact Phone:</span>
                    <span className="text-[#800020] font-bold">{contact.referencePhone}</span>
                  </div>
                )}
                {personalInfo.phone && !contact?.referencePhone?.includes(personalInfo.phone) && (
                  <div className="flex items-baseline">
                    <span className="w-28 text-[#7a5830] font-medium flex-shrink-0">Candidate Phone:</span>
                    <span className="text-[#1a1a1a] font-semibold">{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.email && (
                  <div className="flex items-baseline">
                    <span className="w-28 text-[#7a5830] font-medium flex-shrink-0">Email:</span>
                    <span className="text-[#1a1a1a] font-semibold">{personalInfo.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Auspicious Closing Shanti Blessing */}
          <div className="text-center mt-5 pt-3 border-t border-[#c59b27]/40">
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
  );
}

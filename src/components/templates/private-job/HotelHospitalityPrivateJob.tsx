import React from 'react';
import type { ResumeDocument } from '../../../lib/schema';

interface HotelHospitalityPrivateJobProps {
  data: ResumeDocument;
  pageNumber?: number;
  totalPages?: number;
  spacingDensity?: 'compact' | 'balanced' | 'spacious';
  fontSizeScale?: number;
}

export default function HotelHospitalityPrivateJob({
  data,
  pageNumber = 1,
  totalPages = 1,
  spacingDensity = 'balanced',
  fontSizeScale = 100,
}: HotelHospitalityPrivateJobProps) {
  const { personalInfo, summary, sections } = data;
  const { education, experience, skills, references, declaration } = sections || {};

  const hasSummary = Boolean(summary && summary.trim().length > 0);
  const hasExperience = Boolean(
    experience && experience.some((e) => e.company.trim() || e.role.trim())
  );
  const hasEducation = Boolean(
    education && education.some((e) => e.degree.trim() || e.institution.trim())
  );
  const hasSkills = Boolean(skills && skills.some((s) => s.trim().length > 0));
  const hasReferences = Boolean(references && references.some((r) => r.name.trim().length > 0));

  const hasPersonalDetails = Boolean(
    personalInfo.fatherName?.trim() ||
    personalInfo.dateOfBirth?.trim() ||
    personalInfo.gender?.trim() ||
    personalInfo.maritalStatus?.trim() ||
    personalInfo.nationality?.trim() ||
    personalInfo.languagesKnown?.trim() ||
    personalInfo.permanentAddress?.trim()
  );

  // Declaration is strictly rendered on final page
  const isLastPage = pageNumber === totalPages;
  const showDeclaration = Boolean(declaration?.enabled && isLastPage);

  // Dynamic Spacing Config (Single-Page Optimized)
  const spacingConfig = {
    compact: {
      sectionMb: 'mb-1.5',
      headingMb: 'mb-0.5',
      itemSpace: 'space-y-1',
    },
    balanced: {
      sectionMb: 'mb-2.5',
      headingMb: 'mb-1',
      itemSpace: 'space-y-1.5',
    },
    spacious: {
      sectionMb: 'mb-3.5',
      headingMb: 'mb-1.5',
      itemSpace: 'space-y-2',
    },
  };
  const sp = spacingConfig[spacingDensity] || spacingConfig.balanced;
  const scale = fontSizeScale ? fontSizeScale / 100 : 1;

  return (
    <article
      className="hotel-hospitality-private-job w-full min-h-0 p-0 bg-white text-neutral-900 font-sans flex box-border overflow-hidden"
      style={{
        fontSize: `${12 * scale}px`,
        lineHeight: 1.45,
      }}
    >
      {/* Left Sidebar: Replaced aside with div to guarantee 100% PDF/Print reproduction */}
      <div
        data-section-sidebar="true"
        className="w-[34%] text-slate-100 p-4 flex flex-col justify-between space-y-3.5 shadow-sm print:shadow-none flex-shrink-0"
        style={{
          backgroundColor: '#0f2842',
          backgroundImage: 'linear-gradient(180deg, #0e2338 0%, #132e4d 50%, #0f2842 100%)',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
        }}
      >
        <div className="space-y-3.5">
          {/* Circular Candidate Photo (Page 1 only) */}
          {pageNumber === 1 && personalInfo.photoUrl && (
            <div className="flex justify-center pt-0.5">
              <div className="w-22 h-22 sm:w-26 sm:h-26 rounded-full ring-4 ring-white/20 border-2 border-white/60 overflow-hidden shadow-md bg-[#16385c] flex items-center justify-center p-0.5">
                <img
                  src={personalInfo.photoUrl}
                  alt={personalInfo.fullName || 'Candidate'}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          )}

          {/* Contact Details */}
          <div>
            <h3 className="text-[10.5px] font-bold uppercase tracking-wider text-amber-300 border-b border-white/15 pb-0.5 mb-1.5">
              Contact Information
            </h3>
            <div className="space-y-1 text-[10.5px] text-slate-200">
              {personalInfo.phone && (
                <div>
                  <span className="text-slate-400 block text-[8.5px] uppercase font-bold tracking-wider">Mobile</span>
                  <span className="font-medium text-white">{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.email && (
                <div>
                  <span className="text-slate-400 block text-[8.5px] uppercase font-bold tracking-wider">Email</span>
                  <span className="break-all font-medium text-white">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.location && (
                <div>
                  <span className="text-slate-400 block text-[8.5px] uppercase font-bold tracking-wider">Current Location</span>
                  <span className="font-medium text-white">{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.links &&
                personalInfo.links
                  .filter((l) => l.url)
                  .map((link, idx) => (
                    <div key={idx}>
                      <span className="text-slate-400 block text-[8.5px] uppercase font-bold tracking-wider">
                        {link.label || 'Web Link'}
                      </span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-200 hover:text-white break-all text-[10px] transition-colors"
                      >
                        {link.url.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  ))}
            </div>
          </div>

          {/* Personal Particulars */}
          {hasPersonalDetails && (
            <div>
              <h3 className="text-[10.5px] font-bold uppercase tracking-wider text-amber-300 border-b border-white/15 pb-0.5 mb-1.5">
                Personal Particulars
              </h3>
              <div className="space-y-1 text-[10.5px] text-slate-200">
                {personalInfo.fatherName && (
                  <div>
                    <span className="text-slate-400 block text-[8.5px] uppercase font-bold tracking-wider">Father&apos;s Name</span>
                    <span className="text-white font-medium">{personalInfo.fatherName}</span>
                  </div>
                )}
                {personalInfo.dateOfBirth && (
                  <div>
                    <span className="text-slate-400 block text-[8.5px] uppercase font-bold tracking-wider">Date of Birth</span>
                    <span className="text-white font-medium">{personalInfo.dateOfBirth}</span>
                  </div>
                )}
                {personalInfo.gender && (
                  <div>
                    <span className="text-slate-400 block text-[8.5px] uppercase font-bold tracking-wider">Gender</span>
                    <span className="text-white font-medium">{personalInfo.gender}</span>
                  </div>
                )}
                {personalInfo.maritalStatus && (
                  <div>
                    <span className="text-slate-400 block text-[8.5px] uppercase font-bold tracking-wider">Marital Status</span>
                    <span className="text-white font-medium">{personalInfo.maritalStatus}</span>
                  </div>
                )}
                {personalInfo.nationality && (
                  <div>
                    <span className="text-slate-400 block text-[8.5px] uppercase font-bold tracking-wider">Nationality</span>
                    <span className="text-white font-medium">{personalInfo.nationality}</span>
                  </div>
                )}
                {personalInfo.languagesKnown && (
                  <div>
                    <span className="text-slate-400 block text-[8.5px] uppercase font-bold tracking-wider">Languages Known</span>
                    <span className="text-white font-medium">{personalInfo.languagesKnown}</span>
                  </div>
                )}
                {personalInfo.permanentAddress && (
                  <div>
                    <span className="text-slate-400 block text-[8.5px] uppercase font-bold tracking-wider">Permanent Address</span>
                    <span className="leading-snug block text-slate-200 text-[10px]">{personalInfo.permanentAddress}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Key Skills */}
          {hasSkills && (
            <div>
              <h3 className="text-[10.5px] font-bold uppercase tracking-wider text-amber-300 border-b border-white/15 pb-0.5 mb-1.5">
                Core Hospitality Skills
              </h3>
              <div className="space-y-0.5 text-[10.5px] text-slate-200">
                {skills
                  .filter((s) => s.trim())
                  .map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="text-amber-400 text-xs">▸</span>
                      <span className="font-medium text-white">{skill}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Name, Objective, Experience, Education, References, Declaration */}
      <div className="w-[66%] p-4 sm:p-5 flex flex-col justify-between space-y-3 box-border">
        <div className="space-y-3">
          {/* Header Title (Page 1 only) */}
          {pageNumber === 1 && (
            <header className="border-b-2 border-neutral-900 pb-2">
              <h1 className="text-2xl font-black text-neutral-950 uppercase tracking-tight">
                {personalInfo.fullName || 'Candidate Name'}
              </h1>
              {personalInfo.title && (
                <p className="text-xs font-bold text-neutral-700 uppercase tracking-wider mt-0.5">
                  {personalInfo.title}
                </p>
              )}
            </header>
          )}

          {/* Objective */}
          {hasSummary && (
            <section data-section-type="summary" className={sp.sectionMb}>
              <h2 className={`text-xs font-extrabold uppercase tracking-wider text-neutral-900 border-b-2 border-neutral-800 pb-0.5 ${sp.headingMb}`}>
                Professional Objective
              </h2>
              <p className="text-xs text-neutral-700 leading-relaxed text-justify">
                {summary}
              </p>
            </section>
          )}

          {/* Work Experience */}
          {hasExperience && (
            <section data-section-type="experience" className={sp.sectionMb}>
              <h2 className={`text-xs font-extrabold uppercase tracking-wider text-neutral-900 border-b-2 border-neutral-800 pb-0.5 ${sp.headingMb}`}>
                Work Experience
              </h2>
              <div className={sp.itemSpace}>
                {experience
                  .filter((exp) => exp.company.trim() || exp.role.trim())
                  .map((exp, idx) => (
                    <div key={idx} data-entry-item="true" className="space-y-0.5">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-xs text-neutral-950">{exp.role}</span>
                        {(exp.startDate || exp.endDate) && (
                          <span className="text-[10px] text-neutral-500 font-medium">
                            {exp.startDate} {exp.startDate && exp.endDate ? '–' : ''} {exp.endDate}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-neutral-600">{exp.company}</div>
                      {exp.bullets && exp.bullets.filter((b) => b.trim()).length > 0 && (
                        <ul className="list-disc pl-4 space-y-0.5 text-xs text-neutral-700">
                          {exp.bullets
                            .filter((b) => b.trim())
                            .map((bullet, bIdx) => (
                              <li key={bIdx}>{bullet}</li>
                            ))}
                        </ul>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Educational Qualifications */}
          {hasEducation && (
            <section data-section-type="education" className={sp.sectionMb}>
              <h2 className={`text-xs font-extrabold uppercase tracking-wider text-neutral-900 border-b-2 border-neutral-800 pb-0.5 ${sp.headingMb}`}>
                Education & Training
              </h2>
              <div className="space-y-1.5">
                {education
                  .filter((edu) => edu.degree.trim() || edu.institution.trim())
                  .map((edu, idx) => (
                    <div
                      key={idx}
                      data-entry-item="true"
                      className="border-b border-neutral-100 pb-1 last:border-none last:pb-0 text-xs"
                    >
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-neutral-900">
                          {edu.degree}
                          {edu.fieldOfStudy && (
                            <span className="font-normal text-neutral-600 ml-1">
                              in {edu.fieldOfStudy}
                            </span>
                          )}
                        </span>
                        <span className="text-neutral-500 text-[10px] font-medium flex-shrink-0 ml-2">
                          {edu.startDate && edu.endDate
                            ? `${edu.startDate} – ${edu.endDate}`
                            : edu.endDate || edu.startDate || ''}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline mt-0.5">
                        <span className="text-neutral-600 text-[10.5px]">{edu.institution}</span>
                        {edu.grade && (
                          <span className="text-neutral-800 font-medium text-[10px]">
                            {edu.grade}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* References */}
          {hasReferences && (
            <section data-section-type="references" className={sp.sectionMb}>
              <h2 className={`text-xs font-extrabold uppercase tracking-wider text-neutral-900 border-b-2 border-neutral-800 pb-0.5 ${sp.headingMb}`}>
                Professional References
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {references
                  .filter((r) => r.name.trim())
                  .map((ref, idx) => (
                    <div key={idx} data-entry-item="true" className="p-1.5 rounded border border-neutral-200 bg-neutral-50">
                      <div className="font-bold text-neutral-900">{ref.name}</div>
                      <div className="text-[10.5px] text-neutral-600">
                        {ref.role} {ref.company ? `(${ref.company})` : ''}
                      </div>
                      {ref.phone && <div className="text-[10px] text-neutral-700">Mob: {ref.phone}</div>}
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>

        {/* Declaration & Signature Block (Rendered strictly on final page) */}
        {showDeclaration && (
          <section data-section-type="declaration" className="pt-2 border-t border-neutral-300 mt-2 text-[10.5px]">
            <p className="text-neutral-600 italic leading-relaxed mb-2 text-[11px]">
              &ldquo;{declaration?.text || 'I hereby declare that all the information provided above is true and correct to the best of my knowledge and belief.'}&rdquo;
            </p>
            <div className="flex justify-between items-end">
              <div className="space-y-0.5 text-neutral-700">
                <div><strong>Place:</strong> {declaration?.place || '_________'}</div>
                <div><strong>Date:</strong> {declaration?.date || '_________'}</div>
              </div>

              <div className="text-center">
                {declaration?.signatureName?.trim() ? (
                  <div
                    className="h-8 flex items-center justify-center text-[#1e3a8a] select-none"
                    style={{
                      fontFamily: "'Brush Script MT', 'Dancing Script', 'Caveat', 'Segoe Script', cursive",
                      fontSize: '20px',
                      fontWeight: 600,
                      transform: 'rotate(-2deg)',
                    }}
                  >
                    {declaration.signatureName}
                  </div>
                ) : (
                  <div className="h-7" />
                )}
                <div className="w-32 border-b border-neutral-800 mb-0.5 mx-auto" />
                <span className="text-[9.5px] text-neutral-500 font-medium">
                  (Signature)
                </span>
              </div>
            </div>
          </section>
        )}
      </div>
    </article>
  );
}

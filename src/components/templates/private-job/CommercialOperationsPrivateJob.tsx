import React from 'react';
import type { ResumeDocument } from '../../../lib/schema';

interface CommercialOperationsPrivateJobProps {
  data: ResumeDocument;
  pageNumber?: number;
  totalPages?: number;
  spacingDensity?: 'compact' | 'balanced' | 'spacious';
  fontSizeScale?: number;
}

export default function CommercialOperationsPrivateJob({
  data,
  pageNumber = 1,
  totalPages = 1,
  spacingDensity = 'balanced',
  fontSizeScale = 100,
}: CommercialOperationsPrivateJobProps) {
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
      className="commercial-operations-private-job w-full min-h-0 bg-white text-neutral-900 font-sans p-0 box-border"
      style={{
        fontSize: `${12.5 * scale}px`,
        lineHeight: 1.45,
      }}
    >
      {/* Top Banner Header with Circular Photo */}
      {pageNumber === 1 && (
        <header className="flex items-center justify-between border-b-2 border-neutral-900 pb-2 mb-2.5 gap-3">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 uppercase tracking-tight">
              {personalInfo.fullName || 'Candidate Name'}
            </h1>
            {personalInfo.title && (
              <p className="text-xs font-bold text-neutral-700 uppercase tracking-wider mt-0.5">
                {personalInfo.title}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-neutral-600">
              {personalInfo.phone && <span><strong>Phone:</strong> {personalInfo.phone}</span>}
              {personalInfo.email && <span><strong>Email:</strong> {personalInfo.email}</span>}
              {personalInfo.location && <span><strong>Location:</strong> {personalInfo.location}</span>}
              {personalInfo.links &&
                personalInfo.links
                  .filter((l) => l.url)
                  .map((link, idx) => (
                    <span key={idx}>
                      <strong>{link.label || 'Link'}:</strong> {link.url.replace(/^https?:\/\//, '')}
                    </span>
                  ))}
            </div>
          </div>

          {/* Circular Photo */}
          {personalInfo.photoUrl && (
            <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-full border-2 border-neutral-800 p-0.5 overflow-hidden flex-shrink-0 shadow-sm bg-neutral-100 flex items-center justify-center">
              <img
                src={personalInfo.photoUrl}
                alt={personalInfo.fullName || 'Candidate'}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          )}
        </header>
      )}

      {/* Profile Objective */}
      {hasSummary && (
        <section data-section-type="summary" className={sp.sectionMb}>
          <h2 className={`text-xs font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-400 pb-0.5 ${sp.headingMb}`}>
            Career Objective
          </h2>
          <p className="text-xs text-neutral-800 leading-relaxed text-justify">
            {summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {hasExperience && (
        <section data-section-type="experience" className={sp.sectionMb}>
          <h2 className={`text-xs font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-400 pb-0.5 ${sp.headingMb}`}>
            Employment History
          </h2>
          <div className={sp.itemSpace}>
            {experience
              .filter((exp) => exp.company.trim() || exp.role.trim())
              .map((exp, idx) => (
                <div key={idx} data-entry-item="true" className="space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-xs text-neutral-900">{exp.role}</span>
                    {(exp.startDate || exp.endDate) && (
                      <span className="text-[11px] text-neutral-500 font-medium">
                        {exp.startDate} {exp.startDate && exp.endDate ? '–' : ''} {exp.endDate}
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-neutral-700">{exp.company}</div>
                  {exp.bullets && exp.bullets.filter((b) => b.trim()).length > 0 && (
                    <ul className="list-disc pl-4 mt-0.5 space-y-0.5 text-xs text-neutral-700">
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

      {/* Education */}
      {hasEducation && (
        <section data-section-type="education" className={sp.sectionMb}>
          <h2 className={`text-xs font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-400 pb-0.5 ${sp.headingMb}`}>
            Academic Background
          </h2>
          <div className="grid grid-cols-1 gap-1.5 text-xs">
            {education
              .filter((edu) => edu.degree.trim() || edu.institution.trim())
              .map((edu, idx) => (
                <div
                  key={idx}
                  data-entry-item="true"
                  className="flex justify-between items-baseline border-b border-neutral-100 pb-1"
                >
                  <div>
                    <span className="font-bold text-neutral-900">
                      {edu.degree}
                      {edu.fieldOfStudy && (
                        <span className="font-normal text-neutral-600 ml-1">
                          — {edu.fieldOfStudy}
                        </span>
                      )}
                    </span>
                    {edu.institution && (
                      <span className="text-neutral-600 block text-[11px]">{edu.institution}</span>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <span className="text-neutral-700 font-medium text-[11px] block">
                      {edu.startDate && edu.endDate
                        ? `${edu.startDate} – ${edu.endDate}`
                        : edu.endDate || edu.startDate || ''}
                    </span>
                    {edu.grade && (
                      <span className="text-[10px] text-neutral-500 font-medium">{edu.grade}</span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {hasSkills && (
        <section data-section-type="skills" className={sp.sectionMb}>
          <h2 className={`text-xs font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-400 pb-0.5 ${sp.headingMb}`}>
            Skills & Abilities
          </h2>
          <div className="flex flex-wrap gap-1.5 text-xs">
            {skills
              .filter((s) => s.trim())
              .map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-xs border border-neutral-300 bg-neutral-50 text-neutral-800 font-medium"
                >
                  {skill}
                </span>
              ))}
          </div>
        </section>
      )}

      {/* Personal Particulars */}
      {hasPersonalDetails && (
        <section data-section-type="personalDetails" className={sp.sectionMb}>
          <h2 className={`text-xs font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-400 pb-0.5 ${sp.headingMb}`}>
            Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
            {personalInfo.fatherName && (
              <div><span className="text-neutral-500 font-medium">Father&apos;s Name:</span> <strong className="text-neutral-900">{personalInfo.fatherName}</strong></div>
            )}
            {personalInfo.dateOfBirth && (
              <div><span className="text-neutral-500 font-medium">Date of Birth:</span> <strong className="text-neutral-900">{personalInfo.dateOfBirth}</strong></div>
            )}
            {personalInfo.gender && (
              <div><span className="text-neutral-500 font-medium">Gender:</span> <strong className="text-neutral-900">{personalInfo.gender}</strong></div>
            )}
            {personalInfo.maritalStatus && (
              <div><span className="text-neutral-500 font-medium">Marital Status:</span> <strong className="text-neutral-900">{personalInfo.maritalStatus}</strong></div>
            )}
            {personalInfo.nationality && (
              <div><span className="text-neutral-500 font-medium">Nationality:</span> <strong className="text-neutral-900">{personalInfo.nationality}</strong></div>
            )}
            {personalInfo.languagesKnown && (
              <div className="sm:col-span-2"><span className="text-neutral-500 font-medium">Languages Known:</span> <strong className="text-neutral-900">{personalInfo.languagesKnown}</strong></div>
            )}
            {personalInfo.permanentAddress && (
              <div className="sm:col-span-2"><span className="text-neutral-500 font-medium">Permanent Address:</span> <span className="text-neutral-800 font-medium">{personalInfo.permanentAddress}</span></div>
            )}
          </div>
        </section>
      )}

      {/* References (Optional) */}
      {hasReferences && (
        <section data-section-type="references" className={sp.sectionMb}>
          <h2 className={`text-xs font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-400 pb-0.5 ${sp.headingMb}`}>
            Professional References
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {references
              .filter((r) => r.name.trim())
              .map((ref, idx) => (
                <div key={idx} data-entry-item="true" className="border border-neutral-200 p-2 rounded-xs bg-neutral-50">
                  <div className="font-bold text-neutral-900">{ref.name}</div>
                  <div className="text-[11px] text-neutral-600">{ref.role} {ref.company ? `(${ref.company})` : ''}</div>
                  {ref.phone && <div className="text-[11px] text-neutral-700">Mob: {ref.phone}</div>}
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Formal Closing Declaration & Signature Block */}
      {showDeclaration && (
        <section data-section-type="declaration" className="pt-2 border-t border-neutral-300 mt-2.5 text-xs">
          <p className="text-neutral-700 italic leading-relaxed text-justify mb-2">
            &ldquo;{declaration?.text || 'I hereby declare that all the information provided above is true and correct to the best of my knowledge and belief.'}&rdquo;
          </p>

          <div className="flex justify-between items-end">
            <div className="space-y-0.5 text-neutral-700">
              <div><strong>Place:</strong> {declaration?.place || '_______________'}</div>
              <div><strong>Date:</strong> {declaration?.date || '_______________'}</div>
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
              <div className="text-[10px] text-neutral-500 font-medium">
                (Signature)
              </div>
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

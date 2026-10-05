import React from 'react';
import type { ResumeDocument } from '../../../lib/schema';

interface IndianClassicPrivateJobProps {
  data: ResumeDocument;
}

export default function IndianClassicPrivateJob({ data }: IndianClassicPrivateJobProps) {
  const { personalInfo, summary, sections } = data;
  const { education, experience, skills, references, declaration } = sections || {};

  // Check which sections have content (Strict empty-section suppression)
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

  const showDeclaration = Boolean(declaration?.enabled);

  return (
    <div
      className="indian-classic-private-job w-full min-h-full bg-white text-neutral-900 font-sans p-6 sm:p-8 box-border"
      style={{
        fontSize: '13px',
        lineHeight: 1.5,
        color: '#1a1a1a',
      }}
    >
      {/* Header Section: Candidate Identity & Optional Passport Photo */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b-2 border-neutral-900 mb-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-neutral-950">
            {personalInfo.fullName || 'Candidate Name'}
          </h1>
          {personalInfo.title && (
            <p className="text-sm font-semibold text-neutral-700 mt-0.5">
              {personalInfo.title}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-neutral-600">
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <strong>Mob:</strong> {personalInfo.phone}
              </span>
            )}
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <strong>Email:</strong> {personalInfo.email}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1">
                <strong>Current Location:</strong> {personalInfo.location}
              </span>
            )}
          </div>
        </div>

        {/* Optional Passport-Size Photo Box */}
        {personalInfo.photoUrl && (
          <div className="flex-shrink-0">
            <div className="w-24 h-30 sm:w-28 sm:h-34 border-2 border-neutral-800 rounded-xs overflow-hidden bg-neutral-50 shadow-2xs">
              <img
                src={personalInfo.photoUrl}
                alt={personalInfo.fullName || 'Candidate'}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* Career Objective */}
      {hasSummary && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider bg-neutral-100 text-neutral-900 px-2 py-1 border-l-4 border-neutral-900 mb-2">
            Career Objective
          </h2>
          <p className="text-xs text-neutral-800 leading-relaxed text-justify px-1">
            {summary}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {hasExperience && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider bg-neutral-100 text-neutral-900 px-2 py-1 border-l-4 border-neutral-900 mb-2">
            Work Experience
          </h2>
          <div className="space-y-3 px-1">
            {experience
              .filter((exp) => exp.company.trim() || exp.role.trim())
              .map((exp, idx) => (
                <div key={idx} className="border-b border-neutral-200 pb-2 last:border-none last:pb-0">
                  <div className="flex flex-wrap justify-between items-baseline gap-1">
                    <span className="font-bold text-xs text-neutral-950">
                      {exp.role} <span className="font-normal text-neutral-600">— {exp.company}</span>
                    </span>
                    {(exp.startDate || exp.endDate) && (
                      <span className="text-[11px] font-medium text-neutral-500">
                        {exp.startDate} {exp.startDate && exp.endDate ? '–' : ''} {exp.endDate}
                      </span>
                    )}
                  </div>
                  {exp.bullets && exp.bullets.filter((b) => b.trim()).length > 0 && (
                    <ul className="list-disc list-outside pl-4 mt-1 space-y-0.5 text-xs text-neutral-700">
                      {exp.bullets
                        .filter((b) => b.trim())
                        .map((bullet, bIdx) => (
                          <li key={bIdx} className="leading-snug">
                            {bullet}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Educational Qualifications (Traditional Clean Table) */}
      {hasEducation && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider bg-neutral-100 text-neutral-900 px-2 py-1 border-l-4 border-neutral-900 mb-2">
            Educational Qualifications
          </h2>
          <div className="overflow-x-auto px-1">
            <table className="w-full text-xs text-left border-collapse border border-neutral-300">
              <thead>
                <tr className="bg-neutral-100 text-neutral-900 font-bold border-b border-neutral-300">
                  <th className="py-1.5 px-2.5 border-r border-neutral-300">Qualification</th>
                  <th className="py-1.5 px-2.5 border-r border-neutral-300">School / College / Board</th>
                  <th className="py-1.5 px-2.5 border-r border-neutral-300 text-center w-20">Year</th>
                  <th className="py-1.5 px-2.5 text-center w-28">Division / %</th>
                </tr>
              </thead>
              <tbody>
                {education
                  .filter((edu) => edu.degree.trim() || edu.institution.trim())
                  .map((edu, idx) => (
                    <tr key={idx} className="border-b border-neutral-200 last:border-none">
                      <td className="py-1.5 px-2.5 border-r border-neutral-300 font-semibold text-neutral-950">
                        {edu.degree}
                      </td>
                      <td className="py-1.5 px-2.5 border-r border-neutral-300 text-neutral-700">
                        {edu.institution}
                      </td>
                      <td className="py-1.5 px-2.5 border-r border-neutral-300 text-center text-neutral-600">
                        {edu.endDate || edu.startDate || '—'}
                      </td>
                      <td className="py-1.5 px-2.5 text-center text-neutral-800 font-medium">
                        {edu.grade || 'Passed'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Key Skills & Competencies */}
      {hasSkills && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider bg-neutral-100 text-neutral-900 px-2 py-1 border-l-4 border-neutral-900 mb-2">
            Key Skills & Practical Strengths
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs px-2">
            {skills
              .filter((s) => s.trim())
              .map((skill, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-neutral-800">
                  <span className="text-neutral-500">✔</span>
                  <span>{skill}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Personal Details / Particulars (Indian Private Sector Standard) */}
      {hasPersonalDetails && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider bg-neutral-100 text-neutral-900 px-2 py-1 border-l-4 border-neutral-900 mb-2">
            Personal Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs px-2">
            {personalInfo.fatherName && (
              <div className="flex">
                <span className="w-32 text-neutral-600 font-medium flex-shrink-0">Father&apos;s Name:</span>
                <span className="font-semibold text-neutral-900">{personalInfo.fatherName}</span>
              </div>
            )}
            {personalInfo.dateOfBirth && (
              <div className="flex">
                <span className="w-32 text-neutral-600 font-medium flex-shrink-0">Date of Birth:</span>
                <span className="font-semibold text-neutral-900">{personalInfo.dateOfBirth}</span>
              </div>
            )}
            {personalInfo.gender && (
              <div className="flex">
                <span className="w-32 text-neutral-600 font-medium flex-shrink-0">Gender:</span>
                <span className="font-semibold text-neutral-900">{personalInfo.gender}</span>
              </div>
            )}
            {personalInfo.maritalStatus && (
              <div className="flex">
                <span className="w-32 text-neutral-600 font-medium flex-shrink-0">Marital Status:</span>
                <span className="font-semibold text-neutral-900">{personalInfo.maritalStatus}</span>
              </div>
            )}
            {personalInfo.nationality && (
              <div className="flex">
                <span className="w-32 text-neutral-600 font-medium flex-shrink-0">Nationality:</span>
                <span className="font-semibold text-neutral-900">{personalInfo.nationality}</span>
              </div>
            )}
            {personalInfo.languagesKnown && (
              <div className="flex sm:col-span-2">
                <span className="w-32 text-neutral-600 font-medium flex-shrink-0">Languages Known:</span>
                <span className="font-semibold text-neutral-900">{personalInfo.languagesKnown}</span>
              </div>
            )}
            {personalInfo.permanentAddress && (
              <div className="flex sm:col-span-2">
                <span className="w-32 text-neutral-600 font-medium flex-shrink-0">Permanent Address:</span>
                <span className="font-medium text-neutral-800">{personalInfo.permanentAddress}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Professional References (if any) */}
      {hasReferences && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider bg-neutral-100 text-neutral-900 px-2 py-1 border-l-4 border-neutral-900 mb-2">
            References
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs px-2">
            {references
              .filter((r) => r.name.trim())
              .map((ref, idx) => (
                <div key={idx} className="border border-neutral-200 p-2 rounded-xs bg-neutral-50/50">
                  <div className="font-bold text-neutral-950">{ref.name}</div>
                  <div className="text-neutral-600">
                    {ref.role} {ref.company ? `— ${ref.company}` : ''}
                  </div>
                  {ref.phone && <div className="text-neutral-700">Mob: {ref.phone}</div>}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Formal Closing Declaration & Signature Block */}
      {showDeclaration && (
        <div className="pt-3 border-t border-neutral-300 mt-4 text-xs">
          <h2 className="font-bold uppercase tracking-wider text-neutral-900 mb-1">Declaration</h2>
          <p className="text-neutral-700 italic leading-relaxed text-justify mb-5">
            &ldquo;{declaration?.text || 'I hereby declare that all the information mentioned above is true and correct to the best of my knowledge and belief.'}&rdquo;
          </p>

          <div className="flex justify-between items-end pt-2 text-xs">
            <div className="space-y-1">
              <div>
                <strong>Date:</strong> {declaration?.date || '_______________'}
              </div>
              <div>
                <strong>Place:</strong> {declaration?.place || '_______________'}
              </div>
            </div>

            <div className="text-center space-y-1">
              <div className="w-36 border-b border-neutral-800 mx-auto" />
              <div className="font-bold text-neutral-950">
                ({personalInfo.fullName || 'Candidate Signature'})
              </div>
              <div className="text-[10px] text-neutral-500">Signature</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

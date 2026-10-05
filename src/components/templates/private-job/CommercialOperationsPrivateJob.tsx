import React from 'react';
import type { ResumeDocument } from '../../../lib/schema';

interface CommercialOperationsPrivateJobProps {
  data: ResumeDocument;
}

export default function CommercialOperationsPrivateJob({ data }: CommercialOperationsPrivateJobProps) {
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

  const showDeclaration = Boolean(declaration?.enabled);

  return (
    <div
      className="commercial-operations-private-job w-full min-h-full bg-white text-neutral-900 font-sans p-6 sm:p-8 box-border"
      style={{ fontSize: '12.5px', lineHeight: 1.45 }}
    >
      {/* Top Banner Header with Optional Photo */}
      <div className="flex items-center justify-between border-b-2 border-neutral-800 pb-3 mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 uppercase tracking-tight">
            {personalInfo.fullName || 'Candidate Name'}
          </h1>
          {personalInfo.title && (
            <p className="text-xs font-bold text-neutral-700 uppercase tracking-wider mt-0.5">
              {personalInfo.title}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-neutral-600">
            {personalInfo.phone && <span><strong>Phone:</strong> {personalInfo.phone}</span>}
            {personalInfo.email && <span><strong>Email:</strong> {personalInfo.email}</span>}
            {personalInfo.location && <span><strong>City:</strong> {personalInfo.location}</span>}
          </div>
        </div>

        {personalInfo.photoUrl && (
          <div className="w-22 h-28 border border-neutral-700 rounded-xs overflow-hidden flex-shrink-0 shadow-2xs">
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName || 'Candidate'}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Profile Objective */}
      {hasSummary && (
        <div className="mb-3.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-400 pb-0.5 mb-1">
            Career Objective
          </h2>
          <p className="text-xs text-neutral-800 leading-relaxed text-justify">
            {summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {hasExperience && (
        <div className="mb-3.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-400 pb-0.5 mb-1.5">
            Employment History
          </h2>
          <div className="space-y-2">
            {experience
              .filter((exp) => exp.company.trim() || exp.role.trim())
              .map((exp, idx) => (
                <div key={idx} className="border-l-2 border-neutral-800 pl-2.5">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-xs text-neutral-900">{exp.role}</span>
                    <span className="text-[11px] text-neutral-500 font-medium">
                      {exp.startDate} {exp.startDate && exp.endDate ? '–' : ''} {exp.endDate}
                    </span>
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
        </div>
      )}

      {/* Education */}
      {hasEducation && (
        <div className="mb-3.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-400 pb-0.5 mb-1.5">
            Academic Background
          </h2>
          <div className="grid grid-cols-1 gap-1.5 text-xs">
            {education
              .filter((edu) => edu.degree.trim() || edu.institution.trim())
              .map((edu, idx) => (
                <div key={idx} className="flex justify-between items-baseline border-b border-neutral-100 pb-1">
                  <div>
                    <span className="font-bold text-neutral-900">{edu.degree}</span>
                    {edu.institution && (
                      <span className="text-neutral-600 block text-[11px]">{edu.institution}</span>
                    )}
                  </div>
                  <span className="text-neutral-700 font-medium text-[11px] flex-shrink-0 ml-2">
                    {edu.endDate || edu.grade || ''}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {hasSkills && (
        <div className="mb-3.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-400 pb-0.5 mb-1.5">
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
        </div>
      )}

      {/* Personal Particulars */}
      {hasPersonalDetails && (
        <div className="mb-3.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-400 pb-0.5 mb-1.5">
            Personal Information
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            {personalInfo.fatherName && (
              <div><span className="text-neutral-500">Father&apos;s Name:</span> <strong className="text-neutral-900">{personalInfo.fatherName}</strong></div>
            )}
            {personalInfo.dateOfBirth && (
              <div><span className="text-neutral-500">Date of Birth:</span> <strong className="text-neutral-900">{personalInfo.dateOfBirth}</strong></div>
            )}
            {personalInfo.gender && (
              <div><span className="text-neutral-500">Gender:</span> <strong className="text-neutral-900">{personalInfo.gender}</strong></div>
            )}
            {personalInfo.maritalStatus && (
              <div><span className="text-neutral-500">Marital Status:</span> <strong className="text-neutral-900">{personalInfo.maritalStatus}</strong></div>
            )}
            {personalInfo.languagesKnown && (
              <div className="col-span-2"><span className="text-neutral-500">Languages Known:</span> <strong className="text-neutral-900">{personalInfo.languagesKnown}</strong></div>
            )}
            {personalInfo.permanentAddress && (
              <div className="col-span-2"><span className="text-neutral-500">Permanent Address:</span> <span className="text-neutral-800">{personalInfo.permanentAddress}</span></div>
            )}
          </div>
        </div>
      )}

      {/* References */}
      {hasReferences && (
        <div className="mb-3.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-400 pb-0.5 mb-1.5">
            References
          </h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {references
              .filter((r) => r.name.trim())
              .map((ref, idx) => (
                <div key={idx} className="p-1.5 border border-neutral-200 rounded-xs bg-neutral-50">
                  <div className="font-bold text-neutral-900">{ref.name}</div>
                  <div className="text-[11px] text-neutral-600">{ref.role} — {ref.company}</div>
                  {ref.phone && <div className="text-[11px] text-neutral-700">Mob: {ref.phone}</div>}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Declaration */}
      {showDeclaration && (
        <div className="pt-2 border-t border-neutral-300 mt-2 text-xs">
          <h2 className="font-bold uppercase tracking-wider text-neutral-950 mb-0.5">Declaration</h2>
          <p className="text-neutral-700 italic leading-relaxed text-justify mb-4 text-[11px]">
            {declaration?.text || 'I hereby declare that all the statements made above are true, complete and correct to the best of my knowledge and belief.'}
          </p>

          <div className="flex justify-between items-end text-xs">
            <div className="space-y-0.5 text-[11px]">
              <div><strong>Place:</strong> {declaration?.place || '_________'}</div>
              <div><strong>Date:</strong> {declaration?.date || '_________'}</div>
            </div>

            <div className="text-center">
              <div className="w-32 border-b border-neutral-800 mb-1" />
              <div className="font-bold text-neutral-900 text-xs">
                ({personalInfo.fullName || 'Candidate Signature'})
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

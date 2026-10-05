import React from 'react';
import type { ResumeDocument } from '../../../lib/schema';

interface HotelHospitalityPrivateJobProps {
  data: ResumeDocument;
}

export default function HotelHospitalityPrivateJob({ data }: HotelHospitalityPrivateJobProps) {
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
      className="hotel-hospitality-private-job w-full min-h-full bg-white text-neutral-900 font-sans flex box-border"
      style={{ fontSize: '12px', lineHeight: 1.45 }}
    >
      {/* Left Sidebar: Photo, Personal Particulars, Contact, Skills */}
      <div className="w-[34%] bg-neutral-900 text-white p-5 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          {/* Photo */}
          {personalInfo.photoUrl && (
            <div className="flex justify-center">
              <div className="w-24 h-30 rounded-xs border-2 border-white/80 overflow-hidden shadow-xs bg-neutral-800">
                <img
                  src={personalInfo.photoUrl}
                  alt={personalInfo.fullName || 'Candidate'}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Contact Details */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 border-b border-neutral-700 pb-1 mb-2">
              Contact
            </h3>
            <div className="space-y-1.5 text-[11px] text-neutral-300">
              {personalInfo.phone && (
                <div>
                  <span className="text-neutral-500 block text-[9px] uppercase font-bold">Mobile</span>
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.email && (
                <div>
                  <span className="text-neutral-500 block text-[9px] uppercase font-bold">Email</span>
                  <span className="break-all">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.location && (
                <div>
                  <span className="text-neutral-500 block text-[9px] uppercase font-bold">Location</span>
                  <span>{personalInfo.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Personal Particulars */}
          {hasPersonalDetails && (
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 border-b border-neutral-700 pb-1 mb-2">
                Personal Details
              </h3>
              <div className="space-y-1.5 text-[11px] text-neutral-300">
                {personalInfo.fatherName && (
                  <div>
                    <span className="text-neutral-500 block text-[9px] uppercase font-bold">Father&apos;s Name</span>
                    <span>{personalInfo.fatherName}</span>
                  </div>
                )}
                {personalInfo.dateOfBirth && (
                  <div>
                    <span className="text-neutral-500 block text-[9px] uppercase font-bold">Date of Birth</span>
                    <span>{personalInfo.dateOfBirth}</span>
                  </div>
                )}
                {personalInfo.gender && (
                  <div>
                    <span className="text-neutral-500 block text-[9px] uppercase font-bold">Gender</span>
                    <span>{personalInfo.gender}</span>
                  </div>
                )}
                {personalInfo.maritalStatus && (
                  <div>
                    <span className="text-neutral-500 block text-[9px] uppercase font-bold">Marital Status</span>
                    <span>{personalInfo.maritalStatus}</span>
                  </div>
                )}
                {personalInfo.languagesKnown && (
                  <div>
                    <span className="text-neutral-500 block text-[9px] uppercase font-bold">Languages</span>
                    <span>{personalInfo.languagesKnown}</span>
                  </div>
                )}
                {personalInfo.permanentAddress && (
                  <div>
                    <span className="text-neutral-500 block text-[9px] uppercase font-bold">Permanent Address</span>
                    <span className="leading-snug block">{personalInfo.permanentAddress}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skills */}
          {hasSkills && (
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 border-b border-neutral-700 pb-1 mb-2">
                Key Skills
              </h3>
              <div className="space-y-1 text-[11px] text-neutral-300">
                {skills
                  .filter((s) => s.trim())
                  .map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="text-teal-400 text-xs">▸</span>
                      <span>{skill}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Name, Objective, Experience, Education, Declaration */}
      <div className="w-[66%] p-5 sm:p-6 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          {/* Header Title */}
          <div className="border-b-2 border-neutral-900 pb-3">
            <h1 className="text-2xl font-black text-neutral-950 uppercase tracking-tight">
              {personalInfo.fullName || 'Candidate Name'}
            </h1>
            {personalInfo.title && (
              <p className="text-xs font-bold text-neutral-700 uppercase tracking-wide mt-0.5">
                {personalInfo.title}
              </p>
            )}
          </div>

          {/* Objective */}
          {hasSummary && (
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-1.5">
                Professional Objective
              </h2>
              <p className="text-xs text-neutral-700 leading-relaxed text-justify">
                {summary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {hasExperience && (
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-2">
                Work Experience
              </h2>
              <div className="space-y-2.5">
                {experience
                  .filter((exp) => exp.company.trim() || exp.role.trim())
                  .map((exp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-xs text-neutral-950">{exp.role}</span>
                        {(exp.startDate || exp.endDate) && (
                          <span className="text-[10px] text-neutral-500 font-medium">
                            {exp.startDate} – {exp.endDate}
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
            </div>
          )}

          {/* Educational Qualifications */}
          {hasEducation && (
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-2">
                Education & Training
              </h2>
              <div className="space-y-1.5">
                {education
                  .filter((edu) => edu.degree.trim() || edu.institution.trim())
                  .map((edu, idx) => (
                    <div key={idx} className="flex justify-between items-baseline text-xs">
                      <div>
                        <span className="font-bold text-neutral-900">{edu.degree}</span>
                        {edu.institution && (
                          <span className="text-neutral-600 block text-[11px]">{edu.institution}</span>
                        )}
                      </div>
                      <span className="text-neutral-600 text-[11px] font-medium flex-shrink-0 ml-2">
                        {edu.endDate || edu.grade || ''}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* References */}
          {hasReferences && (
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-2">
                References
              </h2>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {references
                  .filter((r) => r.name.trim())
                  .map((ref, idx) => (
                    <div key={idx} className="p-1.5 rounded border border-neutral-200 bg-neutral-50">
                      <div className="font-bold text-neutral-900">{ref.name}</div>
                      <div className="text-[11px] text-neutral-600">{ref.role} ({ref.company})</div>
                      {ref.phone && <div className="text-[11px] text-neutral-700">Mob: {ref.phone}</div>}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Declaration & Signature */}
        {showDeclaration && (
          <div className="pt-3 border-t border-neutral-300 mt-2 text-[11px]">
            <p className="text-neutral-600 italic leading-relaxed mb-4">
              &ldquo;{declaration?.text || 'I hereby declare that all the information provided above is true and correct to the best of my knowledge and belief.'}&rdquo;
            </p>
            <div className="flex justify-between items-end">
              <div className="space-y-0.5 text-neutral-700">
                <div><strong>Place:</strong> {declaration?.place || '_________'}</div>
                <div><strong>Date:</strong> {declaration?.date || '_________'}</div>
              </div>
              <div className="text-center">
                <div className="w-28 border-b border-neutral-800 mb-1" />
                <span className="font-bold text-neutral-900 text-xs">
                  {personalInfo.fullName || 'Signature'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

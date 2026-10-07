import React from 'react';
import type { ResumeDocument } from '../../../lib/schema';

interface TemplateProps {
  data: ResumeDocument;
  fullData?: ResumeDocument;
  pageNumber?: number;
  totalPages?: number;
  spacingDensity?: 'compact' | 'balanced' | 'spacious';
  fontSizeScale?: number;
}

export default function MinimalBlueTechResume({
  data,
  fullData,
  pageNumber = 1,
  totalPages = 1,
  spacingDensity = 'balanced',
  fontSizeScale = 100,
}: TemplateProps) {
  const { personalInfo, summary, sections } = data;

  const hasContact =
    Boolean(personalInfo.email) ||
    Boolean(personalInfo.phone) ||
    Boolean(personalInfo.location) ||
    (personalInfo.links && personalInfo.links.some((l) => l.url));

  const validEducation = (sections.education || []).filter(
    (e) => e.institution.trim() || e.degree.trim()
  );

  const validExperience = (sections.experience || []).filter(
    (e) => e.company.trim() || e.role.trim()
  );

  const validSkills = (sections.skills || []).filter((s) => s.trim().length > 0);

  const validProjects = (sections.projects || []).filter(
    (p) => p.name.trim() || p.description.trim()
  );

  const validCertifications = (sections.certifications || []).filter(
    (c) => c.name.trim()
  );

  const validVolunteer = (sections.volunteer || []).filter(
    (v) => v.organization.trim().length > 0
  );

  const validLanguages = (sections.languages || []).filter(
    (l) => l.language.trim().length > 0
  );

  const validReferences = (sections.references || []).filter(
    (r) => r.name.trim().length > 0
  );

  const validAwards = (sections.awards || []).filter(
    (a) => a.title.trim().length > 0
  );

  const isLastPage = !totalPages || pageNumber === totalPages;
  const showDeclaration = Boolean(sections.declaration?.enabled && isLastPage);

  const densityConfig = {
    compact: {
      padding: 'p-0',
      sectionMargin: 'mb-1.5',
      entryGap: 'space-y-1',
      headerMargin: 'pb-1.5 mb-2',
    },
    balanced: {
      padding: 'p-0',
      sectionMargin: 'mb-2',
      entryGap: 'space-y-1',
      headerMargin: 'pb-2 mb-2.5',
    },
    spacious: {
      padding: 'p-0',
      sectionMargin: 'mb-2.5',
      entryGap: 'space-y-1.5',
      headerMargin: 'pb-2.5 mb-3',
    },
  };
  const config = densityConfig[spacingDensity] || densityConfig.balanced;
  const scale = fontSizeScale && fontSizeScale !== 100 ? fontSizeScale / 100 : 1;

  return (
    <article
      className={`single-page-resume bg-white text-neutral-900 w-full min-h-0 ${config.padding} shadow-none font-sans selection:bg-blue-100`}
      style={
        {
          fontFamily: 'var(--font-sans, system-ui, sans-serif)',
          width: '100%',
          maxWidth: '100%',
          '--fs': scale,
        } as React.CSSProperties
      }
    >
      {/* Header: Personal Info — Suppressed on Page 2+ */}
      {pageNumber === 1 && (
        <header className={`border-b-2 border-blue-600 ${config.headerMargin}`}>
          {personalInfo.fullName && (
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">
              {personalInfo.fullName}
            </h1>
          )}

          {hasContact && (
            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-neutral-600">
              {personalInfo.email && (
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {personalInfo.email}
                </a>
              )}
              {personalInfo.email && (personalInfo.phone || personalInfo.location) && <span>•</span>}

              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.phone && personalInfo.location && <span>•</span>}

              {personalInfo.location && <span>{personalInfo.location}</span>}

              {personalInfo.links &&
                personalInfo.links
                  .filter((l) => l.url.trim())
                  .map((link, idx) => (
                    <React.Fragment key={idx}>
                      <span>•</span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {link.label || link.url.replace(/^https?:\/\//, '')}
                      </a>
                    </React.Fragment>
                  ))}
            </div>
          )}
        </header>
      )}

      {/* Professional Summary */}
      {summary && summary.trim().length > 0 && (
        <section data-section-type="summary" className={`${config.sectionMargin} last:mb-0`}>
          <h2 data-section-heading="true" className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed text-neutral-700">{summary}</p>
        </section>
      )}

      {/* Experience Section */}
      {validExperience.length > 0 && (
        <section data-section-type="experience" className={`${config.sectionMargin} last:mb-0`}>
          {!data.continuingSections?.includes('experience') && (
            <h2 data-section-heading="true" className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-3">
              Experience
            </h2>
          )}
          <div className="space-y-4">
            {validExperience.map((exp, idx) => {
              const bullets = (exp.bullets || []).filter((b) => b.trim().length > 0);
              return (
                <div key={idx} data-entry-item="true" className="space-y-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-1">
                    <span className="text-sm font-semibold text-neutral-900">
                      {exp.role}
                      {exp.role && exp.company && ' — '}
                      <span className="font-normal text-neutral-700">{exp.company}</span>
                    </span>
                    {(exp.startDate || exp.endDate) && (
                      <span className="text-xs text-neutral-500 font-mono">
                        {exp.startDate} {exp.startDate && exp.endDate ? '–' : ''} {exp.endDate}
                      </span>
                    )}
                  </div>
                  {bullets.length > 0 && (
                    <ul className="list-disc list-outside pl-5 space-y-1 text-xs text-neutral-700 leading-relaxed">
                      {bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Skills Section */}
      {validSkills.length > 0 && (
        <section data-section-type="skills" className={`${config.sectionMargin} last:mb-0`}>
          {!data.continuingSections?.includes('skills') && (
            <h2 data-section-heading="true" className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
              Technical Skills
            </h2>
          )}
          <div className="flex flex-wrap gap-1.5">
            {validSkills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {validProjects.length > 0 && (
        <section data-section-type="projects" className={`${config.sectionMargin} last:mb-0`}>
          {!data.continuingSections?.includes('projects') && (
            <h2 data-section-heading="true" className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-3">
              Key Projects
            </h2>
          )}
          <div className="space-y-3">
            {validProjects.map((proj, idx) => (
              <div key={idx} data-entry-item="true" className="text-xs space-y-0.5">
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold text-neutral-900">{proj.name}</span>
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-[11px]"
                    >
                      {proj.link.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
                {proj.description && (
                  <p className="text-neutral-700 leading-relaxed">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education Section */}
      {validEducation.length > 0 && (
        <section data-section-type="education" className={`${config.sectionMargin} last:mb-0`}>
          {!data.continuingSections?.includes('education') && (
            <h2 data-section-heading="true" className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-3">
              Education
            </h2>
          )}
          <div className="space-y-2">
            {validEducation.map((edu, idx) => (
              <div key={idx} data-entry-item="true" className="flex flex-wrap items-baseline justify-between gap-1 text-xs">
                <div>
                  <span className="font-semibold text-neutral-900">{edu.degree}</span>
                  {edu.degree && edu.field && ` in ${edu.field}`}
                  {edu.institution && (
                    <span className="text-neutral-600"> — {edu.institution}</span>
                  )}
                  {edu.grade && (
                    <span className="text-neutral-500 font-mono ml-1.5">({edu.grade})</span>
                  )}
                </div>
                {(edu.startDate || edu.endDate) && (
                  <span className="text-neutral-500 font-mono text-[11px]">
                    {edu.startDate} {edu.startDate && edu.endDate ? '–' : ''} {edu.endDate}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications Section */}
      {validCertifications.length > 0 && (
        <section data-section-type="certifications" className={`${config.sectionMargin} last:mb-0`}>
          {!data.continuingSections?.includes('certifications') && (
            <h2 data-section-heading="true" className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
              Certifications
            </h2>
          )}
          <div className="space-y-1.5 text-xs text-neutral-700">
            {validCertifications.map((cert, idx) => (
              <div key={idx} data-entry-item="true">
                <div className="flex justify-between items-baseline">
                  <span>
                    <strong className="font-medium text-neutral-900">{cert.name}</strong>
                    {cert.issuer && ` — ${cert.issuer}`}
                  </span>
                  {cert.year && <span className="text-neutral-500 font-mono text-[11px]">{cert.year}</span>}
                </div>
                {cert.description && (
                  <p className="text-xs text-neutral-600 italic mt-0.5 leading-relaxed">
                    {cert.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Honors & Key Achievements (Awards) */}
      {validAwards.length > 0 && (
        <section data-section-type="awards" className={`${config.sectionMargin} last:mb-0`}>
          {!data.continuingSections?.includes('awards') && (
            <h2 data-section-heading="true" className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1.5">
              Honors & Key Achievements
            </h2>
          )}
          <div className="space-y-1 text-xs text-neutral-700">
            {validAwards.map((award, idx) => (
              <div key={idx} data-entry-item="true">
                <div className="flex justify-between items-baseline">
                  <span>
                    <strong className="font-medium text-neutral-900">{award.title}</strong>
                    {award.issuer && ` — ${award.issuer}`}
                  </span>
                  {award.year && <span className="text-neutral-500 font-mono text-[11px]">{award.year}</span>}
                </div>
                {award.description && (
                  <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                    {award.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Volunteer Section */}
      {validVolunteer.length > 0 && (
        <section data-section-type="volunteer" className={`${config.sectionMargin} last:mb-0`}>
          {!data.continuingSections?.includes('volunteer') && (
            <h2 data-section-heading="true" className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
              Leadership & Community Engagements
            </h2>
          )}
          <div className="space-y-2 text-xs">
            {validVolunteer.map((v, idx) => (
              <div key={idx} data-entry-item="true" className="space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-neutral-900">{v.organization}</span>
                  {(v.startDate || v.endDate) && (
                    <span className="text-neutral-500 font-mono text-[11px]">
                      {v.startDate} {v.startDate && v.endDate ? '–' : ''} {v.endDate}
                    </span>
                  )}
                </div>
                {v.role && <div className="text-neutral-600 italic">{v.role}</div>}
                {v.description && <p className="text-neutral-700 leading-relaxed">{v.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages Section */}
      {validLanguages.length > 0 && (
        <section data-section-type="languages" className={`${config.sectionMargin} last:mb-0`}>
          {!data.continuingSections?.includes('languages') && (
            <h2 data-section-heading="true" className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
              Languages
            </h2>
          )}
          <div className="flex flex-wrap gap-4 text-xs text-neutral-800">
            {validLanguages.map((l, idx) => (
              <span key={idx}>
                <strong>{l.language}</strong> ({l.proficiency})
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Professional References */}
      {validReferences.length > 0 && (
        <section data-section-type="references" className={`${config.sectionMargin} last:mb-0`}>
          {!data.continuingSections?.includes('references') && (
            <h2 data-section-heading="true" className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
              Professional References
            </h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-800">
            {validReferences.map((ref, idx) => (
              <div key={idx} data-entry-item="true" className="space-y-0.5">
                <div className="font-bold text-neutral-900">{ref.name}</div>
                {(ref.role || ref.company) && (
                  <div className="text-neutral-700 italic">
                    {ref.role} {ref.role && ref.company ? '— ' : ''}{ref.company}
                  </div>
                )}
                {ref.relationship && (
                  <div className="text-[10.5px] text-neutral-500">Relation: {ref.relationship}</div>
                )}
                <div className="text-[11px] text-neutral-600 flex flex-wrap gap-x-2">
                  {ref.email && <span>{ref.email}</span>}
                  {ref.phone && <span>{ref.phone}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Declaration & Signature Block */}
      {showDeclaration && (
        <section data-section-type="declaration" className="pt-2 border-t border-neutral-300 mt-2 text-xs">
          <h2 data-section-heading="true" className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1.5">
            Declaration
          </h2>
          <p className="text-neutral-700 italic leading-snug">
            &ldquo;{sections.declaration?.text || 'I hereby declare that all the information provided above is true and correct to the best of my knowledge and belief.'}&rdquo;
          </p>
          <div className="flex justify-between items-end mt-2 pt-1 text-[11px] text-neutral-700">
            <div className="space-y-0.5">
              <div><strong>Place:</strong> {sections.declaration?.place || '_______________'}</div>
              <div><strong>Date:</strong> {sections.declaration?.date || '_______________'}</div>
            </div>
            <div className="text-right min-w-[140px]">
              {sections.declaration?.signatureName?.trim() ? (
                <div>
                  <div
                    className="h-8 flex items-center justify-end text-[#1e3a8a] select-none pr-1"
                    style={{
                      fontFamily: "'Caveat', 'Dancing Script', 'Brush Script MT', 'Segoe Script', cursive",
                      fontSize: '20px',
                      fontWeight: 600,
                      transform: 'rotate(-2deg)',
                    }}
                  >
                    {sections.declaration.signatureName}
                  </div>
                  <div className="text-[10px] text-neutral-500 border-t border-neutral-400 mt-0.5 pt-0.5">Signature</div>
                </div>
              ) : (
                <div>
                  <div className="h-7"></div>
                  <div className="text-[10px] text-neutral-500 border-t border-neutral-400 pt-0.5">Signature</div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

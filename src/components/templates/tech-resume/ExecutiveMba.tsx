import React from 'react';
import type { ResumeDocument } from '../../../lib/schema';

interface TemplateProps {
  data: ResumeDocument;
  pageNumber?: number;
  totalPages?: number;
  spacingDensity?: 'compact' | 'balanced' | 'spacious';
  fontSizeScale?: number;
}

export default function ExecutiveMba({
  data,
  pageNumber = 1,
  spacingDensity = 'balanced',
  fontSizeScale = 100,
}: TemplateProps) {
  const { personalInfo, summary, sections } = data;

  const validExperience = (sections.experience || []).filter(
    (e) => e.company.trim() || e.role.trim()
  );

  const validSkills = (sections.skills || []).filter((s) => s.trim().length > 0);

  const validProjects = (sections.projects || []).filter(
    (p) => p.name.trim() || p.description.trim()
  );

  const validEducation = (sections.education || []).filter(
    (e) => e.institution.trim() || e.degree.trim()
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

  const hasContact =
    Boolean(personalInfo.email) ||
    Boolean(personalInfo.phone) ||
    Boolean(personalInfo.location) ||
    (personalInfo.links && personalInfo.links.some((l) => l.url));

  const densityConfig = {
    compact: {
      padding: 'p-0',
      headerMargin: 'pb-2.5 mb-3',
    },
    balanced: {
      padding: 'p-0',
      headerMargin: 'pb-4 mb-5',
    },
    spacious: {
      padding: 'p-0',
      headerMargin: 'pb-5 mb-6',
    },
  };
  const config = densityConfig[spacingDensity] || densityConfig.balanced;
  const scale = fontSizeScale && fontSizeScale !== 100 ? fontSizeScale / 100 : 1;

  return (
    <article
      className={`single-page-resume bg-white text-neutral-900 w-full min-h-0 ${config.padding} font-sans shadow-none leading-normal selection:bg-amber-100`}
      style={
        {
          fontFamily:
            'var(--font-sans, "Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
          width: '100%',
          maxWidth: '100%',
          '--fs': scale,
        } as React.CSSProperties
      }
    >
      {/* Executive Header — Suppressed on Page 2+ */}
      {pageNumber === 1 && (
        <header className={`text-center ${config.headerMargin} border-b border-neutral-300`}>
          {personalInfo.fullName && (
            <h1
              className="text-3xl font-bold tracking-tight text-neutral-900 uppercase mb-1"
              style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
            >
              {personalInfo.fullName}
            </h1>
          )}

          {personalInfo.title && (
            <div className="text-xs font-semibold uppercase tracking-widest text-neutral-600 mb-2">
              {personalInfo.title}
            </div>
          )}

          {hasContact && (
            <div className="flex flex-wrap items-center justify-center gap-x-2 text-xs text-neutral-600 font-medium">
              {personalInfo.location && <span>{personalInfo.location}</span>}
              {personalInfo.location && personalInfo.phone && <span>•</span>}

              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.phone && personalInfo.email && <span>•</span>}

              {personalInfo.email && (
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="hover:text-neutral-900 transition-colors"
                >
                  {personalInfo.email}
                </a>
              )}

              {personalInfo.links &&
                personalInfo.links
                  .filter((l) => l.url.trim())
                  .map((link, idx) => {
                    const cleanUrl = link.url.replace(/^https?:\/\/(www\.)?/, '');
                    return (
                      <React.Fragment key={idx}>
                        <span>•</span>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-neutral-900 transition-colors underline decoration-neutral-300 hover:decoration-neutral-900"
                        >
                          {link.label || cleanUrl}
                        </a>
                      </React.Fragment>
                    );
                  })}
            </div>
          )}
        </header>
      )}

      {/* Executive Profile / Summary */}
      {summary && summary.trim().length > 0 && (
        <section data-section-type="summary" className="mb-5">
          <h2
            data-section-heading="true"
            className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-300 pb-1 mb-2"
            style={{ fontFamily: 'Georgia, Cambria, serif' }}
          >
            Executive Summary
          </h2>
          <p className="text-xs leading-relaxed text-neutral-800 text-justify">
            {summary}
          </p>
        </section>
      )}

      {/* Core Competencies Matrix */}
      {validSkills.length > 0 && (
        <section data-section-type="skills" className="mb-5">
          {!data.continuingSections?.includes('skills') && (
            <h2
              data-section-heading="true"
              className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-300 pb-1 mb-2"
              style={{ fontFamily: 'Georgia, Cambria, serif' }}
            >
              Core Competencies & Expertise
            </h2>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-[11px] text-neutral-800">
            {validSkills.map((skill, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="text-neutral-400 select-none">•</span>
                <span className="font-medium">{skill}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Professional Experience */}
      {validExperience.length > 0 && (
        <section data-section-type="experience" className="mb-5">
          {!data.continuingSections?.includes('experience') && (
            <h2
              data-section-heading="true"
              className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-300 pb-1 mb-3"
              style={{ fontFamily: 'Georgia, Cambria, serif' }}
            >
              Professional Experience
            </h2>
          )}
          <div className="space-y-4">
            {validExperience.map((exp, idx) => {
              const bullets = (exp.bullets || []).filter((b) => b.trim().length > 0);
              return (
                <div key={idx} data-entry-item="true" className="space-y-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-1 text-xs">
                    <div>
                      <span className="font-bold text-neutral-900">{exp.company}</span>
                      {exp.role && (
                        <span className="font-semibold text-neutral-800"> — {exp.role}</span>
                      )}
                    </div>
                    {(exp.startDate || exp.endDate) && (
                      <span className="text-[11px] font-medium text-neutral-600">
                        {exp.startDate} {exp.startDate && exp.endDate ? '–' : ''} {exp.endDate}
                      </span>
                    )}
                  </div>
                  {bullets.length > 0 && (
                    <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-neutral-700 leading-relaxed">
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

      {/* Notable Projects / Initiatives */}
      {validProjects.length > 0 && (
        <section data-section-type="projects" className="mb-5">
          {!data.continuingSections?.includes('projects') && (
            <h2
              data-section-heading="true"
              className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-300 pb-1 mb-2.5"
              style={{ fontFamily: 'Georgia, Cambria, serif' }}
            >
              Key Initiatives & Products
            </h2>
          )}
          <div className="space-y-3">
            {validProjects.map((proj, idx) => (
              <div key={idx} data-entry-item="true" className="text-xs space-y-0.5">
                <div className="flex justify-between items-baseline font-semibold text-neutral-900">
                  <span>{proj.name}</span>
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-600 hover:text-neutral-900 underline text-[11px] font-normal"
                    >
                      View Details ↗
                    </a>
                  )}
                </div>
                <p className="text-neutral-700 leading-relaxed text-xs">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Credentials */}
      {validEducation.length > 0 && (
        <section data-section-type="education" className="mb-5">
          {!data.continuingSections?.includes('education') && (
            <h2
              data-section-heading="true"
              className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-300 pb-1 mb-2.5"
              style={{ fontFamily: 'Georgia, Cambria, serif' }}
            >
              Education & Academic Honors
            </h2>
          )}
          <div className="space-y-2">
            {validEducation.map((edu, idx) => (
              <div key={idx} data-entry-item="true" className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-neutral-900">
                  <span>{edu.institution}</span>
                  {(edu.startDate || edu.endDate) && (
                    <span className="font-normal text-[11px] text-neutral-600">
                      {edu.startDate} {edu.startDate && edu.endDate ? '–' : ''} {edu.endDate}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-baseline text-neutral-700 italic">
                  <span>
                    {edu.degree}
                    {edu.field && ` in ${edu.field}`}
                  </span>
                  {edu.grade && <span className="not-italic font-medium">{edu.grade}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {validCertifications.length > 0 && (
        <section data-section-type="certifications" className="mb-4">
          {!data.continuingSections?.includes('certifications') && (
            <h2
              data-section-heading="true"
              className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-300 pb-1 mb-2"
              style={{ fontFamily: 'Georgia, Cambria, serif' }}
            >
              Certifications & Credentials
            </h2>
          )}
          <div className="space-y-1.5 text-xs text-neutral-800">
            {validCertifications.map((cert, idx) => (
              <div key={`c-${idx}`} data-entry-item="true" className="flex justify-between items-baseline">
                <span>
                  <strong>{cert.name}</strong>
                  {cert.issuer && ` — ${cert.issuer}`}
                  {cert.description && (
                    <span className="text-neutral-600 italic"> ({cert.description})</span>
                  )}
                </span>
                {cert.year && <span className="text-[11px] text-neutral-600">{cert.year}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Leadership & Volunteer Experience */}
      {validVolunteer.length > 0 && (
        <section data-section-type="volunteer" className="mb-4">
          {!data.continuingSections?.includes('volunteer') && (
            <h2
              data-section-heading="true"
              className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-300 pb-1 mb-2"
              style={{ fontFamily: 'Georgia, Cambria, serif' }}
            >
              Leadership & Community Engagements
            </h2>
          )}
          <div className="space-y-2 text-xs text-neutral-800">
            {validVolunteer.map((v, idx) => (
              <div key={`v-${idx}`} data-entry-item="true" className="space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <span>
                    <strong>{v.organization}</strong>
                    {v.role && ` — ${v.role}`}
                  </span>
                  {(v.startDate || v.endDate) && (
                    <span className="text-[11px] text-neutral-600">
                      {v.startDate} {v.startDate && v.endDate ? '–' : ''} {v.endDate}
                    </span>
                  )}
                </div>
                {v.description && (
                  <p className="text-[11.5px] text-neutral-700 leading-relaxed mt-0.5 italic">
                    {v.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {validLanguages.length > 0 && (
        <section data-section-type="languages" className="mb-4">
          {!data.continuingSections?.includes('languages') && (
            <h2
              data-section-heading="true"
              className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-300 pb-1 mb-2"
              style={{ fontFamily: 'Georgia, Cambria, serif' }}
            >
              Languages
            </h2>
          )}
          <div className="flex flex-wrap gap-4 text-xs text-neutral-800">
            {validLanguages.map((lang, idx) => (
              <span key={idx}>
                <strong>{lang.language}</strong> ({lang.proficiency})
              </span>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

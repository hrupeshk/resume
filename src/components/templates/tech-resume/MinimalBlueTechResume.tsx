import React from 'react';
import type { ResumeDocument } from '../../../lib/schema';

interface TemplateProps {
  data: ResumeDocument;
  spacingDensity?: 'compact' | 'balanced' | 'spacious';
  fontSizeScale?: number;
}

export default function MinimalBlueTechResume({
  data,
  spacingDensity = 'balanced',
  fontSizeScale = 100,
}: TemplateProps) {
  const { personalInfo, summary, sections } = data;

  // Helpers to check if sections have non-empty content
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

  const densityConfig = {
    compact: {
      padding: 'p-6 sm:p-8',
      headerMargin: 'pb-2.5 mb-3',
    },
    balanced: {
      padding: 'p-8 sm:p-12',
      headerMargin: 'pb-4 mb-5',
    },
    spacious: {
      padding: 'p-10 sm:p-14',
      headerMargin: 'pb-5 mb-6',
    },
  };
  const config = densityConfig[spacingDensity] || densityConfig.balanced;
  const scale = fontSizeScale && fontSizeScale !== 100 ? fontSizeScale / 100 : 1;

  return (
    <article
      className={`single-page-resume bg-white text-neutral-900 w-full min-h-[297mm] ${config.padding} shadow-none font-sans selection:bg-blue-100`}
      style={
        {
          fontFamily: 'var(--font-sans, system-ui, sans-serif)',
          width: '100%',
          maxWidth: '100%',
          '--fs': scale,
        } as React.CSSProperties
      }
    >
      {/* Header: Personal Info */}
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

      {/* Professional Summary */}
      {summary && summary.trim().length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed text-neutral-700">{summary}</p>
        </section>
      )}

      {/* Experience Section */}
      {validExperience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-3">
            Experience
          </h2>
          <div className="space-y-4">
            {validExperience.map((exp, idx) => {
              const bullets = (exp.bullets || []).filter((b) => b.trim().length > 0);
              return (
                <div key={idx} className="space-y-1">
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

      {/* Skills Section */}
      {validSkills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
            Technical Skills
          </h2>
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
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-3">
            Key Projects
          </h2>
          <div className="space-y-3">
            {validProjects.map((proj, idx) => (
              <div key={idx} className="text-xs space-y-0.5">
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
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-3">
            Education
          </h2>
          <div className="space-y-2">
            {validEducation.map((edu, idx) => (
              <div key={idx} className="flex flex-wrap items-baseline justify-between gap-1 text-xs">
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
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
            Certifications
          </h2>
          <ul className="space-y-1 text-xs text-neutral-700">
            {validCertifications.map((cert, idx) => (
              <li key={idx} className="flex justify-between items-baseline">
                <span>
                  <strong className="font-medium text-neutral-900">{cert.name}</strong>
                  {cert.issuer && ` — ${cert.issuer}`}
                </span>
                {cert.year && <span className="text-neutral-500 font-mono text-[11px]">{cert.year}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

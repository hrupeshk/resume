import React from 'react';
import type { ResumeDocument } from '../../../lib/schema';

interface TemplateProps {
  data: ResumeDocument;
  spacingDensity?: 'compact' | 'balanced' | 'spacious';
  fontSizeScale?: number;
}

export default function FaangClassic({
  data,
  spacingDensity = 'balanced',
  fontSizeScale = 100,
}: TemplateProps) {
  const { personalInfo, summary, sections } = data;

  const validExperience = (sections.experience || []).filter(
    (e) => e.company.trim() || e.role.trim()
  );

  const validProjects = (sections.projects || []).filter(
    (p) => p.name.trim() || p.description.trim()
  );

  const validSkills = (sections.skills || []).filter((s) => s.trim().length > 0);

  const validEducation = (sections.education || []).filter(
    (e) => e.institution.trim() || e.degree.trim()
  );

  const validCertifications = (sections.certifications || []).filter(
    (c) => c.name.trim()
  );

  const validLanguages = (sections.languages || []).filter(
    (l) => l.language.trim().length > 0
  );

  const validVolunteer = (sections.volunteer || []).filter(
    (v) => v.organization.trim().length > 0
  );

  const hasContact =
    Boolean(personalInfo.email) ||
    Boolean(personalInfo.phone) ||
    Boolean(personalInfo.location) ||
    (personalInfo.links && personalInfo.links.some((l) => l.url));

  const densityConfig = {
    compact: {
      padding: 'p-6 sm:p-8',
      sectionMargin: 'mb-2.5',
      entryGap: 'space-y-1',
      headerMargin: 'mb-2 pb-1',
    },
    balanced: {
      padding: 'p-8 sm:p-12',
      sectionMargin: 'mb-4',
      entryGap: 'space-y-2',
      headerMargin: 'mb-4 pb-2',
    },
    spacious: {
      padding: 'p-10 sm:p-14',
      sectionMargin: 'mb-5',
      entryGap: 'space-y-3',
      headerMargin: 'mb-5 pb-2.5',
    },
  };
  const config = densityConfig[spacingDensity] || densityConfig.balanced;

  const scale = fontSizeScale && fontSizeScale !== 100 ? fontSizeScale / 100 : 1;

  return (
    <article
      className={`single-page-resume bg-white text-black min-h-[297mm] ${config.padding} font-sans shadow-none leading-normal selection:bg-neutral-200 w-full`}
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
      {/* Centered Top Header (Jake's Resume / Overleaf Gold Standard) */}
      <header className={`text-center ${config.headerMargin}`}>
        {personalInfo.fullName && (
          <h1 className="text-2xl sm:text-3xl font-bold tracking-normal uppercase text-black mb-1">
            {personalInfo.fullName}
          </h1>
        )}

        {personalInfo.title && (
          <div className="text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider">
            {personalInfo.title}
          </div>
        )}

        {hasContact && (
          <div className="flex flex-wrap items-center justify-center gap-x-2 text-[11px] text-neutral-800">
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.phone && personalInfo.email && <span>|</span>}

            {personalInfo.email && (
              <a href={`mailto:${personalInfo.email}`} className="hover:underline">
                {personalInfo.email}
              </a>
            )}
            {personalInfo.email && personalInfo.location && <span>|</span>}

            {personalInfo.location && <span>{personalInfo.location}</span>}

            {personalInfo.links &&
              personalInfo.links
                .filter((l) => l.url.trim())
                .map((link, idx) => {
                  const cleanUrl = link.url.replace(/^https?:\/\/(www\.)?/, '');
                  return (
                    <React.Fragment key={idx}>
                      <span>|</span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:underline font-medium"
                      >
                        {link.label || cleanUrl}
                      </a>
                    </React.Fragment>
                  );
                })}
          </div>
        )}

        {summary && summary.trim().length > 0 && (
          <p className="text-[11px] text-neutral-700 max-w-2xl mx-auto mt-2 leading-relaxed text-center">
            {summary}
          </p>
        )}
      </header>

      {/* Education Section */}
      {validEducation.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
            Education
          </h2>
          <div className="space-y-2">
            {validEducation.map((edu, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-black">
                  <span>{edu.institution}</span>
                  {(edu.startDate || edu.endDate) && (
                    <span className="font-normal text-[11px] text-neutral-700">
                      {edu.startDate} {edu.startDate && edu.endDate ? '–' : ''} {edu.endDate}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-baseline text-[11.5px] text-neutral-800 italic">
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

      {/* Experience Section */}
      {validExperience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
            Experience
          </h2>
          <div className="space-y-3">
            {validExperience.map((exp, idx) => {
              const bullets = (exp.bullets || []).filter((b) => b.trim().length > 0);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-bold text-black">
                      {exp.role} <span className="font-normal text-neutral-700">| {exp.company}</span>
                    </span>
                    {(exp.startDate || exp.endDate) && (
                      <span className="text-[11px] text-neutral-700">
                        {exp.startDate} {exp.startDate && exp.endDate ? '–' : ''} {exp.endDate}
                      </span>
                    )}
                  </div>
                  {bullets.length > 0 && (
                    <ul className="list-disc list-outside pl-4 space-y-1 text-[11px] text-neutral-800 leading-relaxed">
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

      {/* Projects Section */}
      {validProjects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
            Projects
          </h2>
          <div className="space-y-2.5">
            {validProjects.map((proj, idx) => {
              const lines = proj.description.split('\n');
              const techLine = lines.find((l) => l.trim().toLowerCase().startsWith('tech:'));
              const descLines = lines.filter((l) => !l.trim().toLowerCase().startsWith('tech:'));

              return (
                <div key={idx} className="text-xs space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <div className="font-bold text-black flex items-center gap-1.5">
                      <span>{proj.name}</span>
                      {techLine && (
                        <span className="font-normal italic text-neutral-700 text-[11px]">
                          | {techLine.replace(/^tech:\s*/i, '')}
                        </span>
                      )}
                    </div>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-800 hover:underline text-[10.5px] font-mono"
                      >
                        [Link]
                      </a>
                    )}
                  </div>
                  {descLines.length > 0 ? (
                    <ul className="list-disc list-outside pl-4 space-y-0.5 text-[11px] text-neutral-800 leading-relaxed">
                      {descLines.map((line, lIdx) =>
                        line.trim() ? <li key={lIdx}>{line.trim()}</li> : null
                      )}
                    </ul>
                  ) : (
                    <p className="text-[11px] text-neutral-800 leading-relaxed">{proj.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Technical Skills Section */}
      {validSkills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            Technical Skills
          </h2>
          <div className="text-[11px] leading-relaxed text-neutral-800">
            <span className="font-bold">Skills & Frameworks: </span>
            <span>{validSkills.join(', ')}</span>
          </div>
        </section>
      )}

      {/* Certifications Section */}
      {validCertifications.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            Certifications & Training
          </h2>
          <ul className="space-y-1 text-[11px] text-neutral-800">
            {validCertifications.map((cert, idx) => (
              <li key={idx} className="flex justify-between items-baseline">
                <span>
                  <strong className="font-semibold">{cert.name}</strong>
                  {cert.issuer && <span> — {cert.issuer}</span>}
                  {cert.description && (
                    <span className="text-neutral-600 italic"> ({cert.description})</span>
                  )}
                </span>
                {cert.year && <span className="text-neutral-600 font-mono text-[10.5px]">{cert.year}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Languages Section */}
      {validLanguages.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            Languages
          </h2>
          <div className="text-[11px] leading-relaxed text-neutral-800">
            {validLanguages.map((l, idx) => (
              <span key={idx}>
                <strong>{l.language}</strong> ({l.proficiency})
                {idx < validLanguages.length - 1 ? ' • ' : ''}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Volunteer & Leadership Experience */}
      {validVolunteer.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            Leadership & Volunteer Experience
          </h2>
          <div className="space-y-2">
            {validVolunteer.map((v, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-black">
                  <span>
                    {v.organization} {v.role ? `| ${v.role}` : ''}
                  </span>
                  {(v.startDate || v.endDate) && (
                    <span className="font-normal text-[11px] text-neutral-700">
                      {v.startDate} {v.startDate && v.endDate ? '–' : ''} {v.endDate}
                    </span>
                  )}
                </div>
                {v.description && (
                  <p className="text-[11px] text-neutral-800 leading-relaxed mt-0.5">{v.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

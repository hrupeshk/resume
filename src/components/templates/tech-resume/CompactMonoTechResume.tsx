import React from 'react';
import type { ResumeDocument } from '../../../lib/schema';

interface TemplateProps {
  data: ResumeDocument;
  spacingDensity?: 'compact' | 'balanced' | 'spacious';
  fontSizeScale?: number;
}

export default function CompactMonoTechResume({
  data,
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

  const validLanguages = (sections.languages || []).filter(
    (l) => l.language.trim().length > 0
  );

  const validVolunteer = (sections.volunteer || []).filter(
    (v) => v.organization.trim().length > 0
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
      className={`single-page-resume bg-white text-black w-full min-h-[297mm] ${config.padding} shadow-none font-sans selection:bg-neutral-200`}
      style={
        {
          fontFamily: 'var(--font-sans, system-ui, sans-serif)',
          width: '100%',
          maxWidth: '100%',
          '--fs': scale,
        } as React.CSSProperties
      }
    >
      {/* Header */}
      <header className={`border-b border-black ${config.headerMargin}`}>
        {personalInfo.fullName && (
          <h1 className="text-2xl font-bold tracking-tight uppercase text-black mb-1.5 font-mono">
            {personalInfo.fullName}
          </h1>
        )}

        {hasContact && (
          <div className="flex flex-wrap items-center gap-x-2 text-[11px] font-mono text-neutral-600">
            {personalInfo.email && (
              <a href={`mailto:${personalInfo.email}`} className="hover:text-black">
                {personalInfo.email}
              </a>
            )}
            {personalInfo.email && (personalInfo.phone || personalInfo.location) && <span>/</span>}

            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.phone && personalInfo.location && <span>/</span>}

            {personalInfo.location && <span>{personalInfo.location}</span>}

            {personalInfo.links &&
              personalInfo.links
                .filter((l) => l.url.trim())
                .map((link, idx) => (
                  <React.Fragment key={idx}>
                    <span>/</span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black underline decoration-neutral-400 hover:decoration-black"
                    >
                      {link.label || link.url.replace(/^https?:\/\//, '')}
                    </a>
                  </React.Fragment>
                ))}
          </div>
        )}
      </header>

      {/* Summary */}
      {summary && summary.trim().length > 0 && (
        <section className="mb-5">
          <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-1 mb-2">
            [01] Summary
          </h2>
          <p className="text-xs leading-relaxed text-neutral-800">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {validExperience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-1 mb-2.5">
            [02] Experience
          </h2>
          <div className="space-y-3.5">
            {validExperience.map((exp, idx) => {
              const bullets = (exp.bullets || []).filter((b) => b.trim().length > 0);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-1 text-xs">
                    <div>
                      <strong className="font-semibold text-black">{exp.role}</strong>
                      {exp.role && exp.company && ' @ '}
                      <span className="font-medium text-neutral-800">{exp.company}</span>
                    </div>
                    {(exp.startDate || exp.endDate) && (
                      <span className="text-[11px] font-mono text-neutral-600">
                        {exp.startDate} {exp.startDate && exp.endDate ? '→' : ''} {exp.endDate}
                      </span>
                    )}
                  </div>
                  {bullets.length > 0 && (
                    <ul className="space-y-1 text-xs text-neutral-700 leading-snug">
                      {bullets.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2">
                          <span className="font-mono text-neutral-400 select-none">›</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Projects */}
      {validProjects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-1 mb-2.5">
            [03] Projects
          </h2>
          <div className="space-y-2.5">
            {validProjects.map((proj, idx) => (
              <div key={idx} className="text-xs space-y-0.5">
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold text-black">{proj.name}</span>
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[10px] text-neutral-600 underline"
                    >
                      {proj.link.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
                {proj.description && (
                  <p className="text-neutral-700 leading-relaxed text-xs">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Technical Skills */}
      {validSkills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-1 mb-2">
            [04] Technical Stack
          </h2>
          <div className="flex flex-wrap gap-1 font-mono text-[11px]">
            {validSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 border border-neutral-300 text-neutral-800 rounded-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {validEducation.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-1 mb-2">
            [05] Education
          </h2>
          <div className="space-y-1.5">
            {validEducation.map((edu, idx) => (
              <div key={idx} className="flex flex-wrap items-baseline justify-between gap-1 text-xs">
                <div>
                  <span className="font-semibold text-black">{edu.degree}</span>
                  {edu.degree && edu.field && ` in ${edu.field}`}
                  {edu.institution && (
                    <span className="text-neutral-700">, {edu.institution}</span>
                  )}
                  {edu.grade && (
                    <span className="text-neutral-500 font-mono text-[11px] ml-1.5">
                      [{edu.grade}]
                    </span>
                  )}
                </div>
                {(edu.startDate || edu.endDate) && (
                  <span className="text-[11px] font-mono text-neutral-600">
                    {edu.startDate} {edu.startDate && edu.endDate ? '→' : ''} {edu.endDate}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {validCertifications.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-1 mb-2">
            [06] Certifications
          </h2>
          <ul className="space-y-1 text-xs text-neutral-800">
            {validCertifications.map((cert, idx) => (
              <li key={idx} className="flex justify-between items-baseline">
                <span>
                  <strong className="font-medium text-black">{cert.name}</strong>
                  {cert.issuer && ` — ${cert.issuer}`}
                </span>
                {cert.year && (
                  <span className="text-[11px] font-mono text-neutral-600">[{cert.year}]</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Languages */}
      {validLanguages.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-1 mb-2">
            [07] Languages
          </h2>
          <div className="flex flex-wrap gap-4 text-xs font-mono text-neutral-800">
            {validLanguages.map((lang, idx) => (
              <span key={idx}>
                <strong>{lang.language}</strong> [{lang.proficiency}]
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Volunteer */}
      {validVolunteer.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-1 mb-2">
            [08] Volunteer & Leadership
          </h2>
          <div className="space-y-2 text-xs">
            {validVolunteer.map((v, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-black">{v.organization}</span>
                  {(v.startDate || v.endDate) && (
                    <span className="text-[11px] font-mono text-neutral-600">
                      {v.startDate} {v.startDate && v.endDate ? '→' : ''} {v.endDate}
                    </span>
                  )}
                </div>
                {v.role && <div className="text-neutral-700 italic">{v.role}</div>}
                {v.description && <p className="text-neutral-600">{v.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

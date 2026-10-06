import React from 'react';
import type { ResumeDocument } from '../../../lib/schema';

interface TemplateProps {
  data: ResumeDocument;
  pageNumber?: number;
  totalPages?: number;
  spacingDensity?: 'compact' | 'balanced' | 'spacious';
  fontSizeScale?: number;
}

export default function CompactMonoTechResume({
  data,
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

  const validAwards = (sections.awards || []).filter(
    (a) => a.title.trim().length > 0
  );

  const validLanguages = (sections.languages || []).filter(
    (l) => l.language.trim().length > 0
  );

  const validVolunteer = (sections.volunteer || []).filter(
    (v) => v.organization.trim().length > 0
  );

  const validReferences = (sections.references || []).filter(
    (r) => r.name.trim().length > 0
  );

  const isLastPage = !totalPages || pageNumber === totalPages;
  const showDeclaration = Boolean(sections.declaration?.enabled && isLastPage);

  // Compute master sequential section numbers without skipping empty sections
  const docSummary = (data.summary || '').trim();
  const docExperience = (data.sections.experience || []).filter((e) => e.company.trim() || e.role.trim());
  const docProjects = (data.sections.projects || []).filter((p) => p.name.trim() || p.description.trim());
  const docSkills = (data.sections.skills || []).filter((s) => s.trim().length > 0);
  const docEducation = (data.sections.education || []).filter((e) => e.institution.trim() || e.degree.trim());
  const docCertifications = (data.sections.certifications || []).filter((c) => c.name.trim());
  const docAwards = (data.sections.awards || []).filter((a) => a.title.trim().length > 0);
  const docLanguages = (data.sections.languages || []).filter((l) => l.language.trim().length > 0);
  const docVolunteer = (data.sections.volunteer || []).filter((v) => v.organization.trim().length > 0);
  const docReferences = (data.sections.references || []).filter((r) => r.name.trim().length > 0);
  const docDeclaration = Boolean(data.sections.declaration?.enabled);

  const activeDocSections: string[] = [];
  if (docSummary.length > 0) activeDocSections.push('summary');
  if (docExperience.length > 0) activeDocSections.push('experience');
  if (docProjects.length > 0) activeDocSections.push('projects');
  if (docSkills.length > 0) activeDocSections.push('skills');
  if (docEducation.length > 0) activeDocSections.push('education');
  if (docCertifications.length > 0) activeDocSections.push('certifications');
  if (docAwards.length > 0) activeDocSections.push('awards');
  if (docLanguages.length > 0) activeDocSections.push('languages');
  if (docVolunteer.length > 0) activeDocSections.push('volunteer');
  if (docReferences.length > 0) activeDocSections.push('references');
  if (docDeclaration) activeDocSections.push('declaration');

  const getSectionNum = (key: string): string => {
    const idx = activeDocSections.indexOf(key);
    if (idx === -1) return '';
    const num = idx + 1;
    return `[${num < 10 ? '0' + num : num}] `;
  };

  const densityConfig = {
    compact: {
      padding: 'p-0',
      sectionMargin: 'mb-1.5',
      headerMargin: 'pb-1.5 mb-2',
    },
    balanced: {
      padding: 'p-0',
      sectionMargin: 'mb-2',
      headerMargin: 'pb-2 mb-2.5',
    },
    spacious: {
      padding: 'p-0',
      sectionMargin: 'mb-2.5',
      headerMargin: 'pb-2.5 mb-3',
    },
  };
  const config = densityConfig[spacingDensity] || densityConfig.balanced;
  const scale = fontSizeScale && fontSizeScale !== 100 ? fontSizeScale / 100 : 1;

  return (
    <article
      className={`single-page-resume bg-white text-black w-full min-h-0 ${config.padding} shadow-none font-sans selection:bg-neutral-200`}
      style={
        {
          fontFamily: 'var(--font-sans, system-ui, sans-serif)',
          width: '100%',
          maxWidth: '100%',
          '--fs': scale,
        } as React.CSSProperties
      }
    >
      {/* Header — Suppressed on Page 2+ */}
      {pageNumber === 1 && (
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
      )}

      {/* Summary */}
      {summary && summary.trim().length > 0 && (
        <section data-section-type="summary" className={`${config.sectionMargin} last:mb-0`}>
          <h2 data-section-heading="true" className="text-[11px] font-mono font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-1 mb-1.5">
            {getSectionNum('summary')}Summary
          </h2>
          <p className="text-xs leading-relaxed text-neutral-800">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {validExperience.length > 0 && (
        <section data-section-type="experience" className={`${config.sectionMargin} last:mb-0`}>
          {!data.continuingSections?.includes('experience') && (
            <h2 data-section-heading="true" className="text-[11px] font-mono font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-1 mb-2">
              {getSectionNum('experience')}Experience
            </h2>
          )}
          <div className="space-y-2.5">
            {validExperience.map((exp, idx) => {
              const bullets = (exp.bullets || []).filter((b) => b.trim().length > 0);
              return (
                <div key={idx} data-entry-item="true" className="space-y-0.5">
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
                    <ul className="space-y-0.5 text-xs text-neutral-700 leading-snug">
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
        <section data-section-type="projects" className={`${config.sectionMargin} last:mb-0`}>
          {!data.continuingSections?.includes('projects') && (
            <h2 data-section-heading="true" className="text-[11px] font-mono font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-1 mb-2">
              {getSectionNum('projects')}Projects
            </h2>
          )}
          <div className="space-y-2">
            {validProjects.map((proj, idx) => (
              <div key={idx} data-entry-item="true" className="text-xs space-y-0.5">
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold text-black">{proj.name}</span>
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-500 font-mono text-[10.5px] hover:text-black"
                    >
                      [view]
                    </a>
                  )}
                </div>
                <p className="text-neutral-700 text-xs leading-relaxed">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Technical Skills */}
      {validSkills.length > 0 && (
        <section data-section-type="skills" className={`${config.sectionMargin} last:mb-0`}>
          {!data.continuingSections?.includes('skills') && (
            <h2 data-section-heading="true" className="text-[11px] font-mono font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-1 mb-1.5">
              {getSectionNum('skills')}Technical Stack
            </h2>
          )}
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
        <section data-section-type="education" className={`${config.sectionMargin} last:mb-0`}>
          {!data.continuingSections?.includes('education') && (
            <h2 data-section-heading="true" className="text-[11px] font-mono font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-1 mb-1.5">
              {getSectionNum('education')}Education
            </h2>
          )}
          <div className="space-y-1 text-xs">
            {validEducation.map((edu, idx) => (
              <div key={idx} data-entry-item="true" className="flex flex-wrap items-baseline justify-between gap-1">
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
        <section data-section-type="certifications" className={`${config.sectionMargin} last:mb-0`}>
          {!data.continuingSections?.includes('certifications') && (
            <h2 data-section-heading="true" className="text-[11px] font-mono font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-1 mb-1.5">
              {getSectionNum('certifications')}Certifications
            </h2>
          )}
          <div className="space-y-1 text-xs text-neutral-800">
            {validCertifications.map((cert, idx) => (
              <div key={idx} data-entry-item="true">
                <div className="flex justify-between items-baseline">
                  <span>
                    <strong className="font-medium text-black">{cert.name}</strong>
                    {cert.issuer && ` — ${cert.issuer}`}
                  </span>
                  {cert.year && (
                    <span className="text-[11px] font-mono text-neutral-600">[{cert.year}]</span>
                  )}
                </div>
                {cert.description && (
                  <p className="text-[11px] text-neutral-600 font-mono mt-0.5 leading-snug">
                    {cert.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Awards & Achievements (Completely Optional) */}
      {validAwards.length > 0 && (
        <section data-section-type="awards" className={`${config.sectionMargin} last:mb-0`}>
          {!data.continuingSections?.includes('awards') && (
            <h2 data-section-heading="true" className="text-[11px] font-mono font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-1 mb-1.5">
              {getSectionNum('awards')}Honors & Awards
            </h2>
          )}
          <div className="space-y-1 text-xs text-neutral-800">
            {validAwards.map((award, idx) => (
              <div key={idx} data-entry-item="true">
                <div className="flex justify-between items-baseline">
                  <span>
                    <strong className="font-medium text-black">{award.title}</strong>
                    {award.issuer && ` — ${award.issuer}`}
                  </span>
                  {award.year && (
                    <span className="text-[11px] font-mono text-neutral-600">[{award.year}]</span>
                  )}
                </div>
                {award.description && (
                  <p className="text-[11px] text-neutral-600 font-mono mt-0.5 leading-snug">
                    {award.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {validLanguages.length > 0 && (
        <section data-section-type="languages" className={`${config.sectionMargin} last:mb-0`}>
          {!data.continuingSections?.includes('languages') && (
            <h2 data-section-heading="true" className="text-[11px] font-mono font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-1 mb-1.5">
              {getSectionNum('languages')}Languages
            </h2>
          )}
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
        <section data-section-type="volunteer" className={`${config.sectionMargin} last:mb-0`}>
          {!data.continuingSections?.includes('volunteer') && (
            <h2 data-section-heading="true" className="text-[11px] font-mono font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-1 mb-1.5">
              {getSectionNum('volunteer')}Volunteer & Leadership
            </h2>
          )}
          <div className="space-y-1.5 text-xs">
            {validVolunteer.map((v, idx) => (
              <div key={idx} data-entry-item="true" className="space-y-0.5">
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

      {/* References Section */}
      {validReferences.length > 0 && (
        <section data-section-type="references" className={`${config.sectionMargin} last:mb-0`}>
          {!data.continuingSections?.includes('references') && (
            <h2 data-section-heading="true" className="text-xs font-mono font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
              {getSectionNum('references')}Professional References
            </h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            {validReferences.map((ref, idx) => (
              <div key={idx} data-entry-item="true" className="space-y-0.5">
                <div className="font-bold text-black">{ref.name}</div>
                {(ref.role || ref.company) && (
                  <div className="text-neutral-700 italic">
                    {ref.role} {ref.role && ref.company ? '— ' : ''}{ref.company}
                  </div>
                )}
                {ref.relationship && (
                  <div className="text-[10.5px] text-neutral-500">[{ref.relationship}]</div>
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
        <section data-section-type="declaration" className="pt-2 border-t border-neutral-300 mt-2 text-xs font-mono">
          <h2 data-section-heading="true" className="text-[11px] font-mono font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-1 mb-1.5">
            {getSectionNum('declaration')}Declaration
          </h2>
          <p className="text-neutral-700 text-xs leading-relaxed italic">
            &ldquo;{sections.declaration?.text || 'I hereby declare that all the information provided above is true and correct to the best of my knowledge and belief.'}&rdquo;
          </p>
          <div className="flex justify-between items-end mt-2 pt-1 text-[11px] text-neutral-800">
            <div className="space-y-0.5">
              <div><strong>Place:</strong> {sections.declaration?.place || '_______________'}</div>
              <div><strong>Date:</strong> {sections.declaration?.date || '_______________'}</div>
            </div>
            <div className="text-right">
              {sections.declaration?.signatureName?.trim() ? (
                <div>
                  <div className="font-bold text-black text-xs">{sections.declaration.signatureName}</div>
                  <div className="text-[10px] text-neutral-500 border-t border-neutral-400 mt-0.5 pt-0.5">Candidate Signature</div>
                </div>
              ) : (
                <div>
                  <div className="h-5"></div>
                  <div className="text-[10px] text-neutral-500 border-t border-neutral-400 pt-0.5">Candidate Signature</div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

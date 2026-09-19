import React from 'react';
import type { ResumeDocument } from '../../../lib/schema';

interface TemplateProps {
  data: ResumeDocument;
  spacingDensity?: 'compact' | 'balanced' | 'spacious';
  fontSizeScale?: number;
  pageNumber?: number;
  totalPages?: number;
  columnSplit?: number;
}

export default function FlowDeveloper({
  data,
  spacingDensity = 'balanced',
  fontSizeScale = 100,
  pageNumber = 1,
  totalPages = 1,
  columnSplit = 50,
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
      padding: 'p-0',
      sectionGap: 'space-y-2',
      entryGap: 'space-y-1',
      headerMargin: 'mb-2 pb-1.5',
    },
    balanced: {
      padding: 'p-0',
      sectionGap: 'space-y-2.5',
      entryGap: 'space-y-1.5',
      headerMargin: 'mb-3 pb-2',
    },
    spacious: {
      padding: 'p-0',
      sectionGap: 'space-y-4',
      entryGap: 'space-y-2.5',
      headerMargin: 'mb-5 pb-3',
    },
  };
  const config = densityConfig[spacingDensity] || densityConfig.balanced;

  const scale = fontSizeScale && fontSizeScale !== 100 ? fontSizeScale / 100 : 1;

  return (
    <article
      className={`single-page-resume bg-white text-neutral-900 min-h-0 ${config.padding} font-sans shadow-none leading-normal selection:bg-indigo-100 w-full`}
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
      {/* Sleek FlowCV-Style Modern Header — Suppressed on Page 2+ */}
      {pageNumber === 1 && (
        <header className={`${config.headerMargin} border-b border-neutral-200`}>
          <div className="space-y-2">
            {/* Name & Title */}
            <div>
              {personalInfo.fullName && (
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-800">
                  {personalInfo.fullName}
                </h1>
              )}
              {personalInfo.title && (
                <div className="text-sm font-bold uppercase tracking-wider text-neutral-800 mt-1">
                  {personalInfo.title}
                </div>
              )}
            </div>

            {/* Unified Contact & Profiles Row */}
            {hasContact && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-neutral-600 pt-0.5">
                {personalInfo.email && (
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="hover:text-neutral-950 transition-colors font-medium"
                  >
                    {personalInfo.email}
                  </a>
                )}
                {personalInfo.email && personalInfo.phone && <span className="text-neutral-300">•</span>}

                {personalInfo.phone && <span>{personalInfo.phone}</span>}
                {personalInfo.phone && personalInfo.location && <span className="text-neutral-300">•</span>}

                {personalInfo.location && <span>{personalInfo.location}</span>}

                {/* Links as subtle pills */}
                {personalInfo.links &&
                  personalInfo.links
                    .filter((l) => l.url.trim())
                    .map((link, idx) => (
                      <React.Fragment key={idx}>
                        <span className="text-neutral-300">•</span>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 hover:bg-neutral-200 font-medium text-[11px] transition-colors"
                        >
                          <span>{link.label || link.url.replace(/^https?:\/\//, '')}</span>
                          <span className="text-neutral-400 text-[10px]">↗</span>
                        </a>
                      </React.Fragment>
                    ))}
              </div>
            )}

            {/* Summary */}
            {summary && summary.trim().length > 0 && (
              <p className="text-xs leading-relaxed text-neutral-700 max-w-3xl pt-2">
                {summary}
              </p>
            )}
          </div>
        </header>
      )}

      {/* Main Flow Layout */}
      <div className={config.sectionGap}>
        {/* Technical Skills - Pill Matrix */}
        {validSkills.length > 0 && (
          <section data-section-type="skills">
            {!data.continuingSections?.includes('skills') && (
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                Technical Stack
              </h2>
            )}
            <div className="flex flex-wrap gap-1.5">
              {validSkills.map((skill, idx) => (
                <span
                  key={idx}
                  data-entry-item="true"
                  className="px-2.5 py-1 rounded bg-neutral-100 text-neutral-900 text-xs font-medium border border-neutral-200/70"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Work Experience */}
        {validExperience.length > 0 && (
          <section data-section-type="experience">
            {!data.continuingSections?.includes('experience') && (
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                Experience
              </h2>
            )}
            <div className={config.entryGap}>
              {validExperience.map((exp, idx) => {
                const bullets = (exp.bullets || []).filter((b) => b.trim().length > 0);
                return (
                  <div key={idx} data-entry-item="true" className="space-y-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-1 text-xs">
                      <div>
                        <span className="font-bold text-neutral-950">{exp.role}</span>
                        <span className="text-neutral-700 font-medium"> · {exp.company}</span>
                      </div>
                      {(exp.startDate || exp.endDate) && (
                        <span className="text-[11px] font-mono text-neutral-500">
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

        {/* Projects */}
        {validProjects.length > 0 && (
          <section data-section-type="projects">
            {!data.continuingSections?.includes('projects') && (
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                Projects
              </h2>
            )}
            <div className={config.entryGap}>
              {validProjects.map((proj, idx) => {
                const lines = proj.description.split('\n');
                const techLine = lines.find((l) => l.trim().toLowerCase().startsWith('tech:'));
                const descLines = lines.filter((l) => !l.trim().toLowerCase().startsWith('tech:'));

                return (
                  <div key={idx} data-entry-item="true" className="text-xs space-y-0.5">
                    <div className="flex justify-between items-baseline">
                      <div className="font-bold text-neutral-950 flex items-center gap-2">
                        <span>{proj.name}</span>
                        {techLine && (
                          <span className="font-mono text-[10px] text-neutral-800 bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200">
                            {techLine.replace(/^tech:\s*/i, '')}
                          </span>
                        )}
                      </div>
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-500 hover:text-neutral-950 text-[11px] font-mono inline-flex items-center gap-0.5"
                        >
                          <span>code</span>
                          <span>↗</span>
                        </a>
                      )}
                    </div>

                    {descLines.length > 0 && (
                      <ul className="list-disc list-outside pl-4 space-y-0.5 text-xs text-neutral-700 leading-relaxed">
                        {descLines.map((line, lIdx) =>
                          line.trim() ? <li key={lIdx}>{line.trim()}</li> : null
                        )}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Dynamic Balanced Secondary Sections (Education, Certifications, Volunteer, Languages) */}
        {(() => {
          // Reusable Section Renderers
          const renderEducation = () =>
            validEducation.length > 0 && (
              <section data-section-type="education" className="avoid-break">
                {!data.continuingSections?.includes('education') && (
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                    Education
                  </h2>
                )}
                <div className="space-y-2">
                  {validEducation.map((edu, idx) => (
                    <div key={idx} data-entry-item="true" className="text-xs space-y-0.5">
                      <div className="font-bold text-neutral-950 leading-tight">
                        {edu.degree}
                        {edu.field && ` in ${edu.field}`}
                      </div>
                      <div className="text-neutral-700">
                        {edu.institution}
                        {(edu.startDate || edu.endDate) && (
                          <span className="text-neutral-500 font-mono text-[10.5px] ml-1">
                            ({edu.startDate} {edu.startDate && edu.endDate ? '–' : ''} {edu.endDate})
                          </span>
                        )}
                      </div>
                      {edu.grade && (
                        <div className="text-[11px] text-neutral-500">GPA / Grade: {edu.grade}</div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );

          const renderCertifications = () =>
            validCertifications.length > 0 && (
              <section data-section-type="certifications" className="avoid-break">
                {!data.continuingSections?.includes('certifications') && (
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                    Certifications
                  </h2>
                )}
                <ul className="space-y-1.5 text-xs text-neutral-800">
                  {validCertifications.map((cert, idx) => (
                    <li key={idx} data-entry-item="true" className="leading-snug">
                      <div>
                        <strong className="font-bold text-neutral-950">{cert.name}</strong>
                        {cert.issuer && <span className="text-neutral-600"> — {cert.issuer}</span>}
                        {cert.year && (
                          <span className="text-[10px] text-neutral-500 font-mono ml-1">({cert.year})</span>
                        )}
                      </div>
                      {cert.description && (
                        <p className="text-[11px] text-neutral-600 italic mt-0.5 leading-snug">
                          {cert.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            );

          const renderVolunteer = () =>
            validVolunteer.length > 0 && (
              <section data-section-type="volunteer" className="avoid-break">
                {!data.continuingSections?.includes('volunteer') && (
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                    Leadership & Volunteer Experience
                  </h2>
                )}
                <div className="space-y-2">
                  {validVolunteer.map((v, idx) => (
                    <div key={idx} data-entry-item="true" className="text-xs space-y-0.5">
                      <div className="flex justify-between items-baseline font-bold text-neutral-950">
                        <span>{v.organization} {v.role ? `· ${v.role}` : ''}</span>
                        {(v.startDate || v.endDate) && (
                          <span className="text-[10.5px] text-neutral-500 font-mono font-normal">
                            {v.startDate} {v.startDate && v.endDate ? '–' : ''} {v.endDate}
                          </span>
                        )}
                      </div>
                      {v.description && (
                        <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-line">{v.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );

          const renderLanguages = (inColumn = false) =>
            validLanguages.length > 0 && (
              <section data-section-type="languages" className={inColumn ? 'avoid-break' : 'pt-2 border-t border-neutral-200 avoid-break'}>
                {!data.continuingSections?.includes('languages') && (
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                    Languages
                  </h2>
                )}
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  {validLanguages.map((lang, idx) => (
                    <span key={idx} data-entry-item="true" className="text-neutral-700 inline-flex items-center gap-1">
                      <strong className="font-semibold text-neutral-950">{lang.language}</strong>
                      <span className="text-neutral-500 text-[11px]">({lang.proficiency})</span>
                    </span>
                  ))}
                </div>
              </section>
            );

          interface SecondaryItem {
            id: 'education' | 'certifications' | 'volunteer' | 'languages';
            weight: number;
            render: (inCol?: boolean) => React.ReactNode;
          }

          const secondaryItems: SecondaryItem[] = [];

          if (validEducation.length > 0) {
            secondaryItems.push({
              id: 'education',
              weight: 30 + validEducation.length * 38,
              render: () => renderEducation(),
            });
          }

          if (validCertifications.length > 0) {
            secondaryItems.push({
              id: 'certifications',
              weight: 30 + validCertifications.length * 26,
              render: () => renderCertifications(),
            });
          }

          if (validVolunteer.length > 0) {
            const volWeight =
              30 +
              validVolunteer.reduce(
                (sum, v) => sum + 30 + (v.description ? v.description.split('\n').length * 16 : 0),
                0
              );
            secondaryItems.push({
              id: 'volunteer',
              weight: volWeight,
              render: () => renderVolunteer(),
            });
          }

          if (validLanguages.length > 0) {
            secondaryItems.push({
              id: 'languages',
              weight: 35,
              render: (inCol) => renderLanguages(inCol),
            });
          }

          if (secondaryItems.length === 0) return null;

          // 1. Only 1 secondary section exists: render full-width
          if (secondaryItems.length === 1) {
            return (
              <div className="pt-2 border-t border-neutral-200">
                {secondaryItems[0].render(false)}
              </div>
            );
          }

          const gridStyle: React.CSSProperties = {
            display: 'grid',
            gridTemplateColumns: `${columnSplit}fr ${100 - columnSplit}fr`,
            gap: '1.5rem',
            alignItems: 'start',
            paddingTop: '0.25rem',
          };

          // 2. Exactly 2 secondary sections exist:
          // Heavier/taller section on Left (Col 1), shorter on Right (Col 2)
          if (secondaryItems.length === 2) {
            const [leftItem, rightItem] =
              secondaryItems[0].weight >= secondaryItems[1].weight
                ? [secondaryItems[0], secondaryItems[1]]
                : [secondaryItems[1], secondaryItems[0]];

            return (
              <div data-flow-grid="true" style={gridStyle}>
                <div data-flow-col="0" className="space-y-4">{leftItem.render(true)}</div>
                <div data-flow-col="1" className="space-y-4">{rightItem.render(true)}</div>
              </div>
            );
          }

          // 3. Exactly 3 secondary sections exist:
          // Sort descending: [tallest, mid, shortest]
          // Pair (mid + shortest) against (tallest) to balance heights
          if (secondaryItems.length === 3) {
            const sorted = [...secondaryItems].sort((a, b) => b.weight - a.weight);
            const tallest = sorted[0];
            const mid = sorted[1];
            const shortest = sorted[2];

            const comboWeight = mid.weight + shortest.weight;
            const [colLeft, colRight] =
              tallest.weight >= comboWeight
                ? [[tallest], [mid, shortest]]
                : [[mid, shortest], [tallest]];

            return (
              <div data-flow-grid="true" style={gridStyle}>
                <div data-flow-col="0" className="space-y-4">
                  {colLeft.map((item) => (
                    <React.Fragment key={item.id}>{item.render(true)}</React.Fragment>
                  ))}
                </div>
                <div data-flow-col="1" className="space-y-4">
                  {colRight.map((item) => (
                    <React.Fragment key={item.id}>{item.render(true)}</React.Fragment>
                  ))}
                </div>
              </div>
            );
          }

          // 4. Exactly 4 secondary sections exist (Education, Certifications, Volunteer, Languages):
          // Find optimal partition into 2 non-empty subsets that minimizes height difference
          const partitions: [number[], number[]][] = [
            [[0, 1], [2, 3]],
            [[0, 2], [1, 3]],
            [[0, 3], [1, 2]],
            [[0], [1, 2, 3]],
            [[1], [0, 2, 3]],
            [[2], [0, 1, 3]],
            [[3], [0, 1, 2]],
          ];

          let bestDiff = Infinity;
          let bestPartition: [number[], number[]] = partitions[0];

          for (const [subA, subB] of partitions) {
            const weightA = subA.reduce((sum, idx) => sum + secondaryItems[idx].weight, 0);
            const weightB = subB.reduce((sum, idx) => sum + secondaryItems[idx].weight, 0);
            const diff = Math.abs(weightA - weightB);
            if (diff < bestDiff) {
              bestDiff = diff;
              bestPartition = [subA, subB];
            }
          }

          const itemsA = bestPartition[0].map((idx) => secondaryItems[idx]);
          const itemsB = bestPartition[1].map((idx) => secondaryItems[idx]);
          const weightA = itemsA.reduce((sum, it) => sum + it.weight, 0);
          const weightB = itemsB.reduce((sum, it) => sum + it.weight, 0);

          // Heavier column on the left
          const [leftCols, rightCols] = weightA >= weightB ? [itemsA, itemsB] : [itemsB, itemsA];

          return (
            <div data-flow-grid="true" style={gridStyle}>
              <div data-flow-col="0" className="space-y-4">
                {leftCols.map((it) => (
                  <React.Fragment key={it.id}>{it.render(true)}</React.Fragment>
                ))}
              </div>
              <div data-flow-col="1" className="space-y-4">
                {rightCols.map((it) => (
                  <React.Fragment key={it.id}>{it.render(true)}</React.Fragment>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    </article>
  );
}

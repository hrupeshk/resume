import React from 'react';
import type { ResumeDocument } from '../../../lib/schema';

interface TemplateProps {
  data: ResumeDocument;
  pageNumber?: number;
  totalPages?: number;
  autoBalance?: boolean;
  spacingDensity?: 'compact' | 'balanced' | 'spacious';
  columnSplit?: number; // percentage width of left column (45 to 70)
  fontSizeScale?: number; // percentage scale (85 to 115)
}

export default function NovoresumeModern({
  data,
  pageNumber = 1,
  autoBalance = false,
  spacingDensity = 'balanced',
  columnSplit = 58,
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

  const validCertifications = (sections.certifications || []).filter(
    (c) => c.name.trim()
  );

  const validEducation = (sections.education || []).filter(
    (e) => e.institution.trim() || e.degree.trim()
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

  // Spacing gap styles according to user density selection
  const densityConfig = {
    compact: {
      padding: '0px',
      columnGap: 'space-y-1.5',
      entryGap: 'space-y-1',
      headerMargin: 'mb-1.5 pb-1',
      sectionHeaderMargin: 'mb-1 pb-0.5',
    },
    balanced: {
      padding: '0px',
      columnGap: 'space-y-2',
      entryGap: 'space-y-1.5',
      headerMargin: 'mb-2 pb-1',
      sectionHeaderMargin: 'mb-1 pb-0.5',
    },
    spacious: {
      padding: '0px',
      columnGap: 'space-y-3.5',
      entryGap: 'space-y-2',
      headerMargin: 'mb-3 pb-1.5',
      sectionHeaderMargin: 'mb-1.5 pb-0.5',
    },
  };
  const config = densityConfig[spacingDensity] || densityConfig.balanced;

  // -------------------------------------------------------------------------
  // Intelligent Column Auto-Balancing Algorithm
  // -------------------------------------------------------------------------
  const expWeight =
    validExperience.reduce((sum, e) => sum + 3 + (e.bullets?.length || 1) * 1.5, 0) +
    (validExperience.length > 0 ? 3 : 0);

  const projWeight =
    validProjects.reduce(
      (sum, p) => sum + 3 + (p.description ? p.description.split('\n').length : 1) * 1.4,
      0
    ) + (validProjects.length > 0 ? 3 : 0);

  const skillsWeight =
    Math.ceil(validSkills.length / 3) * 1.8 + (validSkills.length > 0 ? 3 : 0);

  const certsWeight =
    validCertifications.length * 3 + (validCertifications.length > 0 ? 3 : 0);

  const volWeight =
    validVolunteer.length * 3.5 + (validVolunteer.length > 0 ? 3 : 0);

  const eduWeight =
    validEducation.length * 3.2 + (validEducation.length > 0 ? 3 : 0);

  const langWeight =
    validLanguages.length * 2.2 + (validLanguages.length > 0 ? 3 : 0);

  // Determine section placement based on auto-balancing
  // In classic Novorésumé: Left has Experience + Projects; Right has Skills, Certs, Volunteer, Edu, Languages.
  let placeEducationOnLeft = false;
  let placeCertificationsOnLeft = false;

  if (autoBalance) {
    const leftInitial = expWeight + projWeight;
    const rightInitial = skillsWeight + certsWeight + volWeight + eduWeight + langWeight;
    const diffInitial = Math.abs(leftInitial - rightInitial);

    // Only move Education if Right is significantly taller AND moving it reduces the difference
    const diffWithEduOnLeft = Math.abs(leftInitial + eduWeight - (rightInitial - eduWeight));
    if (rightInitial > leftInitial + 4 && diffWithEduOnLeft < diffInitial - 2 && validEducation.length > 0) {
      placeEducationOnLeft = true;

      const rightAfterEdu = rightInitial - eduWeight;
      const leftAfterEdu = leftInitial + eduWeight;
      const diffAfterEdu = Math.abs(leftAfterEdu - rightAfterEdu);
      const diffWithCertsOnLeft = Math.abs(leftAfterEdu + certsWeight - (rightAfterEdu - certsWeight));
      if (rightAfterEdu > leftAfterEdu + 5 && diffWithCertsOnLeft < diffAfterEdu - 2 && validCertifications.length > 0) {
        placeCertificationsOnLeft = true;
      }
    }
  }

  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // Reusable Section Renderers (Novorésumé Signature Styling)
  // -------------------------------------------------------------------------
  const scale = fontSizeScale && fontSizeScale !== 100 ? fontSizeScale / 100 : 1;
  const fs = (base: number) => `${(base * scale).toFixed(1)}px`;

  const renderSectionHeader = (title: string) => (
    <div className={`flex items-center gap-2 ${config.sectionHeaderMargin} border-b border-[#f1f5f9]`}>
      <span
        className="w-2.5 h-3.5 bg-[#008c9e] rounded-[1px] inline-block flex-shrink-0"
        style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
      />
      <h2
        data-section-heading="true"
        className="font-bold uppercase tracking-wider text-[#2e3842]"
        style={{ fontSize: fs(11.5) }}
      >
        {title}
      </h2>
    </div>
  );

  const renderExperience = () =>
    validExperience.length > 0 && (
      <section data-section-type="experience">
        {!data.continuingSections?.includes('experience') && renderSectionHeader('Work Experience')}
        <div className={config.entryGap}>
          {validExperience.map((exp, idx) => {
            const bullets = (exp.bullets || []).filter((b) => b.trim().length > 0);
            return (
              <div key={idx} data-entry-item="true" className="space-y-0.5">
                <div>
                  <h3
                    className="font-bold text-[#2e3842] leading-snug"
                    style={{ fontSize: fs(11.5) }}
                  >
                    {exp.role}
                  </h3>
                  <div
                    className="flex items-center justify-between text-[#475569] font-medium"
                    style={{ fontSize: fs(10.5) }}
                  >
                    <span>{exp.company}</span>
                    {(exp.startDate || exp.endDate) && (
                      <span
                        className="text-[#008c9e] font-semibold"
                        style={{ fontSize: fs(9.5) }}
                      >
                        {exp.startDate} {exp.startDate && exp.endDate ? '–' : ''} {exp.endDate}
                      </span>
                    )}
                  </div>
                </div>

                {bullets.length > 0 && (
                  <div className="pt-0.5">
                    <span
                      className="font-semibold text-[#008c9e] italic block mb-0.5"
                      style={{ fontSize: fs(9.5) }}
                    >
                      Responsibilities
                    </span>
                    <ul
                      className="list-disc list-outside pl-3.5 space-y-0.5 text-[#475569] leading-relaxed"
                      style={{ fontSize: fs(9.5) }}
                    >
                      {bullets.map((bullet, bIdx) => (
                        <li key={bIdx}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    );

  const renderProjects = () =>
    validProjects.length > 0 && (
      <section data-section-type="projects">
        {!data.continuingSections?.includes('projects') && renderSectionHeader('Personal Projects')}
        <div className={config.entryGap}>
          {validProjects.map((proj, idx) => {
            const lines = proj.description.split('\n');
            const techLine = lines.find((l) => l.trim().toLowerCase().startsWith('tech:'));
            const descLines = lines.filter((l) => !l.trim().toLowerCase().startsWith('tech:'));

            return (
              <div
                key={idx}
                data-entry-item="true"
                className="space-y-0.5"
                style={{ fontSize: fs(9.5) }}
              >
                <div className="flex items-baseline justify-between">
                  <span
                    className="font-bold text-[#2e3842]"
                    style={{ fontSize: fs(11.5) }}
                  >
                    {proj.name}
                  </span>
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#008c9e] hover:underline font-semibold"
                      style={{ fontSize: fs(9.5) }}
                    >
                      [link]
                    </a>
                  )}
                </div>

                {techLine && (
                  <div
                    className="text-[#008c9e] font-semibold"
                    style={{ fontSize: fs(9.5) }}
                  >
                    {techLine}
                  </div>
                )}

                {descLines.length > 0 && (
                  <ul
                    className="list-disc list-outside pl-3.5 space-y-0.5 text-[#475569] leading-relaxed"
                    style={{ fontSize: fs(9.5) }}
                  >
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
    );

  const renderSkills = () =>
    validSkills.length > 0 && (
      <section data-section-type="skills">
        {!data.continuingSections?.includes('skills') && renderSectionHeader('Skills')}
        <div className="flex flex-wrap gap-1.5">
          {validSkills.map((skill, idx) => (
            <span
              key={idx}
              data-skill-chip="true"
              className="skill-chip inline-flex items-center px-2.5 py-0.5 rounded-[4px] bg-[#2e3d49] text-white font-medium tracking-wide border border-[#2e3d49]"
              style={{
                backgroundColor: '#2e3d49',
                color: '#ffffff',
                borderColor: '#2e3d49',
                display: 'inline-flex',
                WebkitPrintColorAdjust: 'exact',
                printColorAdjust: 'exact',
                fontSize: fs(9.5),
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </section>
    );

  const renderCertifications = () =>
    validCertifications.length > 0 && (
      <section data-section-type="certifications">
        {!data.continuingSections?.includes('certifications') && renderSectionHeader('Certificates')}
        <div className={config.entryGap}>
          {validCertifications.map((cert, idx) => (
            <div
              key={idx}
              data-entry-item="true"
              className="space-y-0.5"
              data-avoid-break="true"
              style={{ fontSize: fs(10) }}
            >
              <div
                className="font-bold text-[#1e293b] leading-tight"
                style={{ fontSize: fs(10) }}
              >
                {cert.name}
                {cert.issuer && (
                  <span className="font-normal text-[#475569]"> – {cert.issuer}</span>
                )}
              </div>
              {cert.description && (
                <p
                  className="text-[#64748b] italic leading-tight"
                  style={{ fontSize: fs(9.5) }}
                >
                  {cert.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    );

  const renderVolunteer = () =>
    validVolunteer.length > 0 && (
      <section data-section-type="volunteer">
        {!data.continuingSections?.includes('volunteer') && renderSectionHeader('Volunteer Experience')}
        <div className={config.entryGap}>
          {validVolunteer.map((v, idx) => (
            <div
              key={idx}
              data-entry-item="true"
              className="space-y-0.5"
              data-avoid-break="true"
              style={{ fontSize: fs(10) }}
            >
              <div
                className="font-bold text-[#1e293b] leading-tight"
                style={{ fontSize: fs(10) }}
              >
                {v.organization}
              </div>
              {(v.startDate || v.endDate) && (
                <div
                  className="text-[#0d9488] font-medium"
                  style={{ fontSize: fs(9.5) }}
                >
                  ({v.startDate} {v.startDate && v.endDate ? '–' : ''} {v.endDate})
                </div>
              )}
              {v.role && (
                <div
                  className="font-semibold text-[#334155] leading-tight"
                  style={{ fontSize: fs(9.5) }}
                >
                  {v.role}
                </div>
              )}
              {v.description && (
                <p
                  className="text-[#64748b] italic leading-tight whitespace-pre-line"
                  style={{ fontSize: fs(9.5) }}
                >
                  {v.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    );

  const renderEducation = () =>
    validEducation.length > 0 && (
      <section data-section-type="education">
        {!data.continuingSections?.includes('education') && renderSectionHeader('Education')}
        <div className={config.entryGap}>
          {validEducation.map((edu, idx) => (
            <div
              key={idx}
              data-entry-item="true"
              className="space-y-0.5"
              data-avoid-break="true"
              style={{ fontSize: fs(10) }}
            >
              <div
                className="font-bold text-[#1e293b] leading-tight"
                style={{ fontSize: fs(10) }}
              >
                {edu.degree}
                {edu.field && ` in ${edu.field}`}
              </div>
              <div
                className="text-[#475569] leading-tight"
                style={{ fontSize: fs(9.5) }}
              >
                {edu.institution}
                {(edu.startDate || edu.endDate) && (
                  <span className="text-[#0d9488] ml-1 font-medium">
                    ({edu.startDate} {edu.startDate && edu.endDate ? '–' : ''} {edu.endDate})
                  </span>
                )}
              </div>
              {edu.grade && (
                <div className="text-[#64748b]" style={{ fontSize: fs(9) }}>
                  Grade: {edu.grade}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    );

  const renderLanguages = () =>
    validLanguages.length > 0 && (
      <section data-section-type="languages">
        {!data.continuingSections?.includes('languages') && renderSectionHeader('Languages')}
        <div className="space-y-0.5">
          {validLanguages.map((lang, idx) => (
            <div
              key={idx}
              data-entry-item="true"
              className="leading-tight"
              style={{ fontSize: fs(10) }}
            >
              <span className="font-bold text-[#1e293b] block">{lang.language}</span>
              <span
                className="text-[#0d9488] font-medium italic"
                style={{ fontSize: fs(9.5) }}
              >
                {lang.proficiency}
              </span>
            </div>
          ))}
        </div>
      </section>
    );

  return (
    <article
      className="single-page-resume bg-white text-[#1e293b] min-h-0 font-sans shadow-none leading-normal selection:bg-teal-100 flex flex-col w-full"
      style={{
        fontFamily: 'var(--font-sans, "Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
        boxSizing: 'border-box',
        padding: config.padding,
        width: '100%',
        maxWidth: '100%',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
        // @ts-ignore
        '--fs': scale,
      }}
    >
      {/* --------------------------------------------------------------------
          Header Section (Novorésumé Signature 3-Block Header)
          Exact A4 Coordinate Proportion: Left 52% | Center 16% | Right 32%
          Suppressed on Page 2+
          -------------------------------------------------------------------- */}
      {pageNumber === 1 && (
        <header className={`border-b border-[#cbd5e1] ${config.headerMargin}`}>
        <div className="flex items-center justify-between gap-3">
          {/* Left Block: Clean Name, Title, Bio aligned flush left */}
          <div className="w-[52%] min-w-0">
            {personalInfo.fullName && (
              <div className="mb-1">
                <h1
                  className="font-bold tracking-tight text-[#2e3842] leading-tight"
                  style={{ fontSize: fs(25) }}
                >
                  {personalInfo.fullName}
                </h1>
              </div>
            )}

            {personalInfo.title && (
              <div
                className="font-semibold text-[#008c9e] tracking-wide mb-1.5"
                style={{ fontSize: fs(13) }}
              >
                {personalInfo.title}
              </div>
            )}

            {summary && summary.trim().length > 0 && (
              <p
                className="leading-relaxed text-[#475569] pr-2"
                style={{ fontSize: fs(10) }}
              >
                {summary}
              </p>
            )}
          </div>

          {/* Center Block: Profile Photo (interactive upload & preview) */}
          <div className={`w-[16%] flex flex-shrink-0 items-center justify-center ${personalInfo.photoUrl ? '' : 'no-print'}`}>
            <label
              className={`w-20 h-20 rounded-full overflow-hidden border-[2px] border-[#008c9e] shadow-xs cursor-pointer group relative flex items-center justify-center ${
                personalInfo.photoUrl ? 'bg-white' : 'bg-teal-50/60 border-dashed border-[#008c9e]/70 hover:bg-teal-50'
              }`}
              style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
              title={personalInfo.photoUrl ? 'Click to change photo' : 'Click to upload photo'}
            >
              {personalInfo.photoUrl ? (
                <img
                  src={personalInfo.photoUrl}
                  alt={personalInfo.fullName || 'Profile'}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="text-center p-1 text-[#0d9488]">
                  <svg className="w-5 h-5 mx-auto opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-[8.5px] font-medium block mt-0.5">+ Photo</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[9px] font-semibold no-print">
                {personalInfo.photoUrl ? 'Change' : 'Upload'}
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 4 * 1024 * 1024) {
                    alert('Please select an image smaller than 4MB.');
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = (evt) => {
                    const result = evt.target?.result as string;
                    if (result) {
                      window.dispatchEvent(new CustomEvent('resume:update-photo', { detail: result }));
                    }
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </label>
          </div>

          {/* Right Block: Right-Aligned Contact Details with Icons */}
          {hasContact && (
            <div
              className="w-[32%] flex flex-col items-end justify-center gap-1 text-[#334155]"
              style={{ fontSize: fs(10) }}
            >
              {personalInfo.email && (
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="inline-flex items-center gap-1.5 hover:text-[#0d9488] transition-colors"
                >
                  <span className="truncate max-w-[180px]">{personalInfo.email}</span>
                  <svg className="w-3.5 h-3.5 text-[#0d9488] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              )}

              {personalInfo.phone && (
                <div className="inline-flex items-center gap-1.5">
                  <span>{personalInfo.phone}</span>
                  <svg className="w-3.5 h-3.5 text-[#0d9488] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
              )}

              {personalInfo.location && (
                <div className="inline-flex items-center gap-1.5">
                  <span>{personalInfo.location}</span>
                  <svg className="w-3.5 h-3.5 text-[#0d9488] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              )}

              {personalInfo.links &&
                personalInfo.links
                  .filter((l) => l.url.trim())
                  .map((link, idx) => {
                    const isLinkedIn = link.label?.toLowerCase().includes('linkedin') || link.url.includes('linkedin');
                    const isGitHub = link.label?.toLowerCase().includes('github') || link.url.includes('github');
                    const cleanUrl = link.url.replace(/^https?:\/\/(www\.)?/, '');

                    return (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 hover:text-[#008c9e] transition-colors"
                      >
                        <span className="truncate max-w-[180px]">{cleanUrl}</span>
                        {isLinkedIn ? (
                          <span
                            className="inline-flex items-center justify-center w-3.5 h-3.5 bg-[#008c9e] text-white rounded-[2px] text-[8.5px] font-bold flex-shrink-0"
                            style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
                          >
                            in
                          </span>
                        ) : isGitHub ? (
                          <svg className="w-3.5 h-3.5 text-[#008c9e] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 text-[#008c9e] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        )}
                      </a>
                    );
                  })}
            </div>
          )}
        </div>
      </header>
      )}

      {/* --------------------------------------------------------------------
          2-Column Body Layout with Dynamic Column Split ("Moving Bar")
          -------------------------------------------------------------------- */}
      <div
        data-novoresume-grid="true"
        className="flex-1 items-start"
        style={{
          display: 'grid',
          gridTemplateColumns: `${columnSplit}fr ${100 - columnSplit}fr`,
          gap: '1.75rem',
        }}
      >
        {/* Main Column (Left) */}
        <div className={`flex flex-col min-w-0 break-words ${config.columnGap}`}>
          {renderExperience()}
          {renderProjects()}
          {placeEducationOnLeft && renderEducation()}
          {placeCertificationsOnLeft && renderCertifications()}
        </div>

        {/* Sidebar Column (Right) */}
        <div className={`flex flex-col min-w-0 break-words ${config.columnGap}`}>
          {renderSkills()}
          {!placeCertificationsOnLeft && renderCertifications()}
          {renderVolunteer()}
          {!placeEducationOnLeft && renderEducation()}
          {renderLanguages()}
        </div>
      </div>
    </article>
  );
}

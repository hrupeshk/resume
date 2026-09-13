import React, { useState } from 'react';
import type { ProjectEntry, CertificationEntry, LanguageEntry, VolunteerEntry } from '../../lib/schema';

interface SkillsProjectsFormProps {
  skills: string[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  languages?: LanguageEntry[];
  volunteer?: VolunteerEntry[];
  onChangeSkills: (skills: string[]) => void;
  onChangeProjects: (projects: ProjectEntry[]) => void;
  onChangeCertifications: (certifications: CertificationEntry[]) => void;
  onChangeLanguages?: (languages: LanguageEntry[]) => void;
  onChangeVolunteer?: (volunteer: VolunteerEntry[]) => void;
}

export default function SkillsProjectsForm({
  skills,
  projects,
  certifications,
  languages = [],
  volunteer = [],
  onChangeSkills,
  onChangeProjects,
  onChangeCertifications,
  onChangeLanguages,
  onChangeVolunteer,
}: SkillsProjectsFormProps) {
  const [skillInput, setSkillInput] = useState('');

  // Skills handlers
  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (!skills.includes(trimmed)) {
      onChangeSkills([...skills, trimmed]);
    }
    setSkillInput('');
  };

  const handleKeyDownSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (index: number) => {
    onChangeSkills(skills.filter((_, i) => i !== index));
  };

  // Projects handlers
  const handleAddProject = () => {
    onChangeProjects([
      ...projects,
      { name: '', description: '', link: '' },
    ]);
  };

  const handleUpdateProject = (index: number, field: keyof ProjectEntry, value: string) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    onChangeProjects(updated);
  };

  const handleRemoveProject = (index: number) => {
    onChangeProjects(projects.filter((_, i) => i !== index));
  };

  // Certifications handlers
  const handleAddCert = () => {
    onChangeCertifications([
      ...certifications,
      { name: '', issuer: '', year: '', description: '' },
    ]);
  };

  const handleUpdateCert = (index: number, field: keyof CertificationEntry, value: string) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    onChangeCertifications(updated);
  };

  const handleRemoveCert = (index: number) => {
    onChangeCertifications(certifications.filter((_, i) => i !== index));
  };

  // Languages handlers
  const handleAddLanguage = () => {
    if (onChangeLanguages) {
      onChangeLanguages([
        ...languages,
        { language: '', proficiency: 'Full Professional' },
      ]);
    }
  };

  const handleUpdateLanguage = (index: number, field: keyof LanguageEntry, value: string) => {
    if (onChangeLanguages) {
      const updated = [...languages];
      updated[index] = { ...updated[index], [field]: value };
      onChangeLanguages(updated);
    }
  };

  const handleRemoveLanguage = (index: number) => {
    if (onChangeLanguages) {
      onChangeLanguages(languages.filter((_, i) => i !== index));
    }
  };

  // Volunteer handlers
  const handleAddVolunteer = () => {
    if (onChangeVolunteer) {
      onChangeVolunteer([
        ...volunteer,
        { organization: '', role: '', startDate: '', endDate: '', description: '' },
      ]);
    }
  };

  const handleUpdateVolunteer = (index: number, field: keyof VolunteerEntry, value: string) => {
    if (onChangeVolunteer) {
      const updated = [...volunteer];
      updated[index] = { ...updated[index], [field]: value };
      onChangeVolunteer(updated);
    }
  };

  const handleRemoveVolunteer = (index: number) => {
    if (onChangeVolunteer) {
      onChangeVolunteer(volunteer.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-8 text-xs sm:text-sm">
      {/* 1. Skills Section */}
      <section className="space-y-3">
        <div className="border-b border-hairline pb-2">
          <h3 className="text-base font-semibold text-ink">Skills & Technologies</h3>
          <p className="text-xs text-mute mt-0.5">
            Press Enter or comma to add each skill tag.
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleKeyDownSkill}
            placeholder="Type a skill (e.g. React, Python, Django, Docker) and press Enter"
            className="flex-1 px-3 py-2 rounded-sm border border-hairline bg-canvas-elevated text-ink text-xs focus:outline-none focus:border-ink"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="px-4 py-2 rounded-sm bg-primary text-on-primary text-xs font-medium hover:opacity-90 transition-opacity"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {skills.map((skill, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-canvas-elevated border border-hairline text-ink text-xs font-mono"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(idx)}
                className="text-mute hover:text-error transition-colors"
                title="Remove skill"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </section>

      {/* 2. Key Projects Section */}
      <section className="space-y-4 pt-4 border-t border-hairline">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-ink">Notable Projects</h3>
            <p className="text-xs text-mute mt-0.5">
              Open-source repositories, full-stack applications, and side projects.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddProject}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-sm bg-primary text-on-primary text-xs font-medium hover:opacity-90 transition-opacity"
          >
            + Add Project
          </button>
        </div>

        {projects.length === 0 ? (
          <p className="text-xs text-mute italic py-2">
            No projects added. (This section will be omitted from the resume).
          </p>
        ) : (
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div
                key={idx}
                className="p-4 rounded-sm border border-hairline bg-canvas space-y-3"
              >
                <div className="flex items-center justify-between border-b border-hairline pb-2">
                  <span className="text-xs font-mono font-medium text-mute uppercase">
                    Project #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveProject(idx)}
                    className="text-xs text-mute hover:text-error transition-colors"
                  >
                    Delete Project
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-body mb-1">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={proj.name}
                      onChange={(e) => handleUpdateProject(idx, 'name', e.target.value)}
                      placeholder="e.g. Cars Club – Vehicle Resale Platform"
                      className="w-full px-3 py-1.5 rounded-sm border border-hairline bg-canvas-elevated text-ink text-xs focus:outline-none focus:border-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-body mb-1">
                      Link / Repository URL
                    </label>
                    <input
                      type="url"
                      value={proj.link || ''}
                      onChange={(e) => handleUpdateProject(idx, 'link', e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full px-3 py-1.5 rounded-sm border border-hairline bg-canvas-elevated text-ink text-xs focus:outline-none focus:border-ink"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-body mb-1">
                      Tech Stack & Description (e.g. Tech: React, Tailwind, Django...)
                    </label>
                    <textarea
                      rows={3}
                      value={proj.description}
                      onChange={(e) => handleUpdateProject(idx, 'description', e.target.value)}
                      placeholder="Tech: ReactJS, Tailwind CSS, Django, MongoDB, REST API&#10;Developed a full-stack vehicle resale web app enabling dynamic filtering..."
                      className="w-full px-3 py-1.5 rounded-sm border border-hairline bg-canvas-elevated text-ink text-xs focus:outline-none focus:border-ink leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Certifications Section */}
      <section className="space-y-4 pt-4 border-t border-hairline">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-ink">Certifications</h3>
            <p className="text-xs text-mute mt-0.5">
              Industry credentials, Coursera, NPTEL, AWS certifications.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddCert}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-sm bg-primary text-on-primary text-xs font-medium hover:opacity-90 transition-opacity"
          >
            + Add Certification
          </button>
        </div>

        {certifications.length === 0 ? (
          <p className="text-xs text-mute italic py-2">
            No certifications added. (This section will be omitted from the resume).
          </p>
        ) : (
          <div className="space-y-3">
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                className="p-3 rounded-sm border border-hairline bg-canvas space-y-2"
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => handleUpdateCert(idx, 'name', e.target.value)}
                      placeholder="Certificate Title (e.g. Google IT Support)"
                      className="w-full px-3 py-1.5 rounded-sm border border-hairline bg-canvas-elevated text-ink text-xs focus:outline-none focus:border-ink"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => handleUpdateCert(idx, 'issuer', e.target.value)}
                      placeholder="Issuer (e.g. Coursera, NPTEL)"
                      className="w-full px-3 py-1.5 rounded-sm border border-hairline bg-canvas-elevated text-ink text-xs focus:outline-none focus:border-ink"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={cert.year}
                      onChange={(e) => handleUpdateCert(idx, 'year', e.target.value)}
                      placeholder="Year (e.g. 2024)"
                      className="w-full px-3 py-1.5 rounded-sm border border-hairline bg-canvas-elevated text-ink text-xs focus:outline-none focus:border-ink"
                    />
                  </div>
                  <div className="sm:col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveCert(idx)}
                      className="px-2 py-1 text-xs text-mute hover:text-error"
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    value={cert.description || ''}
                    onChange={(e) => handleUpdateCert(idx, 'description', e.target.value)}
                    placeholder="Brief description or competencies gained (optional)"
                    className="w-full px-3 py-1 rounded-sm border border-hairline bg-canvas-elevated text-ink text-[11px] focus:outline-none focus:border-ink"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Languages Section */}
      <section className="space-y-4 pt-4 border-t border-hairline">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-ink">Languages</h3>
            <p className="text-xs text-mute mt-0.5">
              Spoken and written languages with proficiency level.
            </p>
          </div>
          {onChangeLanguages && (
            <button
              type="button"
              onClick={handleAddLanguage}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-sm bg-primary text-on-primary text-xs font-medium hover:opacity-90 transition-opacity"
            >
              + Add Language
            </button>
          )}
        </div>

        {languages.length === 0 ? (
          <p className="text-xs text-mute italic py-2">
            No languages added. (This section will be omitted from the resume).
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {languages.map((lang, idx) => (
              <div
                key={idx}
                className="p-3 rounded-sm border border-hairline bg-canvas flex items-center gap-2"
              >
                <input
                  type="text"
                  value={lang.language}
                  onChange={(e) => handleUpdateLanguage(idx, 'language', e.target.value)}
                  placeholder="Language (e.g. English, Hindi)"
                  className="w-1/2 px-2.5 py-1.5 rounded-sm border border-hairline bg-canvas-elevated text-ink text-xs focus:outline-none focus:border-ink"
                />
                <select
                  value={lang.proficiency}
                  onChange={(e) => handleUpdateLanguage(idx, 'proficiency', e.target.value)}
                  className="w-1/2 px-2 py-1.5 rounded-sm border border-hairline bg-canvas-elevated text-ink text-xs focus:outline-none focus:border-ink cursor-pointer"
                >
                  <option value="Native or Bilingual">Native or Bilingual</option>
                  <option value="Full Professional">Full Professional</option>
                  <option value="Professional Working">Professional Working</option>
                  <option value="Conversational">Conversational</option>
                  <option value="Elementary">Elementary</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleRemoveLanguage(idx)}
                  className="px-2 py-1 text-xs text-mute hover:text-error"
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Volunteer & Leadership Experience Section */}
      <section className="space-y-4 pt-4 border-t border-hairline">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-ink">Volunteer & Leadership</h3>
            <p className="text-xs text-mute mt-0.5">
              NSS, clubs, open-source initiatives, community outreach.
            </p>
          </div>
          {onChangeVolunteer && (
            <button
              type="button"
              onClick={handleAddVolunteer}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-sm bg-primary text-on-primary text-xs font-medium hover:opacity-90 transition-opacity"
            >
              + Add Volunteer Role
            </button>
          )}
        </div>

        {volunteer.length === 0 ? (
          <p className="text-xs text-mute italic py-2">
            No volunteer experience added. (This section will be omitted from the resume).
          </p>
        ) : (
          <div className="space-y-3">
            {volunteer.map((v, idx) => (
              <div
                key={idx}
                className="p-4 rounded-sm border border-hairline bg-canvas space-y-3"
              >
                <div className="flex items-center justify-between border-b border-hairline pb-2">
                  <span className="text-xs font-mono font-medium text-mute uppercase">
                    Volunteer Entry #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveVolunteer(idx)}
                    className="text-xs text-mute hover:text-error transition-colors"
                  >
                    Delete Entry
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-body mb-1">
                      Organization
                    </label>
                    <input
                      type="text"
                      value={v.organization}
                      onChange={(e) => handleUpdateVolunteer(idx, 'organization', e.target.value)}
                      placeholder="e.g. National Service Scheme (NSS)"
                      className="w-full px-3 py-1.5 rounded-sm border border-hairline bg-canvas-elevated text-ink text-xs focus:outline-none focus:border-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-body mb-1">
                      Role / Title
                    </label>
                    <input
                      type="text"
                      value={v.role || ''}
                      onChange={(e) => handleUpdateVolunteer(idx, 'role', e.target.value)}
                      placeholder="e.g. Leadership & Volunteer Experience"
                      className="w-full px-3 py-1.5 rounded-sm border border-hairline bg-canvas-elevated text-ink text-xs focus:outline-none focus:border-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-body mb-1">
                      Start Date
                    </label>
                    <input
                      type="text"
                      value={v.startDate || ''}
                      onChange={(e) => handleUpdateVolunteer(idx, 'startDate', e.target.value)}
                      placeholder="e.g. 02/2022"
                      className="w-full px-3 py-1.5 rounded-sm border border-hairline bg-canvas-elevated text-ink text-xs focus:outline-none focus:border-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-body mb-1">
                      End Date
                    </label>
                    <input
                      type="text"
                      value={v.endDate || ''}
                      onChange={(e) => handleUpdateVolunteer(idx, 'endDate', e.target.value)}
                      placeholder="e.g. 12/2023"
                      className="w-full px-3 py-1.5 rounded-sm border border-hairline bg-canvas-elevated text-ink text-xs focus:outline-none focus:border-ink"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-body mb-1">
                      Description & Impact
                    </label>
                    <textarea
                      rows={2}
                      value={v.description || ''}
                      onChange={(e) => handleUpdateVolunteer(idx, 'description', e.target.value)}
                      placeholder="Actively served in the NSS, demonstrating leadership and organizing events..."
                      className="w-full px-3 py-1.5 rounded-sm border border-hairline bg-canvas-elevated text-ink text-xs focus:outline-none focus:border-ink leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

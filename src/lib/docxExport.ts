import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ExternalHyperlink,
  ImageRun,
} from 'docx';
import type {
  DocumentData,
  ResumeDocument,
  ResumePersonalInfo,
  EducationEntry,
  ExperienceEntry,
  ProjectEntry,
  CertificationEntry,
  AwardEntry,
  ReferenceEntry,
  LanguageEntry,
  VolunteerEntry,
  DeclarationSection,
} from './schema';
import { isResumeDocument } from './schema';

/**
 * Standard borderless table border definition for invisible alignment grids.
 */
const BORDER_NONE = {
  top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  insideVertical: { style: BorderStyle.NONE, size: 0, color: 'auto' },
};

/**
 * Theme color presets tailored for resume categories and templates.
 */
interface ThemeColors {
  primary: string; // Document title / Candidate Name
  accent: string; // Section header underline / category tags
  text: string; // Main body copy
  muted: string; // Dates, subtitles, meta text
  border: string; // Accent separator line
  font: string; // Standard Word font
}

function getTemplateTheme(category: string, templateId?: string): ThemeColors {
  switch (templateId) {
    case 'faang-classic-01':
      return {
        primary: '0F172A',
        accent: '0F172A',
        text: '1E293B',
        muted: '475569',
        border: '0F172A',
        font: 'Arial',
      };
    case 'executive-mba-01':
      return {
        primary: '1E3A8A',
        accent: '1E3A8A',
        text: '1E293B',
        muted: '475569',
        border: '1E3A8A',
        font: 'Calibri',
      };
    case 'flow-developer-01':
      return {
        primary: '0369A1',
        accent: '0284C7',
        text: '1E293B',
        muted: '475569',
        border: '0284C7',
        font: 'Calibri',
      };
    case 'compact-mono-01':
      return {
        primary: '0F172A',
        accent: '334155',
        text: '1E293B',
        muted: '64748B',
        border: '334155',
        font: 'Calibri',
      };
    case 'minimal-blue-01':
      return {
        primary: '1D4ED8',
        accent: '2563EB',
        text: '1E293B',
        muted: '475569',
        border: '2563EB',
        font: 'Calibri',
      };
    case 'hotel-hospitality-private-02':
      return {
        primary: '1E293B',
        accent: '0F766E',
        text: '1E293B',
        muted: '475569',
        border: '0F766E',
        font: 'Calibri',
      };
    case 'commercial-operations-private-03':
      return {
        primary: '111827',
        accent: '374151',
        text: '1F2937',
        muted: '4B5563',
        border: '374151',
        font: 'Calibri',
      };
    case 'indian-classic-private-01':
    default:
      if (category === 'non_tech_resume') {
        return {
          primary: '1E3A8A',
          accent: '1E40AF',
          text: '1E293B',
          muted: '475569',
          border: '1E40AF',
          font: 'Calibri',
        };
      }
      if (category === 'private_job_resume') {
        return {
          primary: '111827',
          accent: '1F2937',
          text: '1F2937',
          muted: '4B5563',
          border: '111827',
          font: 'Calibri',
        };
      }
      return {
        primary: '0F172A',
        accent: '2563EB',
        text: '1E293B',
        muted: '475569',
        border: '2563EB',
        font: 'Calibri',
      };
  }
}

/**
 * Converts a base64 Data URL to a Uint8Array for image embedding in docx.
 */
function base64ToUint8Array(dataUrl: string): Uint8Array | null {
  try {
    if (!dataUrl || !dataUrl.startsWith('data:image/')) return null;
    const parts = dataUrl.split(',');
    if (parts.length < 2) return null;
    const binary = atob(parts[1]);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

/**
 * Creates a styled section header with an accent bottom border.
 * Adheres to Section 2 product principle: Never render an empty section heading.
 */
function createSectionHeader(title: string, theme: ThemeColors): Paragraph {
  return new Paragraph({
    spacing: { before: 200, after: 100 },
    border: {
      bottom: {
        color: theme.border,
        space: 4,
        style: BorderStyle.SINGLE,
        size: 8, // 1pt border
      },
    },
    children: [
      new TextRun({
        text: title.toUpperCase(),
        bold: true,
        size: 22, // 11pt
        color: theme.primary,
        font: theme.font,
      }),
    ],
  });
}

/**
 * Creates a 2-column borderless table row:
 * Left: Title / Role / Degree
 * Right: Date range or Location (Right aligned)
 */
function createTwoColumnHeaderRow(
  leftRuns: TextRun[],
  rightText: string,
  theme: ThemeColors,
  isFirst: boolean = false
): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: BORDER_NONE,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 74, type: WidthType.PERCENTAGE },
            borders: BORDER_NONE,
            children: [
              new Paragraph({
                spacing: { before: isFirst ? 60 : 120, after: 30 },
                children: leftRuns,
              }),
            ],
          }),
          new TableCell({
            width: { size: 26, type: WidthType.PERCENTAGE },
            borders: BORDER_NONE,
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: isFirst ? 60 : 120, after: 30 },
                children: rightText
                  ? [
                      new TextRun({
                        text: rightText,
                        italics: true,
                        size: 20, // 10pt
                        color: theme.muted,
                        font: theme.font,
                      }),
                    ]
                  : [],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

/**
 * Generates an editable Microsoft Word .docx Document for a given ResumeDocument.
 */
export function generateResumeDocx(doc: ResumeDocument): Document {
  const theme = getTemplateTheme(doc.category, doc.templateId);
  const { personalInfo, summary, sections } = doc;
  const children: (Paragraph | Table)[] = [];

  // -------------------------------------------------------------------------
  // 1. Candidate Header (Name, Title, Contact Info, Optional Photo)
  // -------------------------------------------------------------------------
  const photoBytes = personalInfo.photoUrl ? base64ToUint8Array(personalInfo.photoUrl) : null;

  // Build Contact Information Run elements
  const contactRuns: (TextRun | ExternalHyperlink)[] = [];
  const contactParts: { text: string; url?: string; isEmail?: boolean }[] = [];

  if (personalInfo.phone?.trim()) {
    contactParts.push({ text: personalInfo.phone.trim() });
  }
  if (personalInfo.email?.trim()) {
    contactParts.push({ text: personalInfo.email.trim(), url: personalInfo.email.trim(), isEmail: true });
  }
  if (personalInfo.location?.trim()) {
    contactParts.push({ text: personalInfo.location.trim() });
  }
  if (personalInfo.links && personalInfo.links.length > 0) {
    personalInfo.links.forEach((link) => {
      if (link.url?.trim()) {
        contactParts.push({ text: link.label || link.url.trim(), url: link.url.trim() });
      }
    });
  }

  contactParts.forEach((part, idx) => {
    if (idx > 0) {
      contactRuns.push(
        new TextRun({
          text: '  •  ',
          color: '94A3B8',
          size: 19,
          font: theme.font,
        })
      );
    }
    if (part.url) {
      const href = part.isEmail ? `mailto:${part.url}` : part.url.startsWith('http') ? part.url : `https://${part.url}`;
      contactRuns.push(
        new ExternalHyperlink({
          children: [
            new TextRun({
              text: part.text,
              color: theme.accent,
              underline: {},
              size: 19,
              font: theme.font,
            }),
          ],
          link: href,
        })
      );
    } else {
      contactRuns.push(
        new TextRun({
          text: part.text,
          color: theme.muted,
          size: 19,
          font: theme.font,
        })
      );
    }
  });

  const headerParagraphs: Paragraph[] = [
    new Paragraph({
      spacing: { before: 0, after: 40 },
      children: [
        new TextRun({
          text: personalInfo.fullName || 'Candidate Name',
          bold: true,
          size: 42, // 21pt
          color: theme.primary,
          font: theme.font,
        }),
      ],
    }),
  ];

  if (personalInfo.title?.trim()) {
    headerParagraphs.push(
      new Paragraph({
        spacing: { before: 0, after: 60 },
        children: [
          new TextRun({
            text: personalInfo.title.trim(),
            size: 23, // 11.5pt
            color: theme.accent,
            font: theme.font,
          }),
        ],
      })
    );
  }

  if (contactRuns.length > 0) {
    headerParagraphs.push(
      new Paragraph({
        spacing: { before: 20, after: 120 },
        children: contactRuns,
      })
    );
  }

  // If candidate has a photo (common in Indian private sector resumes), place in 2-column header
  if (photoBytes) {
    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: BORDER_NONE,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 82, type: WidthType.PERCENTAGE },
                borders: BORDER_NONE,
                children: headerParagraphs,
              }),
              new TableCell({
                width: { size: 18, type: WidthType.PERCENTAGE },
                borders: BORDER_NONE,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                      new ImageRun({
                        data: photoBytes,
                        transformation: { width: 75, height: 75 },
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    );
  } else {
    children.push(...headerParagraphs);
  }

  // -------------------------------------------------------------------------
  // 2. Professional Summary / Career Objective
  // -------------------------------------------------------------------------
  if (summary && summary.trim().length > 0) {
    const summaryHeading = doc.category === 'private_job_resume' ? 'Career Objective' : 'Professional Summary';
    children.push(createSectionHeader(summaryHeading, theme));
    children.push(
      new Paragraph({
        spacing: { before: 40, after: 100, line: 260 },
        children: [
          new TextRun({
            text: summary.trim(),
            size: 21, // 10.5pt
            color: theme.text,
            font: theme.font,
          }),
        ],
      })
    );
  }

  // -------------------------------------------------------------------------
  // 3. Work Experience
  // -------------------------------------------------------------------------
  const validExperience = (sections.experience || []).filter(
    (exp) => exp.company?.trim() || exp.role?.trim()
  );

  if (validExperience.length > 0) {
    children.push(createSectionHeader('Work Experience', theme));
    validExperience.forEach((exp, idx) => {
      const leftRuns: TextRun[] = [];
      if (exp.role?.trim()) {
        leftRuns.push(
          new TextRun({
            text: exp.role.trim(),
            bold: true,
            size: 21,
            color: theme.primary,
            font: theme.font,
          })
        );
      }
      if (exp.company?.trim()) {
        leftRuns.push(
          new TextRun({
            text: exp.role?.trim() ? `  |  ${exp.company.trim()}` : exp.company.trim(),
            size: 21,
            color: theme.text,
            font: theme.font,
          })
        );
      }

      const dateStr =
        exp.startDate?.trim() || exp.endDate?.trim()
          ? `${exp.startDate?.trim() || ''}${exp.startDate && exp.endDate ? ' – ' : ''}${exp.endDate?.trim() || ''}`
          : '';

      children.push(createTwoColumnHeaderRow(leftRuns, dateStr, theme, idx === 0));

      const validBullets = (exp.bullets || []).filter((b) => b && b.trim().length > 0);
      validBullets.forEach((bullet) => {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { before: 20, after: 40, line: 260 },
            children: [
              new TextRun({
                text: bullet.trim(),
                size: 21,
                color: theme.text,
                font: theme.font,
              }),
            ],
          })
        );
      });
    });
  }

  // -------------------------------------------------------------------------
  // 4. Education
  // -------------------------------------------------------------------------
  const validEducation = (sections.education || []).filter(
    (edu) => edu.institution?.trim() || edu.degree?.trim()
  );

  if (validEducation.length > 0) {
    children.push(createSectionHeader('Education', theme));
    validEducation.forEach((edu, idx) => {
      const leftRuns: TextRun[] = [];
      const degreeText = `${edu.degree?.trim() || ''}${edu.field?.trim() ? ` in ${edu.field.trim()}` : ''}`.trim();
      if (degreeText) {
        leftRuns.push(
          new TextRun({
            text: degreeText,
            bold: true,
            size: 21,
            color: theme.primary,
            font: theme.font,
          })
        );
      }
      if (edu.institution?.trim()) {
        leftRuns.push(
          new TextRun({
            text: degreeText ? `  |  ${edu.institution.trim()}` : edu.institution.trim(),
            size: 21,
            color: theme.text,
            font: theme.font,
          })
        );
      }
      if (edu.grade?.trim()) {
        leftRuns.push(
          new TextRun({
            text: ` (Grade/GPA: ${edu.grade.trim()})`,
            italics: true,
            size: 19,
            color: theme.muted,
            font: theme.font,
          })
        );
      }

      const dateStr =
        edu.startDate?.trim() || edu.endDate?.trim()
          ? `${edu.startDate?.trim() || ''}${edu.startDate && edu.endDate ? ' – ' : ''}${edu.endDate?.trim() || ''}`
          : '';

      children.push(createTwoColumnHeaderRow(leftRuns, dateStr, theme, idx === 0));
    });
  }

  // -------------------------------------------------------------------------
  // 5. Technical & Professional Skills
  // -------------------------------------------------------------------------
  const validSkills = (sections.skills || []).filter((s) => s && s.trim().length > 0);
  if (validSkills.length > 0) {
    const skillsHeading = doc.category === 'tech_resume' ? 'Technical Skills' : 'Core Competencies & Skills';
    children.push(createSectionHeader(skillsHeading, theme));

    // Check if user specified categorized skills (e.g. "Languages: Python, Go")
    const hasColon = validSkills.some((s) => s.includes(':'));
    if (hasColon) {
      validSkills.forEach((skillLine) => {
        const colonIdx = skillLine.indexOf(':');
        if (colonIdx > 0) {
          const cat = skillLine.substring(0, colonIdx).trim();
          const items = skillLine.substring(colonIdx + 1).trim();
          children.push(
            new Paragraph({
              spacing: { before: 20, after: 40, line: 260 },
              children: [
                new TextRun({
                  text: `${cat}: `,
                  bold: true,
                  size: 21,
                  color: theme.primary,
                  font: theme.font,
                }),
                new TextRun({
                  text: items,
                  size: 21,
                  color: theme.text,
                  font: theme.font,
                }),
              ],
            })
          );
        } else {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { before: 20, after: 40, line: 260 },
              children: [
                new TextRun({
                  text: skillLine.trim(),
                  size: 21,
                  color: theme.text,
                  font: theme.font,
                }),
              ],
            })
          );
        }
      });
    } else {
      // Clean comma-separated or inline bullet strip
      children.push(
        new Paragraph({
          spacing: { before: 40, after: 60, line: 260 },
          children: [
            new TextRun({
              text: 'Skills: ',
              bold: true,
              size: 21,
              color: theme.primary,
              font: theme.font,
            }),
            new TextRun({
              text: validSkills.join('  •  '),
              size: 21,
              color: theme.text,
              font: theme.font,
            }),
          ],
        })
      );
    }
  }

  // -------------------------------------------------------------------------
  // 6. Key Projects (Tech & Professional)
  // -------------------------------------------------------------------------
  const validProjects = (sections.projects || []).filter((p) => p.name?.trim());
  if (validProjects.length > 0) {
    children.push(createSectionHeader('Key Projects', theme));
    validProjects.forEach((proj, idx) => {
      const leftRuns: (TextRun | ExternalHyperlink)[] = [
        new TextRun({
          text: proj.name.trim(),
          bold: true,
          size: 21,
          color: theme.primary,
          font: theme.font,
        }),
      ];

      if (proj.link?.trim()) {
        const linkHref = proj.link.startsWith('http') ? proj.link.trim() : `https://${proj.link.trim()}`;
        leftRuns.push(
          new TextRun({ text: '  [', size: 19, color: '94A3B8', font: theme.font }),
          new ExternalHyperlink({
            children: [
              new TextRun({
                text: 'Link',
                color: theme.accent,
                underline: {},
                size: 19,
                font: theme.font,
              }),
            ],
            link: linkHref,
          }),
          new TextRun({ text: ']', size: 19, color: '94A3B8', font: theme.font })
        );
      }

      children.push(
        new Paragraph({
          spacing: { before: idx === 0 ? 60 : 120, after: 30 },
          children: leftRuns,
        })
      );

      if (proj.description?.trim()) {
        const lines = proj.description
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean);

        lines.forEach((line) => {
          // Check if tech stack line
          const isTech = /^(tech|technologies|tech\s+stack):/i.test(line);
          if (isTech) {
            children.push(
              new Paragraph({
                spacing: { before: 20, after: 40, line: 260 },
                children: [
                  new TextRun({
                    text: line,
                    italics: true,
                    size: 20,
                    color: theme.muted,
                    font: theme.font,
                  }),
                ],
              })
            );
          } else {
            const cleanBullet = line.replace(/^[-•*›]\s*/, '').trim();
            children.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { before: 20, after: 40, line: 260 },
                children: [
                  new TextRun({
                    text: cleanBullet,
                    size: 21,
                    color: theme.text,
                    font: theme.font,
                  }),
                ],
              })
            );
          }
        });
      }
    });
  }

  // -------------------------------------------------------------------------
  // 7. Certifications & Training
  // -------------------------------------------------------------------------
  const validCerts = (sections.certifications || []).filter((c) => c.name?.trim());
  if (validCerts.length > 0) {
    children.push(createSectionHeader('Certifications & Licenses', theme));
    validCerts.forEach((cert, idx) => {
      const leftRuns: TextRun[] = [
        new TextRun({
          text: cert.name.trim(),
          bold: true,
          size: 21,
          color: theme.primary,
          font: theme.font,
        }),
      ];
      if (cert.issuer?.trim()) {
        leftRuns.push(
          new TextRun({
            text: `  |  ${cert.issuer.trim()}`,
            size: 21,
            color: theme.text,
            font: theme.font,
          })
        );
      }
      if (cert.description?.trim()) {
        leftRuns.push(
          new TextRun({
            text: ` (${cert.description.trim()})`,
            italics: true,
            size: 19,
            color: theme.muted,
            font: theme.font,
          })
        );
      }

      children.push(createTwoColumnHeaderRow(leftRuns, cert.year?.trim() || '', theme, idx === 0));
    });
  }

  // -------------------------------------------------------------------------
  // 8. Awards & Honors
  // -------------------------------------------------------------------------
  const validAwards = (sections.awards || []).filter((a) => a.title?.trim());
  if (validAwards.length > 0) {
    children.push(createSectionHeader('Awards & Honors', theme));
    validAwards.forEach((award, idx) => {
      const leftRuns: TextRun[] = [
        new TextRun({
          text: award.title.trim(),
          bold: true,
          size: 21,
          color: theme.primary,
          font: theme.font,
        }),
      ];
      if (award.issuer?.trim()) {
        leftRuns.push(
          new TextRun({
            text: `  |  ${award.issuer.trim()}`,
            size: 21,
            color: theme.text,
            font: theme.font,
          })
        );
      }
      if (award.description?.trim()) {
        leftRuns.push(
          new TextRun({
            text: ` (${award.description.trim()})`,
            italics: true,
            size: 19,
            color: theme.muted,
            font: theme.font,
          })
        );
      }

      children.push(createTwoColumnHeaderRow(leftRuns, award.year?.trim() || '', theme, idx === 0));
    });
  }

  // -------------------------------------------------------------------------
  // 9. Volunteer & Leadership
  // -------------------------------------------------------------------------
  const validVol = (sections.volunteer || []).filter((v) => v.organization?.trim());
  if (validVol.length > 0) {
    children.push(createSectionHeader('Leadership & Volunteer Experience', theme));
    validVol.forEach((vol, idx) => {
      const leftRuns: TextRun[] = [
        new TextRun({
          text: vol.organization.trim(),
          bold: true,
          size: 21,
          color: theme.primary,
          font: theme.font,
        }),
      ];
      if (vol.role?.trim()) {
        leftRuns.push(
          new TextRun({
            text: `  |  ${vol.role.trim()}`,
            size: 21,
            color: theme.text,
            font: theme.font,
          })
        );
      }

      const dateStr =
        vol.startDate?.trim() || vol.endDate?.trim()
          ? `${vol.startDate?.trim() || ''}${vol.startDate && vol.endDate ? ' – ' : ''}${vol.endDate?.trim() || ''}`
          : '';

      children.push(createTwoColumnHeaderRow(leftRuns, dateStr, theme, idx === 0));

      if (vol.description?.trim()) {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { before: 20, after: 40, line: 260 },
            children: [
              new TextRun({
                text: vol.description.trim(),
                size: 21,
                color: theme.text,
                font: theme.font,
              }),
            ],
          })
        );
      }
    });
  }

  // -------------------------------------------------------------------------
  // 10. Languages Known
  // -------------------------------------------------------------------------
  const validLangs = (sections.languages || []).filter((l) => l.language?.trim());
  if (validLangs.length > 0) {
    children.push(createSectionHeader('Languages', theme));
    const langStrings = validLangs.map((l) =>
      l.proficiency?.trim() ? `${l.language.trim()} (${l.proficiency.trim()})` : l.language.trim()
    );
    children.push(
      new Paragraph({
        spacing: { before: 40, after: 60, line: 260 },
        children: [
          new TextRun({
            text: langStrings.join('   •   '),
            size: 21,
            color: theme.text,
            font: theme.font,
          }),
        ],
      })
    );
  }

  // -------------------------------------------------------------------------
  // 11. References (Corporate & Non-Tech)
  // -------------------------------------------------------------------------
  const validRefs = (sections.references || []).filter((r) => r.name?.trim());
  if (validRefs.length > 0) {
    children.push(createSectionHeader('References', theme));
    validRefs.forEach((ref) => {
      const details: string[] = [];
      if (ref.role?.trim()) details.push(ref.role.trim());
      if (ref.company?.trim()) details.push(ref.company.trim());
      if (ref.email?.trim()) details.push(ref.email.trim());
      if (ref.phone?.trim()) details.push(ref.phone.trim());

      children.push(
        new Paragraph({
          spacing: { before: 40, after: 20, line: 260 },
          children: [
            new TextRun({
              text: ref.name.trim(),
              bold: true,
              size: 21,
              color: theme.primary,
              font: theme.font,
            }),
            new TextRun({
              text: details.length > 0 ? `  —  ${details.join(', ')}` : '',
              size: 21,
              color: theme.text,
              font: theme.font,
            }),
          ],
        })
      );
    });
  }

  // -------------------------------------------------------------------------
  // 12. Personal Particulars / Details (Indian Private Sector)
  // -------------------------------------------------------------------------
  const hasParticulars = Boolean(
    personalInfo.fatherName?.trim() ||
    personalInfo.dateOfBirth?.trim() ||
    personalInfo.gender?.trim() ||
    personalInfo.maritalStatus?.trim() ||
    personalInfo.nationality?.trim() ||
    personalInfo.languagesKnown?.trim() ||
    personalInfo.permanentAddress?.trim()
  );

  if (hasParticulars) {
    children.push(createSectionHeader('Personal Details', theme));

    const fields: { label: string; value: string }[] = [];
    if (personalInfo.fatherName?.trim()) fields.push({ label: "Father's Name", value: personalInfo.fatherName.trim() });
    if (personalInfo.dateOfBirth?.trim()) fields.push({ label: 'Date of Birth', value: personalInfo.dateOfBirth.trim() });
    if (personalInfo.gender?.trim()) fields.push({ label: 'Gender', value: personalInfo.gender.trim() });
    if (personalInfo.maritalStatus?.trim()) fields.push({ label: 'Marital Status', value: personalInfo.maritalStatus.trim() });
    if (personalInfo.nationality?.trim()) fields.push({ label: 'Nationality', value: personalInfo.nationality.trim() });
    if (personalInfo.languagesKnown?.trim()) fields.push({ label: 'Languages Known', value: personalInfo.languagesKnown.trim() });
    if (personalInfo.permanentAddress?.trim()) fields.push({ label: 'Permanent Address', value: personalInfo.permanentAddress.trim() });

    fields.forEach((item) => {
      children.push(
        new Paragraph({
          spacing: { before: 20, after: 30, line: 240 },
          children: [
            new TextRun({
              text: `${item.label}: `,
              bold: true,
              size: 20,
              color: theme.primary,
              font: theme.font,
            }),
            new TextRun({
              text: item.value,
              size: 20,
              color: theme.text,
              font: theme.font,
            }),
          ],
        })
      );
    });
  }

  // -------------------------------------------------------------------------
  // 13. Declaration (Indian Private Sector Resumes)
  // -------------------------------------------------------------------------
  if (sections.declaration?.enabled && sections.declaration.text?.trim()) {
    children.push(createSectionHeader('Declaration', theme));

    children.push(
      new Paragraph({
        spacing: { before: 40, after: 120, line: 260 },
        children: [
          new TextRun({
            text: sections.declaration.text.trim(),
            italics: true,
            size: 20,
            color: theme.text,
            font: theme.font,
          }),
        ],
      })
    );

    // Signature and Date/Place Block
    const place = sections.declaration.place?.trim();
    const date = sections.declaration.date?.trim();
    const signName = sections.declaration.signatureName?.trim() || personalInfo.fullName || '';

    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: BORDER_NONE,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                borders: BORDER_NONE,
                children: [
                  new Paragraph({
                    spacing: { before: 100, after: 20 },
                    children: [
                      new TextRun({
                        text: `Place: ${place || '________________'}`,
                        size: 20,
                        font: theme.font,
                        color: theme.muted,
                      }),
                    ],
                  }),
                  new Paragraph({
                    spacing: { before: 20, after: 40 },
                    children: [
                      new TextRun({
                        text: `Date: ${date || '________________'}`,
                        size: 20,
                        font: theme.font,
                        color: theme.muted,
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                borders: BORDER_NONE,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    spacing: { before: 100, after: 20 },
                    children: [
                      new TextRun({
                        text: signName ? `(${signName})` : '(Signature)',
                        bold: true,
                        size: 21,
                        font: theme.font,
                        color: theme.primary,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    );
  }

  // Construct Document with 0.75-inch (1080 twips) clean margins
  return new Document({
    styles: {
      default: {
        document: {
          run: {
            font: theme.font,
            size: 21, // 10.5pt
            color: theme.text,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1080,
              right: 1080,
              bottom: 1080,
              left: 1080,
            },
          },
        },
        children,
      },
    ],
  });
}

/**
 * Triggers client-side DOCX file generation and browser download.
 * Strictly restricted to tech and non-tech resume categories.
 */
export async function exportResumeToDocx(
  doc: DocumentData,
  customFilename?: string
): Promise<void> {
  if (!isResumeDocument(doc)) {
    throw new Error('DOCX export is available for tech and non-tech resume categories only.');
  }

  const wordDocument = generateResumeDocx(doc as ResumeDocument);
  const blob = await Packer.toBlob(wordDocument);

  const fallback = doc.category === 'private_job_resume' ? 'Biodata_CV' : 'Resume';
  const nameSlug = (doc.personalInfo.fullName || fallback).trim().replace(/\s+/g, '_');
  const filename = customFilename || `${nameSlug}_Resume.docx`;

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

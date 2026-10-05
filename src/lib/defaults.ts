import type { DocumentCategory, ResumeCategory, ResumeDocument, DocumentData } from './schema';

/**
 * Creates a clean, empty resume document for a specific category.
 */
export function createEmptyResume(category: ResumeCategory = 'tech_resume'): ResumeDocument {
  const now = new Date().toISOString();
  const defaultTemplateId = category === 'non_tech_resume' ? 'executive-mba-01' : 'modern-split-01';

  const defaultLinks =
    category === 'tech_resume'
      ? [
          { label: 'LinkedIn', url: '' },
          { label: 'GitHub', url: '' },
        ]
      : category === 'non_tech_resume'
      ? [
          { label: 'LinkedIn', url: '' },
          { label: 'Portfolio', url: '' },
        ]
      : [
          { label: 'LinkedIn', url: '' },
          { label: 'Website', url: '' },
        ];

  return {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'doc-' + Date.now(),
    category,
    templateId: defaultTemplateId,
    createdAt: now,
    updatedAt: now,
    personalInfo: {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      photoUrl: '',
      links: defaultLinks,
    },
    summary: '',
    sections: {
      education: [],
      experience: [],
      skills: [],
      projects: [],
      certifications: [],
      references: [],
      languages: [],
      volunteer: [],
    },
  };
}

/**
 * Backwards-compatible alias for creating an empty tech resume.
 */
export function createEmptyTechResume(): ResumeDocument {
  return createEmptyResume('tech_resume');
}

/**
 * High-profile sample tech resume data shown to first-time visitors
 * matching international software engineering and product standards.
 */
export const sampleTechResume: ResumeDocument = {
  id: 'sample-tech-001',
  category: 'tech_resume',
  templateId: 'modern-split-01',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: new Date().toISOString(),
  personalInfo: {
    fullName: 'Rupesh Kumar',
    title: 'Web Developer / Full-Stack Engineer',
    email: 'rupeshbrahampur@gmail.com',
    phone: '+91 8434795707',
    location: 'Darbhanga, India',
    photoUrl: '',
    links: [
      { label: 'LinkedIn', url: 'https://linkedin.com/in/rupesh-cse' },
      { label: 'GitHub', url: 'https://github.com/hrupeshk' },
    ],
  },
  summary:
    'Passionate Web Developer with a strong foundation in building scalable web applications using ReactJS, Django, FastAPI, and REST APIs. Focused on clean architecture, intuitive UI/UX, and delivering practical solutions to real-world problems. Actively seeking a dynamic tech environment to contribute, collaborate, and grow.',
  sections: {
    experience: [
      {
        company: 'Goodrich Maritime Pvt. Ltd.',
        role: 'Executive Documentation (Export)',
        startDate: '08/2025',
        endDate: 'Present',
        bullets: [
          'Managed end-to-end export documentation workflow for vessel-wise shipments using EBMS — handling BL generation, draft approvals, and SCMTR submissions while maintaining structured Excel trackers across 10–15 active shipments simultaneously.',
          'Coordinated with shippers and cross-functional teams via email to validate documentation accuracy, resolve discrepancies, and route operational queries — ensuring consistent turnaround within expected timelines.',
        ],
      },
    ],
    projects: [
      {
        name: 'Cars Club – Vehicle Resale Platform',
        description:
          'Tech: ReactJS, Tailwind CSS, Django, MongoDB, PyMongo, REST API\nDeveloped a full-stack vehicle resale web app enabling dynamic filtering (by engine, torque, CC) for enhanced UX. Designed REST APIs with Django & PyMongo reducing data retrieval time. Implemented secure API endpoints for data transactions with validation and role-based access.',
        link: 'https://github.com/hrupeshk/cars-club',
      },
      {
        name: 'CSE Department Website – Tezpur University',
        description:
          'Tech: ReactJS, Tailwind CSS, FastAPI, MySQL, Figma\nBuilt a responsive departmental website featuring sections like Faculty, Research, and Contact. Designed UI/UX in Figma and translated into clean ReactJS components with smooth client-side routing. Developed Admin Dashboard for faculty to manage data directly.',
        link: 'https://github.com/hrupeshk/department-portal',
      },
      {
        name: 'Automated Vehicle Number Plate Detection (ANPR)',
        description:
          'Tech: YOLOv5, EasyOCR, OpenCV, MySQL, Python\nDeveloped a real-time license plate recognition system using CCTV feed and YOLOv5. Integrated EasyOCR for text extraction and MySQL for vehicle-entry logging and personnel tracking. Designed the pipeline to handle real-time video input under varied lighting conditions.',
        link: 'https://github.com/hrupeshk/anpr-system',
      },
    ],
    skills: [
      'Python',
      'JavaScript',
      'ReactJS',
      'HTML',
      'CSS',
      'Tailwind CSS',
      'Node.js',
      'FastAPI',
      'Django',
      'MySQL',
      'PostgreSQL',
      'MongoDB',
      'Git',
      'Figma',
      'OOP',
      'REST API',
    ],
    certifications: [
      {
        name: 'Google IT Support Certificate',
        issuer: 'Coursera',
        year: '2024',
        description: 'Gained hands-on skills in troubleshooting, system administration, networking, and security.',
      },
      {
        name: 'Data Analytics with Python',
        issuer: 'NPTEL',
        year: '2024',
        description: 'Applied statistical analysis, data wrangling, and visualization techniques using Python.',
      },
      {
        name: 'Cloud Computing & Distributed Systems',
        issuer: 'NPTEL',
        year: '2024',
        description: 'Studied virtualization, distributed architecture, and cloud service models (IaaS, PaaS, SaaS).',
      },
      {
        name: 'The Joy of Computing using Python',
        issuer: 'NPTEL',
        year: '2023',
        description: 'Completed certification with hands-on experience in problem-solving and programming fundamentals.',
      },
    ],
    volunteer: [
      {
        organization: 'National Service Scheme (NSS)',
        role: 'Leadership & Volunteer Experience',
        startDate: '02/2022',
        endDate: '12/2023',
        description:
          'Actively served in the National Service Scheme (NSS), demonstrating leadership and management skills through organizing events, coordinating student volunteers, and contributing to community outreach initiatives.',
      },
    ],
    education: [
      {
        institution: 'Tezpur University',
        degree: 'B.Tech in Computer Science & Engg.',
        field: 'Computer Science',
        startDate: '09/2021',
        endDate: '06/2025',
        grade: 'First Class',
      },
    ],
    languages: [
      { language: 'Hindi', proficiency: 'Native or Bilingual' },
      { language: 'English', proficiency: 'Full Professional' },
    ],
  },
};

/**
 * Sample Corporate & Non-Tech Resume data tailored for Management,
 * HR, Operations, Strategy, and MBA candidates.
 */
export const sampleNonTechResume: ResumeDocument = {
  id: 'sample-non-tech-001',
  category: 'non_tech_resume',
  templateId: 'executive-mba-01',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: new Date().toISOString(),
  personalInfo: {
    fullName: 'Priya Sharma',
    title: 'Senior Operations & Project Lead',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, India',
    photoUrl: '',
    links: [
      { label: 'LinkedIn', url: 'https://linkedin.com/in/priya-sharma-ops' },
      { label: 'Portfolio', url: 'https://priyasharma.me' },
    ],
  },
  summary:
    'Strategic Operations & Project Lead with 6+ years of cross-functional experience optimizing corporate workflows, managing multi-million rupee budgets, and driving operational excellence across supply chain and digital transformation initiatives.',
  sections: {
    experience: [
      {
        company: 'Apex Global Enterprises',
        role: 'Senior Project & Operations Manager',
        startDate: '06/2022',
        endDate: 'Present',
        bullets: [
          'Led agile cross-functional delivery teams across 14 enterprise projects, improving on-time milestone delivery from 76% to 94%.',
          'Negotiated key vendor contracts reducing operational procurement overhead by ₹42L annually while maintaining 99.8% SLA adherence.',
          'Standardized operational reporting cadence using automated KPI dashboards for C-suite executive stakeholder reviews.',
        ],
      },
      {
        company: 'Tata Business Services',
        role: 'Operations Analyst & Team Lead',
        startDate: '07/2019',
        endDate: '05/2022',
        bullets: [
          'Analyzed workflow bottlenecks across 6 regional fulfillment hubs, designing process interventions that reduced cycle times by 22%.',
          'Mentored and coached a team of 18 junior operations executives, achieving zero attrition over 24 consecutive months.',
          'Coordinated cross-departmental regulatory compliance audits ensuring 100% adherence to standard operating procedures.',
        ],
      },
    ],
    education: [
      {
        institution: 'Symbiosis Institute of Business Management (SIBM)',
        degree: 'MBA in Operations & Strategy',
        field: 'Operations Management',
        startDate: '2017',
        endDate: '2019',
        grade: 'CGPA 8.7 / 10',
      },
      {
        institution: 'University of Delhi',
        degree: 'B.Com (Honours)',
        field: 'Commerce & Economics',
        startDate: '2014',
        endDate: '2017',
        grade: 'First Division',
      },
    ],
    skills: [
      'Operations Management',
      'Process Optimization',
      'Risk Mitigation',
      'Stakeholder Management',
      'Budgeting & P&L',
      'Agile / Scrum',
      'Vendor Negotiation',
      'Advanced Excel (VLOOKUP, Pivot)',
      'Tableau & BI Dashboards',
      'ERP Systems (SAP)',
      'Cross-Functional Leadership',
    ],
    certifications: [
      {
        name: 'Project Management Professional (PMP)',
        issuer: 'Project Management Institute (PMI)',
        year: '2023',
        description: 'Global standard certification for project leadership, risk planning, and agile delivery.',
      },
      {
        name: 'Lean Six Sigma Green Belt',
        issuer: 'KPMG',
        year: '2021',
        description: 'Specialized in DMAIC methodology, root-cause analysis, and statistical quality control.',
      },
    ],
    references: [
      {
        name: 'Ananya Deshmukh',
        company: 'Apex Global Enterprises',
        role: 'VP of Operations',
        email: 'ananya.deshmukh@apexglobal.com',
        relationship: 'Former Direct Reporting Director',
      },
    ],
    languages: [
      { language: 'English', proficiency: 'Full Professional' },
      { language: 'Hindi', proficiency: 'Native or Bilingual' },
    ],
  },
};

/**
 * Sample Private Job Resume data tailored for private company jobs,
 * freshers, banking, sales, BPO, accounts, logistics, and documentation.
 */
export const samplePrivateJobResume: ResumeDocument = {
  id: 'sample-private-job-001',
  category: 'private_job_resume',
  templateId: 'modern-split-01',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: new Date().toISOString(),
  personalInfo: {
    fullName: 'Amit Verma',
    title: 'Executive Documentation & Commercial Operations',
    email: 'amit.verma@example.com',
    phone: '+91 91234 56789',
    location: 'Mumbai, India',
    photoUrl: '',
    links: [
      { label: 'LinkedIn', url: 'https://linkedin.com/in/amit-verma-ops' },
    ],
  },
  summary:
    'Results-driven Private Sector Logistics & Documentation Executive with extensive hands-on expertise in export-import compliance, SAP ERP documentation, customs liaison, and commercial invoice verification. Proven track record of zero-penalty compliance across 200+ container shipments.',
  sections: {
    experience: [
      {
        company: 'Reliance Logistics & Ports Ltd.',
        role: 'Senior Executive (Commercial Operations)',
        startDate: '03/2023',
        endDate: 'Present',
        bullets: [
          'Supervised end-to-end export documentation, Bill of Lading (BL) validation, and shipping bill filings for private vessel cargo operations.',
          'Reconciled vendor statements and freight invoices with zero billing disputes, saving an estimated ₹12L through audit accuracy.',
          'Coordinated with CHA agents, shipping lines, and bank trade finance desks for timely Letter of Credit (LC) execution.',
        ],
      },
      {
        company: 'Mahindra Logistics Ltd.',
        role: 'Junior Operations Executive',
        startDate: '08/2021',
        endDate: '02/2023',
        bullets: [
          'Drafted daily dispatches, inward-outward inventory logs, and customer delivery orders using SAP MM and Excel ERP modules.',
          'Managed client communication and resolved shipping inquiries with a 98% first-call resolution rate.',
          'Maintained compliance records for GST e-way bills and commercial invoices without audit discrepancies.',
        ],
      },
    ],
    education: [
      {
        institution: 'University of Mumbai',
        degree: 'Bachelor of Commerce (B.Com)',
        field: 'Accounting & Commercial Law',
        startDate: '2018',
        endDate: '2021',
        grade: 'First Class (72%)',
      },
    ],
    skills: [
      'Export/Import Documentation',
      'SAP ERP (MM/SD)',
      'Advanced Excel (VLOOKUP, Pivot, Formulas)',
      'Tally ERP 9 / Tally Prime',
      'Trade Finance & Letters of Credit (LC)',
      'Vendor & Client Coordination',
      'Commercial Invoicing & GST E-way Bills',
      'Discrepancy Resolution & Audit Prep',
    ],
    certifications: [
      {
        name: 'Diploma in International Trade & Logistics',
        issuer: 'Welingkar Institute of Management',
        year: '2022',
        description: 'Practical training in multimodal transport, customs regulations, and international shipping documentation.',
      },
    ],
    references: [
      {
        name: 'Ramesh Nair',
        company: 'Reliance Logistics & Ports Ltd.',
        role: 'Senior General Manager (Operations)',
        email: 'ramesh.nair@reliancelogistics.com',
        phone: '+91 98200 12345',
        relationship: 'Direct Reporting Manager',
      },
    ],
    languages: [
      { language: 'English', proficiency: 'Full Professional' },
      { language: 'Hindi', proficiency: 'Native or Bilingual' },
      { language: 'Marathi', proficiency: 'Conversational' },
    ],
  },
};

/**
 * Retrieves the sample document for a given document category.
 */
export function getSampleDocument(category: DocumentCategory): ResumeDocument {
  if (category === 'non_tech_resume') {
    return sampleNonTechResume;
  }
  if (category === 'private_job_resume') {
    return samplePrivateJobResume;
  }
  return sampleTechResume;
}

/**
 * Creates an initial document for any supported category.
 */
export function getInitialDocument(category: DocumentCategory): DocumentData {
  if (category === 'tech_resume') {
    return sampleTechResume;
  }
  if (category === 'non_tech_resume') {
    return sampleNonTechResume;
  }
  if (category === 'private_job_resume') {
    return samplePrivateJobResume;
  }
  return createEmptyResume(category as ResumeCategory);
}

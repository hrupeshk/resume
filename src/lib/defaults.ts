import type { DocumentCategory, ResumeDocument, DocumentData } from './schema';

/**
 * Creates a clean, empty tech resume document.
 */
export function createEmptyTechResume(): ResumeDocument {
  const now = new Date().toISOString();
  return {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'doc-' + Date.now(),
    category: 'tech_resume',
    templateId: 'modern-split-01',
    createdAt: now,
    updatedAt: now,
    personalInfo: {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      photoUrl: '',
      links: [
        { label: 'LinkedIn', url: '' },
        { label: 'GitHub', url: '' },
      ],
    },
    summary: '',
    sections: {
      education: [],
      experience: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
      volunteer: [],
    },
  };
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
 * Creates an initial document for any supported category.
 */
export function getInitialDocument(category: DocumentCategory): DocumentData {
  if (category === 'tech_resume') {
    return sampleTechResume;
  }
  return createEmptyTechResume();
}

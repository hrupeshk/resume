import type { DocumentCategory, ResumeCategory, ResumeDocument, BiodataDocument, DocumentData } from './schema';

/**
 * Creates a clean, empty resume document for a specific category.
 */
export function createEmptyResume(category: ResumeCategory = 'tech_resume'): ResumeDocument {
  const now = new Date().toISOString();
  const defaultTemplateId =
    category === 'non_tech_resume'
      ? 'executive-mba-01'
      : category === 'private_job_resume'
      ? 'indian-classic-private-01'
      : 'modern-split-01';

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
          { label: 'Instagram', url: '' },
          { label: 'Facebook', url: '' },
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
      fatherName: '',
      dateOfBirth: '',
      gender: '',
      maritalStatus: '',
      nationality: 'Indian',
      languagesKnown: '',
      permanentAddress: '',
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
      declaration:
        category === 'private_job_resume'
          ? {
              enabled: true,
              text: 'I hereby declare that all the information mentioned above is true and correct to the best of my knowledge and belief.',
              place: '',
              date: '',
            }
          : undefined,
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
 * Sample Private Job Resume data tailored for Indian private company jobs,
 * hospitality, retail, office assistants, freshers, and operations.
 */
export const samplePrivateJobResume: ResumeDocument = {
  id: 'sample-private-job-001',
  category: 'private_job_resume',
  templateId: 'indian-classic-private-01',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: new Date().toISOString(),
  personalInfo: {
    fullName: 'Ramesh Kumar',
    title: 'Hospitality & Food Service Executive',
    email: 'ramesh.kumar99@example.com',
    phone: '+91 98765 43210',
    location: 'Patna, Bihar',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80',
    fatherName: 'Shri Ram Prasad',
    dateOfBirth: '12 July 1999',
    gender: 'Male',
    maritalStatus: 'Unmarried',
    nationality: 'Indian',
    languagesKnown: 'Hindi, Bhojpuri, English (Basic)',
    permanentAddress: 'Vill - Rampur, Post - Lalganj, Dist - Vaishali, Bihar - 844121',
    links: [
      { label: 'Instagram', url: 'https://instagram.com/ramesh_service' },
      { label: 'Facebook', url: 'https://facebook.com/ramesh.kumar' },
    ],
  },
  summary:
    'Dedicated, polite, and hardworking hospitality service professional with 3+ years of experience in food and beverage service, customer care, banquet coordination, and cash billing. Punctual, disciplined, and committed to excellent teamwork.',
  sections: {
    experience: [
      {
        company: 'Hotel Maurya, Patna',
        role: 'Captain / Head Service Staff',
        startDate: '05/2022',
        endDate: 'Present',
        bullets: [
          'Managed dining area operations for 40+ daily tables, ensuring prompt food serving and guest satisfaction.',
          'Operated POS cash counter, prepared accurate guest bills, and balanced end-of-day register accounts.',
          'Trained and guided junior banquet service staff on hygiene standards and professional etiquette.',
        ],
      },
      {
        company: 'Grand Utsav Restaurant & Banquets',
        role: 'F&B Service Associate',
        startDate: '01/2021',
        endDate: '04/2022',
        bullets: [
          'Assisted head chef and banquet manager during weddings and private functions of up to 400 attendees.',
          'Maintained complete inventory of cutlery, glassware, and serving equipment with zero breakages.',
          'Greeted guests warmly and took precise food orders, boosting repeat customer ratings.',
        ],
      },
    ],
    education: [
      {
        institution: 'State Institute of Hotel Management (SIHM)',
        degree: 'Diploma in Food & Beverage Service',
        field: 'Hospitality Management',
        startDate: '2020',
        endDate: '2021',
        grade: 'First Division (74%)',
      },
      {
        institution: 'Bihar School Examination Board (BSEB)',
        degree: 'Intermediate (12th Pass)',
        field: 'Arts',
        startDate: '2017',
        endDate: '2019',
        grade: 'First Division',
      },
      {
        institution: 'BSEB',
        degree: 'Matriculation (10th Pass)',
        field: 'General',
        startDate: '2015',
        endDate: '2017',
        grade: 'First Division (68%)',
      },
    ],
    skills: [
      'Food & Beverage Service',
      'Guest Relationship & Courtesy',
      'POS Billing & Cash Management',
      'Table Setup & Banquet Etiquette',
      'Hygiene & Sanitation Standards',
      'Teamwork & High Physical Stamina',
      'Punctual & Disciplined',
      'Basic Computer & Mobile POS',
    ],
    references: [
      {
        name: 'Suresh Chandra',
        company: 'Hotel Maurya, Patna',
        role: 'Food & Beverage Manager',
        email: 'suresh.chandra@hotelmaurya.com',
        phone: '+91 94310 12345',
        relationship: 'Direct Supervisor',
      },
    ],
    declaration: {
      enabled: true,
      text: 'I hereby declare that all the information mentioned above is true and correct to the best of my knowledge and belief.',
      place: 'Patna',
      date: '15/08/2025',
      signatureName: 'Ramesh Kumar',
    },
  },
};

/**
 * Sample Indian Marriage Biodata document with traditional details:
 * Horoscope, Family, Education, Occupation, and Partner Preferences.
 */
export const sampleMarriageBiodata: BiodataDocument = {
  id: 'sample-biodata-001',
  category: 'marriage_biodata',
  templateId: 'traditional-maroon-01',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: new Date().toISOString(),
  personalInfo: {
    fullName: 'Aditya Sharma',
    dateOfBirth: '14 August 1996',
    timeOfBirth: '07:45 AM',
    placeOfBirth: 'Jaipur, Rajasthan',
    height: "5' 11\" (180 cm)",
    complexion: 'Fair',
    diet: 'Vegetarian',
    photoUrl: '',
    phone: '+91 98765 43210',
    email: 'aditya.sharma96@example.com',
  },
  sections: {
    education: [
      {
        degree: 'B.Tech in Computer Science & Engineering',
        institution: 'NIT Jaipur (MNIT), 2018',
      },
      {
        degree: 'Senior Secondary (CBSE - 94%)',
        institution: 'St. Xavier’s Senior Secondary School, Jaipur',
      },
    ],
    occupation: {
      designation: 'Senior Software Engineer',
      company: 'Microsoft India, Hyderabad',
      income: '₹32 LPA',
    },
    family: {
      fatherName: 'Dr. Ramesh Chandra Sharma',
      fatherOccupation: 'Professor & Head of Department (Physics), Rajasthan University',
      motherName: 'Mrs. Sunita Sharma',
      motherOccupation: 'Homemaker',
      siblings: [
        {
          name: 'Pooja Sharma',
          relation: 'Elder Sister (Married)',
          occupation: 'Architect, settled in Bengaluru',
        },
      ],
      nativePlace: 'Jaipur, Rajasthan (Ancestral: Alwar)',
    },
    horoscope: {
      gothra: 'Kaushik',
      nakshatra: 'Pushya',
      rashi: 'Karka (Cancer)',
      manglik: 'Non-Manglik',
    },
    contact: {
      address: 'B-42, Shyam Nagar, Ajmer Road, Jaipur - 302019',
      referencePhone: '+91 94140 12345 (Father)',
    },
    partnerPreferences:
      'Looking for an educated, family-oriented, and understanding partner with good cultural values. Professionally qualified (B.Tech, MBA, CA, Doctor, or equivalent). Respectful towards family traditions while holding a progressive mindset.',
  },
};

/**
 * Creates a clean, empty marriage biodata document.
 */
export function createEmptyBiodata(): BiodataDocument {
  const now = new Date().toISOString();
  return {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'biodata-' + Date.now(),
    category: 'marriage_biodata',
    templateId: 'traditional-maroon-01',
    createdAt: now,
    updatedAt: now,
    personalInfo: {
      fullName: '',
      dateOfBirth: '',
      timeOfBirth: '',
      placeOfBirth: '',
      height: '',
      complexion: '',
      diet: '',
      photoUrl: '',
      phone: '',
      email: '',
    },
    sections: {
      education: [],
      occupation: {
        designation: '',
        company: '',
        income: '',
      },
      family: {
        fatherName: '',
        fatherOccupation: '',
        motherName: '',
        motherOccupation: '',
        siblings: [],
        nativePlace: '',
      },
      horoscope: {
        gothra: '',
        nakshatra: '',
        rashi: '',
        manglik: '',
      },
      contact: {
        address: '',
        referencePhone: '',
      },
      partnerPreferences: '',
    },
  };
}

/**
 * Retrieves the sample document for a given document category.
 */
export function getSampleDocument(category: DocumentCategory): DocumentData {
  if (category === 'marriage_biodata') {
    return sampleMarriageBiodata;
  }
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
  if (category === 'marriage_biodata') {
    return sampleMarriageBiodata;
  }
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

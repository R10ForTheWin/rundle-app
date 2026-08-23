// Data model — extracted from the reviewed mockup. Edit here, not in render.js.
const PERSONAS = [
  {
    "id": "rc",
    "initials": "RC",
    "name": "Renee Castillo",
    "role": "Inpatient Coding Specialist",
    "tenure": "4 yrs",
    "age": 34,
    "location": "Columbus, OH",
    "cred": "CCS",
    "credOrg": "AHIMA",
    "credId": "CCS-2022-88431",
    "issue": "Mar 2022",
    "renew": "Mar 2026",
    "status": "active",
    "avatar": "assets/avatars/rc.png",
    "avatarBg": "#C6741E"
  },
  {
    "id": "jt",
    "initials": "JT",
    "name": "Jordan Tran",
    "role": "Inpatient Coding Specialist",
    "tenure": "1 yr",
    "age": 26,
    "location": "Austin, TX",
    "cred": "CCA",
    "credOrg": "AHIMA",
    "credId": "CCA-2025-30187",
    "issue": "Jan 2025",
    "renew": "Jan 2027",
    "status": "active",
    "avatar": "assets/avatars/jt.png",
    "avatarBg": "#2F6B57"
  },
  {
    "id": "mo",
    "initials": "MO",
    "name": "Marcus Okafor",
    "role": "HIM Coder Trainee",
    "tenure": "<1 yr",
    "age": 23,
    "location": "Atlanta, GA",
    "cred": "CCA",
    "credOrg": "AHIMA",
    "credId": null,
    "issue": null,
    "renew": null,
    "status": "pending",
    "pendingNote": "Exam scheduled Sep 2026",
    "avatar": "assets/avatars/mo.png",
    "avatarBg": "#A24E20"
  },
  {
    "id": "pk",
    "initials": "PK",
    "name": "Priya Kapoor",
    "role": "Inpatient Coding Specialist",
    "tenure": "9 yrs",
    "age": 41,
    "location": "Chicago, IL",
    "cred": "CCS",
    "credOrg": "AHIMA",
    "credId": "CCS-2017-51204",
    "issue": "Jun 2017",
    "renew": "Jun 2026",
    "status": "active",
    "avatar": "assets/avatars/pk.png",
    "avatarBg": "#D8994A"
  },
  {
    "id": "dw",
    "initials": "DW",
    "name": "Denise Ward",
    "role": "Inpatient Coding Specialist",
    "tenure": "6 yrs",
    "age": 52,
    "location": "Tampa, FL",
    "cred": "CCS",
    "credOrg": "AHIMA",
    "credId": "CCS-2023-77650",
    "issue": "Aug 2023",
    "renew": "Aug 2027",
    "status": "active",
    "avatar": "assets/avatars/dw.png",
    "avatarBg": "#6B4A2A"
  }
]
;

const STORY = {
  "rc": {
    "outcome": {
      "salary": "$54,800/yr",
      "feedback": "Renee is one of the most dependable coders on our floor — accurate, fast, and great with physician queries.",
      "attribution": "HIM Director, Meridian Regional Medical Center"
    },
    "employer": [
      {
        "from": "MAY 2022",
        "to": "PRESENT",
        "title": "Meridian Regional Medical Center",
        "role": "Inpatient Coding Specialist",
        "note": "verified via payroll"
      }
    ],
    "recordLabel": "Strong record",
    "recordSub": "4 years of verified inpatient coding work, backed by evidence.",
    "skills": [
      {
        "name": "ICD-10-CM Coding",
        "evidence": "3,140 charts coded · 96% accuracy",
        "tier": "expert",
        "trust": "documented",
        "icon": "a",
        "svg": "i-medical"
      },
      {
        "name": "ICD-10-PCS Coding",
        "evidence": "1,860 charts coded · 91% accuracy",
        "tier": "advanced",
        "trust": "documented",
        "icon": "b",
        "svg": "i-medical"
      },
      {
        "name": "DRG Assignment",
        "evidence": "94% accuracy · 4 yrs verified tenure",
        "tier": "expert",
        "trust": "employer",
        "icon": "a",
        "svg": "i-target"
      },
      {
        "name": "Documentation Review",
        "evidence": "89% query accuracy",
        "tier": "advanced",
        "trust": "documented",
        "icon": "c",
        "svg": "i-shield"
      }
    ],
    "ready": [
      {
        "title": "Health Information Technologist",
        "fit": 94,
        "svg": "i-doc"
      },
      {
        "title": "Clinical Documentation Improvement",
        "fit": 88,
        "svg": "i-shield"
      }
    ],
    "matches": [
      {
        "title": "Health Information Technologist",
        "fit": 94,
        "transfer": 72.1,
        "meta": "Ready now",
        "good": true,
        "wage": "$67,310/yr median",
        "credential": "RHIT",
        "positions": [
          {
            "company": "Kaiser Permanente",
            "logoImg": "assets/img/logo-kaiser.png",
            "role": "Health Information Technologist",
            "location": "Remote",
            "wage": "$64,000–$71,000/yr",
            "posted": "2 days ago"
          },
          {
            "company": "Ascension",
            "logoImg": "assets/img/logo-ascension.png",
            "role": "HIM Technologist II",
            "location": "St. Louis, MO",
            "wage": "$62,500–$69,000/yr",
            "posted": "5 days ago"
          }
        ]
      },
      {
        "title": "Clinical Documentation Improvement Specialist",
        "fit": 88,
        "transfer": 63.9,
        "closesAt": "L3 · Subtle errors",
        "meta": "Ready in ~3 months · 1 skill gap",
        "wage": "$85,000/yr median",
        "credential": "CCDS/CDIP",
        "positions": [
          {
            "company": "Cleveland Clinic",
            "logoImg": "assets/img/logo-clevelandclinic.png",
            "role": "CDI Specialist",
            "location": "Remote",
            "wage": "$82,000–$88,000/yr",
            "posted": "3 days ago"
          },
          {
            "company": "Mayo Clinic",
            "logoImg": "assets/img/logo-mayoclinic.png",
            "role": "Clinical Documentation Specialist",
            "location": "Columbus, OH",
            "wage": "$80,000–$86,000/yr",
            "posted": "1 week ago"
          }
        ]
      },
      {
        "title": "Medical Assistants",
        "fit": 82,
        "transfer": 68.1,
        "meta": "Ready now",
        "wage": "$44,200/yr median"
      },
      {
        "title": "Health Services Manager",
        "fit": 61,
        "transfer": 30.2,
        "meta": "Long-term pathway",
        "wage": "$117,960/yr median",
        "credential": "Bachelor's degree"
      }
    ],
    "gap": {
      "title": "CDI Specialist",
      "fit": 88,
      "have": [
        {
          "t": "ICD-10-PCS Coding",
          "d": "91% accuracy, verified"
        },
        {
          "t": "DRG Assignment",
          "d": "94% accuracy, verified"
        },
        {
          "t": "Medical Terminology",
          "d": "Confirmed via credential"
        }
      ],
      "need": {
        "t": "CDI query writing",
        "d": "Structured physician queries — not yet demonstrated"
      },
      "provider": {
        "name": "CDI Practice Course",
        "org": "AHIMA-approved partner",
        "badge": "CEU-funded"
      }
    },
    "training": {
      "mode": "renewal",
      "dueLabel": "Due Mar 2026",
      "ceu": "14 / 20",
      "ceuPct": 70,
      "recommended": {
        "name": "CDI Practice Course",
        "org": "AHIMA-approved partner",
        "badge": "CEU-funded"
      },
      "completed": {
        "t": "ICD-10-PCS Refresher",
        "d": "Completed Jan 2026"
      }
    },
    "sim": {
      "accuracy": 92,
      "speed": "28/hr",
      "time": "22 min",
      "level": "4/5",
      "breakdown": [
        {
          "n": "ICD-10-CM",
          "v": 96
        },
        {
          "n": "ICD-10-PCS",
          "v": 91
        },
        {
          "n": "DRG Assignment",
          "v": 94
        },
        {
          "n": "Documentation review",
          "v": 89
        }
      ]
    },
    "skillDetail": {
      "name": "ICD-10-PCS Coding",
      "tier": "advanced",
      "metricLabel": "Charts coded",
      "accuracy": 91,
      "count": "1,860",
      "errors": [
        {
          "t": "Incorrect code",
          "n": 6
        },
        {
          "t": "Missing modifier",
          "n": 4
        },
        {
          "t": "Sequencing",
          "n": 3
        }
      ]
    },
    "map": {
      "skills": [
        "ICD-10-CM Coding",
        "ICD-10-PCS Coding",
        "DRG Assignment",
        "Documentation Review",
        "Medical Terminology",
        "Query Writing",
        "Compliance Judgment",
        "Error Detection",
        "Chart Auditing",
        "CPT/HCPCS Coding",
        "Payer Guidelines",
        "HIPAA Compliance",
        "EHR Systems",
        "Anatomy & Physiology",
        "Abstracting",
        "Pharmacology Basics",
        "Insurance Claims Review"
      ],
      "roles": [
        "Health Information Technologist",
        "Clinical Documentation Improvement",
        "Medical Secretaries & Admin Assistants",
        "Health Services Manager",
        "Billing & Posting Clerks",
        "Healthcare Business/Operations Analyst",
        "Medical Assistants",
        "Healthcare Compliance/Privacy Officer",
        "Bookkeeping, Accounting & Auditing Clerks",
        "Data Entry Keyers"
      ]
    }
  },
  "jt": {
    "outcome": {
      "salary": "$46,500/yr",
      "feedback": "Jordan asks great questions and has improved noticeably every quarter since starting.",
      "attribution": "Coding Supervisor, Riverside Community Hospital"
    },
    "employer": [
      {
        "from": "JUN 2025",
        "to": "PRESENT",
        "title": "Riverside Community Hospital",
        "role": "Inpatient Coding Specialist",
        "note": "verified via payroll"
      }
    ],
    "recordLabel": "Building record",
    "recordSub": "1 year of verified inpatient coding work — steadily growing.",
    "skills": [
      {
        "name": "ICD-10-CM Coding",
        "evidence": "640 charts coded · 88% accuracy",
        "tier": "advanced",
        "trust": "documented",
        "icon": "a",
        "svg": "i-medical"
      },
      {
        "name": "ICD-10-PCS Coding",
        "evidence": "310 charts coded · 74% accuracy",
        "tier": "developing",
        "trust": "documented",
        "icon": "b",
        "svg": "i-medical"
      },
      {
        "name": "DRG Assignment",
        "evidence": "81% accuracy · 1 yr verified tenure",
        "tier": "advanced",
        "trust": "employer",
        "icon": "a",
        "svg": "i-target"
      },
      {
        "name": "Documentation Review",
        "evidence": "79% query accuracy",
        "tier": "developing",
        "trust": "documented",
        "icon": "c",
        "svg": "i-shield"
      }
    ],
    "ready": [
      {
        "title": "Clinical Documentation Improvement Specialist",
        "fit": 68,
        "svg": "i-target"
      },
      {
        "title": "Health Information Technologist",
        "fit": 61,
        "svg": "i-doc"
      }
    ],
    "matches": [
      {
        "title": "Clinical Documentation Improvement Specialist",
        "fit": 68,
        "transfer": 63.9,
        "closesAt": "L1 · Foundations",
        "meta": "Ready in ~6 months · 1 skill gap",
        "wage": "$85,000/yr median",
        "credential": "CCDS/CDIP",
        "positions": [
          {
            "company": "Kaiser Permanente",
            "logoImg": "assets/img/logo-kaiser.png",
            "role": "CDI Specialist",
            "location": "Remote",
            "wage": "$80,000–$86,000/yr",
            "posted": "5 days ago"
          },
          {
            "company": "Cedars-Sinai",
            "logoImg": "assets/img/logo-cedarssinai.png",
            "role": "Clinical Documentation Specialist",
            "location": "Austin, TX",
            "wage": "$78,000–$84,000/yr",
            "posted": "2 weeks ago"
          }
        ]
      },
      {
        "title": "Health Information Technologist",
        "fit": 61,
        "transfer": 72.1,
        "meta": "Ready in ~9 months · 2 skill gaps",
        "wage": "$67,310/yr median",
        "credential": "RHIT"
      },
      {
        "title": "Medical Secretaries & Admin Assistants",
        "fit": 58,
        "transfer": 71.5,
        "meta": "Ready now",
        "wage": "$44,090/yr median"
      },
      {
        "title": "Health Services Manager",
        "fit": 31,
        "transfer": 30.2,
        "meta": "Long-term pathway",
        "wage": "$117,960/yr median",
        "credential": "Bachelor's degree"
      }
    ],
    "gap": {
      "title": "Clinical Documentation Improvement Specialist",
      "fit": 68,
      "have": [
        {
          "t": "ICD-10-CM Coding",
          "d": "88% accuracy, verified"
        },
        {
          "t": "DRG Assignment",
          "d": "81% accuracy, verified"
        }
      ],
      "need": {
        "t": "ICD-10-PCS Coding proficiency",
        "d": "Below the level most CDI roles require"
      },
      "provider": {
        "name": "ICD-10-PCS Intensive",
        "org": "AHIMA-approved partner",
        "badge": "CEU-funded"
      }
    },
    "training": {
      "mode": "examprep",
      "examLabel": "CCS exam target",
      "examDate": "Est. late 2026",
      "progressLabel": "Prep modules",
      "progress": "5 / 12",
      "progressPct": 42,
      "recommended": {
        "name": "CCS Exam Prep Course",
        "org": "AHIMA-approved partner",
        "badge": "CEU-funded"
      },
      "completed": {
        "t": "CCA Foundations",
        "d": "Completed Jan 2025"
      }
    },
    "sim": {
      "accuracy": 82,
      "speed": "19/hr",
      "time": "31 min",
      "level": "3/5",
      "breakdown": [
        {
          "n": "ICD-10-CM",
          "v": 88
        },
        {
          "n": "ICD-10-PCS",
          "v": 74
        },
        {
          "n": "DRG Assignment",
          "v": 81
        },
        {
          "n": "Documentation review",
          "v": 79
        }
      ]
    },
    "skillDetail": {
      "name": "ICD-10-PCS Coding",
      "tier": "developing",
      "metricLabel": "Charts coded",
      "accuracy": 74,
      "count": "310",
      "errors": [
        {
          "t": "Incorrect code",
          "n": 11
        },
        {
          "t": "Missing modifier",
          "n": 7
        },
        {
          "t": "Sequencing",
          "n": 6
        }
      ]
    },
    "map": {
      "skills": [
        "ICD-10-CM Coding",
        "ICD-10-PCS Coding",
        "DRG Assignment",
        "Documentation Review",
        "Medical Terminology",
        "Query Writing",
        "Compliance Judgment",
        "Error Detection",
        "Chart Auditing",
        "CPT/HCPCS Coding",
        "Payer Guidelines",
        "HIPAA Compliance",
        "EHR Systems",
        "Anatomy & Physiology",
        "Abstracting",
        "Pharmacology Basics",
        "Insurance Claims Review"
      ],
      "roles": [
        "Medical Secretaries & Admin Assistants",
        "Health Information Technologist",
        "Medical Assistants",
        "Clinical Documentation Improvement",
        "Billing & Posting Clerks",
        "Health Services Manager",
        "Healthcare Business/Operations Analyst",
        "Healthcare Compliance/Privacy Officer",
        "Bookkeeping, Accounting & Auditing Clerks",
        "Data Entry Keyers"
      ]
    }
  },
  "mo": {
    "outcome": {
      "salary": "$41,200/yr",
      "feedback": "Marcus is new but shows real attention to detail — we expect him to move fast once certified.",
      "attribution": "Training Lead, Coastal Health Partners"
    },
    "employer": [
      {
        "from": "FEB 2026",
        "to": "PRESENT",
        "title": "Coastal Health Partners",
        "role": "HIM Coder Trainee",
        "note": "verified via payroll"
      }
    ],
    "recordLabel": "Early record",
    "recordSub": "Less than a year of verified work — still building evidence.",
    "skills": [
      {
        "name": "ICD-10-CM Coding",
        "evidence": "180 charts coded · 71% accuracy",
        "tier": "developing",
        "trust": "documented",
        "icon": "a",
        "svg": "i-medical"
      },
      {
        "name": "DRG Assignment",
        "evidence": "58% accuracy · <1 yr verified tenure",
        "tier": "developing",
        "trust": "employer",
        "icon": "a",
        "svg": "i-target"
      },
      {
        "name": "Documentation Review",
        "evidence": "65% query accuracy",
        "tier": "developing",
        "trust": "documented",
        "icon": "c",
        "svg": "i-shield"
      }
    ],
    "ready": [
      {
        "title": "HIM Coder II",
        "fit": 42,
        "svg": "i-doc"
      }
    ],
    "matches": [
      {
        "title": "HIM Coder II",
        "fit": 42,
        "meta": "Long-term pathway",
        "wage": "$43,000/yr median",
        "positions": [
          {
            "company": "HCA Healthcare",
            "logoImg": "assets/img/logo-hca.png",
            "role": "HIM Coder II",
            "location": "Atlanta, GA",
            "wage": "$42,000–$46,000/yr",
            "posted": "4 days ago"
          },
          {
            "company": "CVS Health",
            "logoImg": "assets/img/logo-cvs.png",
            "role": "Coding Specialist I",
            "location": "Remote",
            "wage": "$40,000–$45,000/yr",
            "posted": "1 week ago"
          }
        ]
      },
      {
        "title": "Healthcare Business/Operations Analyst",
        "fit": 28,
        "transfer": 22.6,
        "meta": "Long-term pathway",
        "wage": "$101,190/yr median",
        "credential": "Bachelor's degree"
      },
      {
        "title": "Healthcare Compliance/Privacy Officer",
        "fit": 22,
        "transfer": 38.5,
        "meta": "Long-term pathway",
        "wage": "$75,000/yr median",
        "credential": "CHC"
      }
    ],
    "gap": {
      "title": "HIM Coder II",
      "fit": 42,
      "have": [
        {
          "t": "ICD-10-CM Coding basics",
          "d": "71% accuracy, early evidence"
        }
      ],
      "need": {
        "t": "CCA credential",
        "d": "Required for this role — exam scheduled Sep 2026"
      },
      "provider": {
        "name": "CCA Exam Prep",
        "org": "AHIMA-approved partner",
        "badge": "CEU-funded"
      }
    },
    "training": {
      "mode": "examprep",
      "examLabel": "CCA exam scheduled",
      "examDate": "Sep 2026",
      "progressLabel": "Prep modules",
      "progress": "3 / 10",
      "progressPct": 30,
      "recommended": {
        "name": "CCA Exam Prep",
        "org": "AHIMA-approved partner",
        "badge": "CEU-funded"
      },
      "completed": {
        "t": "Medical Terminology Basics",
        "d": "Completed Apr 2026"
      }
    },
    "sim": {
      "accuracy": 74,
      "speed": "12/hr",
      "time": "38 min",
      "level": "2/5",
      "breakdown": [
        {
          "n": "ICD-10-CM",
          "v": 71
        },
        {
          "n": "DRG Assignment",
          "v": 58
        },
        {
          "n": "Documentation review",
          "v": 65
        }
      ]
    },
    "skillDetail": {
      "name": "ICD-10-CM Coding",
      "tier": "developing",
      "metricLabel": "Charts coded",
      "accuracy": 71,
      "count": "180",
      "errors": [
        {
          "t": "Incorrect code",
          "n": 14
        },
        {
          "t": "Missing modifier",
          "n": 9
        },
        {
          "t": "Sequencing",
          "n": 8
        }
      ]
    },
    "map": {
      "skills": [
        "ICD-10-CM Coding",
        "ICD-10-PCS Coding",
        "DRG Assignment",
        "Documentation Review",
        "Medical Terminology",
        "Query Writing",
        "Compliance Judgment",
        "Error Detection",
        "Chart Auditing",
        "CPT/HCPCS Coding",
        "Payer Guidelines",
        "HIPAA Compliance",
        "EHR Systems",
        "Anatomy & Physiology",
        "Abstracting",
        "Pharmacology Basics",
        "Insurance Claims Review"
      ],
      "roles": [
        "Medical Assistants",
        "Medical Secretaries & Admin Assistants",
        "Billing & Posting Clerks",
        "Health Information Technologist",
        "Clinical Documentation Improvement",
        "Health Services Manager",
        "Healthcare Business/Operations Analyst",
        "Healthcare Compliance/Privacy Officer",
        "Bookkeeping, Accounting & Auditing Clerks",
        "Data Entry Keyers"
      ]
    }
  },
  "pk": {
    "outcome": {
      "salary": "$63,900/yr",
      "feedback": "Priya is the person we trust with the hardest charts. Her audit accuracy speaks for itself.",
      "attribution": "HIM Director, Lakeside Health System"
    },
    "employer": [
      {
        "from": "MAR 2017",
        "to": "PRESENT",
        "title": "Lakeside Health System",
        "role": "Inpatient Coding Specialist",
        "note": "verified via payroll"
      }
    ],
    "recordLabel": "Exceptional record",
    "recordSub": "9 years of verified inpatient coding work — among the strongest in her cohort.",
    "skills": [
      {
        "name": "ICD-10-CM Coding",
        "evidence": "8,200 charts coded · 98% accuracy",
        "tier": "expert",
        "trust": "documented",
        "icon": "a",
        "svg": "i-medical"
      },
      {
        "name": "ICD-10-PCS Coding",
        "evidence": "5,100 charts coded · 96% accuracy",
        "tier": "expert",
        "trust": "documented",
        "icon": "b",
        "svg": "i-medical"
      },
      {
        "name": "DRG Assignment",
        "evidence": "97% accuracy · 9 yrs verified tenure",
        "tier": "expert",
        "trust": "employer",
        "icon": "a",
        "svg": "i-target"
      },
      {
        "name": "Documentation Review",
        "evidence": "95% query accuracy",
        "tier": "expert",
        "trust": "documented",
        "icon": "c",
        "svg": "i-shield"
      }
    ],
    "ready": [
      {
        "title": "Medical Secretaries & Admin Assistants",
        "fit": 96,
        "svg": "i-target"
      },
      {
        "title": "Clinical Documentation Improvement",
        "fit": 93,
        "svg": "i-shield"
      }
    ],
    "matches": [
      {
        "title": "Medical Secretaries & Admin Assistants",
        "fit": 96,
        "transfer": 71.5,
        "meta": "Ready now",
        "good": true,
        "wage": "$44,090/yr median",
        "positions": [
          {
            "company": "Johns Hopkins Medicine",
            "logoImg": "assets/img/logo-johnshopkins.png",
            "role": "Medical Secretary, HIM Dept.",
            "location": "Baltimore, MD",
            "wage": "$42,000–$46,000/yr",
            "posted": "1 day ago"
          },
          {
            "company": "HCA Healthcare",
            "logoImg": "assets/img/logo-hca.png",
            "role": "Admin Assistant II",
            "location": "Remote",
            "wage": "$41,000–$45,500/yr",
            "posted": "4 days ago"
          }
        ]
      },
      {
        "title": "Clinical Documentation Improvement Specialist",
        "fit": 93,
        "transfer": 63.9,
        "meta": "Ready now",
        "good": true,
        "wage": "$85,000/yr median",
        "credential": "CCDS/CDIP"
      },
      {
        "title": "Health Services Manager",
        "fit": 84,
        "transfer": 30.2,
        "meta": "Ready in ~6 months · leadership credential",
        "wage": "$117,960/yr median",
        "credential": "Bachelor's degree",
        "positions": [
          {
            "company": "Ascension",
            "logoImg": "assets/img/logo-ascension.png",
            "role": "HIM Department Manager",
            "location": "Chicago, IL",
            "wage": "$112,000–$124,000/yr",
            "posted": "6 days ago"
          },
          {
            "company": "Optum",
            "logoImg": "assets/img/logo-optum.png",
            "role": "Health Information Manager",
            "location": "Remote",
            "wage": "$108,000–$118,000/yr",
            "posted": "2 weeks ago"
          }
        ]
      },
      {
        "title": "Health Information Technologist",
        "fit": 91,
        "transfer": 72.1,
        "meta": "Ready now",
        "wage": "$67,310/yr median",
        "credential": "RHIT"
      }
    ],
    "gap": {
      "title": "Health Services Manager",
      "fit": 84,
      "have": [
        {
          "t": "DRG Assignment",
          "d": "97% accuracy, verified"
        },
        {
          "t": "9 years verified tenure",
          "d": "Confirmed via payroll"
        },
        {
          "t": "CCS credential",
          "d": "Active since 2017"
        }
      ],
      "need": {
        "t": "Healthcare leadership credential",
        "d": "Not yet demonstrated"
      },
      "provider": {
        "name": "HIM Leadership Certificate",
        "org": "AHIMA-approved partner",
        "badge": "CEU-funded"
      }
    },
    "training": {
      "mode": "renewal",
      "dueLabel": "Due Jun 2026",
      "ceu": "18 / 20",
      "ceuPct": 90,
      "recommended": {
        "name": "HIM Leadership Certificate",
        "org": "AHIMA-approved partner",
        "badge": "CEU-funded"
      },
      "completed": {
        "t": "Advanced DRG Auditing",
        "d": "Completed Nov 2025"
      }
    },
    "sim": {
      "accuracy": 97,
      "speed": "34/hr",
      "time": "15 min",
      "level": "5/5",
      "breakdown": [
        {
          "n": "ICD-10-CM",
          "v": 98
        },
        {
          "n": "ICD-10-PCS",
          "v": 96
        },
        {
          "n": "DRG Assignment",
          "v": 97
        },
        {
          "n": "Documentation review",
          "v": 95
        }
      ]
    },
    "skillDetail": {
      "name": "DRG Assignment",
      "tier": "expert",
      "metricLabel": "Cases assessed",
      "accuracy": 97,
      "count": "5,100",
      "errors": [
        {
          "t": "Incorrect DRG",
          "n": 2
        },
        {
          "t": "Missing CC/MCC",
          "n": 1
        },
        {
          "t": "Sequencing",
          "n": 1
        }
      ]
    },
    "map": {
      "skills": [
        "ICD-10-CM Coding",
        "ICD-10-PCS Coding",
        "DRG Assignment",
        "Documentation Review",
        "Medical Terminology",
        "Query Writing",
        "Compliance Judgment",
        "Error Detection",
        "Chart Auditing",
        "CPT/HCPCS Coding",
        "Payer Guidelines",
        "HIPAA Compliance",
        "EHR Systems",
        "Anatomy & Physiology",
        "Abstracting",
        "Pharmacology Basics",
        "Insurance Claims Review"
      ],
      "roles": [
        "Clinical Documentation Improvement",
        "Health Information Technologist",
        "Health Services Manager",
        "Healthcare Compliance/Privacy Officer",
        "Healthcare Business/Operations Analyst",
        "Billing & Posting Clerks",
        "Medical Secretaries & Admin Assistants",
        "Medical Assistants",
        "Bookkeeping, Accounting & Auditing Clerks",
        "Data Entry Keyers"
      ]
    }
  },
  "dw": {
    "outcome": {
      "salary": "$52,300/yr",
      "feedback": "Denise made a smooth transition from patient access — her documentation instincts are already strong.",
      "attribution": "Coding Manager, Sunrise Medical Center"
    },
    "employer": [
      {
        "from": "MAY 2023",
        "to": "PRESENT",
        "title": "Sunrise Medical Center",
        "role": "Inpatient Coding Specialist",
        "note": "verified via payroll"
      },
      {
        "from": "JUN 2020",
        "to": "MAY 2023",
        "title": "Sunrise Medical Center",
        "role": "Patient Access Representative",
        "note": "verified via payroll"
      }
    ],
    "recordLabel": "Strong record",
    "recordSub": "2 years as a verified coder, building on 6 years total at Sunrise Medical Center.",
    "skills": [
      {
        "name": "ICD-10-CM Coding",
        "evidence": "2,100 charts coded · 90% accuracy",
        "tier": "advanced",
        "trust": "documented",
        "icon": "a",
        "svg": "i-medical"
      },
      {
        "name": "ICD-10-PCS Coding",
        "evidence": "1,200 charts coded · 85% accuracy",
        "tier": "advanced",
        "trust": "documented",
        "icon": "b",
        "svg": "i-medical"
      },
      {
        "name": "DRG Assignment",
        "evidence": "88% accuracy · 2 yrs verified coding tenure",
        "tier": "advanced",
        "trust": "employer",
        "icon": "a",
        "svg": "i-target"
      },
      {
        "name": "Documentation Review",
        "evidence": "86% query accuracy",
        "tier": "advanced",
        "trust": "documented",
        "icon": "c",
        "svg": "i-shield"
      }
    ],
    "ready": [
      {
        "title": "Health Information Technologist",
        "fit": 85,
        "svg": "i-doc"
      },
      {
        "title": "Billing & Posting Clerks",
        "fit": 79,
        "svg": "i-target"
      }
    ],
    "matches": [
      {
        "title": "Health Information Technologist",
        "fit": 85,
        "transfer": 72.1,
        "meta": "Ready now",
        "good": true,
        "wage": "$67,310/yr median",
        "credential": "RHIT",
        "positions": [
          {
            "company": "Cedars-Sinai",
            "logoImg": "assets/img/logo-cedarssinai.png",
            "role": "Health Information Technologist",
            "location": "Los Angeles, CA",
            "wage": "$66,000–$72,500/yr",
            "posted": "2 days ago"
          },
          {
            "company": "CVS Health",
            "logoImg": "assets/img/logo-cvs.png",
            "role": "HIM Technologist",
            "location": "Remote",
            "wage": "$63,000–$70,000/yr",
            "posted": "6 days ago"
          }
        ]
      },
      {
        "title": "Billing & Posting Clerks",
        "fit": 79,
        "transfer": 59.1,
        "meta": "Ready now",
        "wage": "$47,170/yr median"
      },
      {
        "title": "Clinical Documentation Improvement Specialist",
        "fit": 73,
        "transfer": 63.9,
        "closesAt": "L3 · Subtle errors",
        "meta": "Ready in ~6 months · 1 skill gap",
        "wage": "$85,000/yr median",
        "credential": "CCDS/CDIP",
        "positions": [
          {
            "company": "Johns Hopkins Medicine",
            "logoImg": "assets/img/logo-johnshopkins.png",
            "role": "CDI Specialist",
            "location": "Tampa, FL",
            "wage": "$80,000–$86,000/yr",
            "posted": "3 days ago"
          },
          {
            "company": "Kaiser Permanente",
            "logoImg": "assets/img/logo-kaiser.png",
            "role": "Clinical Documentation Improvement Specialist",
            "location": "Remote",
            "wage": "$78,000–$84,000/yr",
            "posted": "1 week ago"
          }
        ]
      },
      {
        "title": "Health Services Manager",
        "fit": 55,
        "transfer": 30.2,
        "meta": "Long-term pathway",
        "wage": "$117,960/yr median",
        "credential": "Bachelor's degree"
      }
    ],
    "gap": {
      "title": "CDI Specialist",
      "fit": 73,
      "have": [
        {
          "t": "ICD-10-PCS Coding",
          "d": "85% accuracy, verified"
        },
        {
          "t": "DRG Assignment",
          "d": "88% accuracy, verified"
        }
      ],
      "need": {
        "t": "CDI query writing",
        "d": "Structured physician queries — not yet demonstrated"
      },
      "provider": {
        "name": "CDI Practice Course",
        "org": "AHIMA-approved partner",
        "badge": "CEU-funded"
      }
    },
    "training": {
      "mode": "renewal",
      "dueLabel": "Due Aug 2027",
      "ceu": "9 / 20",
      "ceuPct": 45,
      "recommended": {
        "name": "CDI Practice Course",
        "org": "AHIMA-approved partner",
        "badge": "CEU-funded"
      },
      "completed": {
        "t": "ICD-10-PCS Foundations",
        "d": "Completed Nov 2023"
      }
    },
    "sim": {
      "accuracy": 89,
      "speed": "24/hr",
      "time": "25 min",
      "level": "4/5",
      "breakdown": [
        {
          "n": "ICD-10-CM",
          "v": 90
        },
        {
          "n": "ICD-10-PCS",
          "v": 85
        },
        {
          "n": "DRG Assignment",
          "v": 88
        },
        {
          "n": "Documentation review",
          "v": 86
        }
      ]
    },
    "skillDetail": {
      "name": "ICD-10-PCS Coding",
      "tier": "advanced",
      "metricLabel": "Charts coded",
      "accuracy": 85,
      "count": "1,200",
      "errors": [
        {
          "t": "Incorrect code",
          "n": 8
        },
        {
          "t": "Missing modifier",
          "n": 5
        },
        {
          "t": "Sequencing",
          "n": 4
        }
      ]
    },
    "map": {
      "skills": [
        "ICD-10-CM Coding",
        "ICD-10-PCS Coding",
        "DRG Assignment",
        "Documentation Review",
        "Medical Terminology",
        "Query Writing",
        "Compliance Judgment",
        "Error Detection",
        "Chart Auditing",
        "CPT/HCPCS Coding",
        "Payer Guidelines",
        "HIPAA Compliance",
        "EHR Systems",
        "Anatomy & Physiology",
        "Abstracting",
        "Pharmacology Basics",
        "Insurance Claims Review"
      ],
      "roles": [
        "Health Information Technologist",
        "Clinical Documentation Improvement",
        "Medical Assistants",
        "Billing & Posting Clerks",
        "Health Services Manager",
        "Healthcare Compliance/Privacy Officer",
        "Medical Secretaries & Admin Assistants",
        "Healthcare Business/Operations Analyst",
        "Bookkeeping, Accounting & Auditing Clerks",
        "Data Entry Keyers"
      ]
    }
  }
}
;

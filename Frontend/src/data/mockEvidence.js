export const mockEvidenceMap = {
  python: {
    skill_id: 'python',
    name: 'Python',
    proficiency: 88,
    confidence: 94,
    category: 'Programming Language',
    summary: 'High confidence based on extensive open-source GitHub repositories, complex OOP architecture, PyTorch deep learning implementations, and clean docstrings across multiple projects.',
    whyThisScore: 'Career DNA verified 14 Python project repositories with 450+ commits. Your code uses advanced language features such as async/await decorators, custom generators, dataclasses, and vectorized NumPy calculations. Points were deducted only for limited async server profiling.',
    sources: [
      {
        id: 'ev-1',
        sourceType: 'Resume',
        title: 'Resume Highlight & Experience',
        description: 'Described building machine learning microservices and data processing pipelines in Python during hackathons and course projects.',
        strength: 'STRONG',
        confidence: 90,
        date: '2026'
      },
      {
        id: 'ev-2',
        sourceType: 'GitHub Repository',
        title: 'ai-career-intelligence (Public Repo)',
        description: 'Contains 28 modular Python files, OOP inheritance patterns, Pydantic schemas, and structured error handling.',
        strength: 'HIGH',
        confidence: 96,
        date: '3 days ago'
      },
      {
        id: 'ev-3',
        sourceType: 'Commit History',
        title: 'Verified Version Control Activity',
        description: '450+ commits across 6 primary repositories with detailed commit messages and clean git diffs.',
        strength: 'STRONG',
        confidence: 95,
        date: 'Active'
      },
      {
        id: 'ev-4',
        sourceType: 'Code Analysis',
        title: 'Static Code AST Analysis',
        description: 'Verified usage of torch.nn.Module, asyncio.gather, dataclasses, pandas.read_csv, and custom exception classes.',
        strength: 'EXPERT',
        confidence: 92,
        date: 'Analyzed'
      },
      {
        id: 'ev-5',
        sourceType: 'Project Evidence',
        title: 'Vision Transformer Classifier',
        description: 'Implemented PyTorch neural network training loop with custom dataset loaders and WandB logging.',
        strength: 'HIGH',
        confidence: 90,
        date: '2 weeks ago'
      }
    ]
  },
  'machine-learning': {
    skill_id: 'machine-learning',
    name: 'Machine Learning',
    proficiency: 81,
    confidence: 88,
    category: 'Core AI',
    summary: 'Strong project evidence demonstrating dataset preprocessing, model evaluation (F1-score, ROC-AUC), cross-validation, and hyperparameter tuning.',
    whyThisScore: 'Your GitHub repositories contain 3 complete ML pipeline projects covering classification, regression, and transfer learning. Confidence is 88% due to clear script execution evidence in Jupyter notebooks and Python modules.',
    sources: [
      {
        id: 'ml-1',
        sourceType: 'Resume',
        title: 'Project Resume Entries',
        description: 'Listed experience with Scikit-learn, XGBoost, and hyperparameter tuning using Optuna.',
        strength: 'STRONG',
        confidence: 85,
        date: '2026'
      },
      {
        id: 'ml-2',
        sourceType: 'GitHub Repository',
        title: 'medical-image-classifier',
        description: 'Fine-tuned ResNet50 model using PyTorch with validation accuracy curves and confusion matrix rendering.',
        strength: 'HIGH',
        confidence: 92,
        date: '1 month ago'
      },
      {
        id: 'ml-3',
        sourceType: 'Code Analysis',
        title: 'Scikit-Learn & PyTorch Imports',
        description: 'Verified import of sklearn.model_selection.GridSearchCV, sklearn.metrics.classification_report, and torch.optim.AdamW.',
        strength: 'STRONG',
        confidence: 88,
        date: 'Analyzed'
      }
    ]
  },
  pytorch: {
    skill_id: 'pytorch',
    name: 'PyTorch / Deep Learning',
    proficiency: 76,
    confidence: 82,
    category: 'Core AI',
    summary: 'Demonstrated experience in custom torch modules, loss functions, GPU tensor management, and dataset loaders.',
    whyThisScore: 'Verified usage of PyTorch in 2 hackathon projects. Evaluated positively for custom dataset classes and training loops.',
    sources: [
      {
        id: 'pt-1',
        sourceType: 'GitHub Repository',
        title: 'vision-transformer-pytorch',
        description: 'Custom multi-head self-attention module built with torch.nn.Parameter and einsum tensor operations.',
        strength: 'HIGH',
        confidence: 85,
        date: '3 weeks ago'
      }
    ]
  },
  git: {
    skill_id: 'git',
    name: 'Git & Version Control',
    proficiency: 85,
    confidence: 96,
    category: 'Engineering',
    summary: 'Exceptional commit consistency, feature branch discipline, pull request reviews, and tag releases.',
    whyThisScore: 'Career DNA analyzed git logs directly. Verified 450+ commits with average 4 commits/day during active development windows.',
    sources: [
      {
        id: 'git-1',
        sourceType: 'Commit History',
        title: 'GitHub Commit Graph Analysis',
        description: 'Consistently structured commit messages adhering to conventional commit standards.',
        strength: 'EXPERT',
        confidence: 96,
        date: 'Active'
      }
    ]
  },
  sql: {
    skill_id: 'sql',
    name: 'SQL & Data Warehousing',
    proficiency: 62,
    confidence: 78,
    category: 'Data',
    summary: 'Moderate evidence. Basic SQL statements found in data preprocessing scripts, but missing advanced query benchmarks or ORM schemas.',
    whyThisScore: 'You claimed SQL proficiency on your resume, but GitHub code inspection found only simple SELECT/WHERE queries in 1 repository. Lack of complex JOINs or CTEs keeps evidence confidence at 78% and proficiency at 62.',
    sources: [
      {
        id: 'sql-1',
        sourceType: 'Resume',
        title: 'Resume Claim',
        description: 'Claims SQL & PostgreSQL database experience on resume.',
        strength: 'MODERATE',
        confidence: 70,
        date: '2026'
      },
      {
        id: 'sql-2',
        sourceType: 'Code Analysis',
        title: 'SQL Script Inspection',
        description: 'Found simple query strings in sqlite3 wrapper script. No index creation or schema migrations detected.',
        strength: 'WEAK',
        confidence: 80,
        date: '2 months ago'
      }
    ]
  },
  fastapi: {
    skill_id: 'fastapi',
    name: 'FastAPI / Model APIs',
    proficiency: 58,
    confidence: 64,
    category: 'Backend',
    summary: 'Basic FastAPI routing present in one repository. Limited evidence of authentication, middleware, or dockerized deployment.',
    whyThisScore: 'FastAPI routes were detected in 1 repo, but lack deployment files like Dockerfile, CORS security setup, or automated OpenAPI test suites.',
    sources: [
      {
        id: 'fa-1',
        sourceType: 'GitHub Repository',
        title: 'backend-demo-api',
        description: 'Contains main.py with 3 basic @app.get() routes.',
        strength: 'MODERATE',
        confidence: 64,
        date: '1 month ago'
      }
    ]
  },
  docker: {
    skill_id: 'docker',
    name: 'Docker / MLOps',
    proficiency: 42,
    confidence: 50,
    category: 'DevOps',
    summary: 'Minimal evidence. Mentioned once in README file; no active Dockerfile or container orchestration found in repositories.',
    whyThisScore: 'Docker was listed as a skill in your setup, but code analysis found zero Dockerfiles or docker-compose.yml files across all connected GitHub repositories.',
    sources: [
      {
        id: 'dk-1',
        sourceType: 'Resume',
        title: 'Resume Mention',
        description: 'Listed Docker under DevOps skills on resume.',
        strength: 'UNVERIFIED',
        confidence: 50,
        date: '2026'
      }
    ]
  }
}

export const getSkillEvidence = (skillId) => {
  const normalizedKey = (skillId || 'python').toLowerCase().replace(/\s+/g, '-')
  return mockEvidenceMap[normalizedKey] || mockEvidenceMap[skillId] || {
    skill_id: skillId,
    name: skillId ? skillId.toUpperCase() : 'Skill',
    proficiency: 65,
    confidence: 75,
    category: 'General Technical',
    summary: `Demonstrated foundational capabilities in ${skillId}.`,
    whyThisScore: `Score calculated by evaluating resume claims against verified repository code metrics for ${skillId}.`,
    sources: [
      {
        id: 'gen-1',
        sourceType: 'Resume',
        title: 'Resume Keyword Analysis',
        description: `Mentioned ${skillId} in technical projects.`,
        strength: 'MODERATE',
        confidence: 75,
        date: '2026'
      }
    ]
  }
}

export default mockEvidenceMap

export const mockCareerDNAMap = {
  'AI/ML Engineer': {
    user_id: 'usr_hacknexus_2026',
    role: 'AI/ML Engineer',
    readiness_score: 82,
    readiness_status: 'Strong Foundation',
    summary: 'Your evidence shows strong Python proficiency and deep learning fundamentals. High commit volume on PyTorch & Scikit-Learn projects. Primary gap is containerization (Docker) & serving FastAPI models at production scale.',
    skills: [
      { skill_id: 'python', name: 'Python', proficiency: 88, confidence: 94, category: 'Programming', explanation: '450+ commits, multiple PyTorch/TensorFlow repos, clean OOP structure.' },
      { skill_id: 'machine-learning', name: 'Machine Learning', proficiency: 81, confidence: 88, category: 'Core AI', explanation: 'Demonstrated model training, hyperparameter tuning, & evaluation metrics in 3 repositories.' },
      { skill_id: 'pytorch', name: 'PyTorch / Neural Networks', proficiency: 76, confidence: 82, category: 'Core AI', explanation: 'Built custom CNN & Transformer vision models in hackathon projects.' },
      { skill_id: 'git', name: 'Git & Version Control', proficiency: 85, confidence: 96, category: 'Engineering', explanation: 'Consistent commit graph, active PR reviews, structured branch strategies.' },
      { skill_id: 'sql', name: 'SQL & Data Warehousing', proficiency: 62, confidence: 78, category: 'Data', explanation: 'Basic query usage found in analysis scripts; limited complex join / CTE evidence.' },
      { skill_id: 'fastapi', name: 'FastAPI / Model APIs', proficiency: 58, confidence: 64, category: 'Backend', explanation: 'REST endpoints declared in 1 repository, lacking middleware & validation schemas.' },
      { skill_id: 'docker', name: 'Docker / MLOps', proficiency: 42, confidence: 50, category: 'DevOps', explanation: 'Minimal Dockerfile evidence; no CI/CD deployment pipelines detected.' }
    ],
    strengths: [
      'Advanced Python & NumPy data manipulation',
      'Solid PyTorch model training workflow',
      'High GitHub commit velocity & clean documentation',
      'Solid foundation in ML evaluation metrics'
    ],
    weaknesses: [
      'Production API development with FastAPI',
      'Containerization (Docker / Kubernetes)',
      'Advanced SQL CTEs & data pipeline indexing',
      'ML model monitoring & latency optimization'
    ]
  },
  'Software Engineer': {
    user_id: 'usr_hacknexus_2026',
    role: 'Software Engineer',
    readiness_score: 76,
    readiness_status: 'Ready for Mid-Level',
    summary: 'Solid full-stack JavaScript/React foundation and Git workflows. Demonstrated capacity in frontend architectures and state management. Main gap is backend system design & relational database optimization.',
    skills: [
      { skill_id: 'javascript', name: 'JavaScript / ES6+', proficiency: 86, confidence: 92, category: 'Frontend', explanation: 'Extensive use of async/await, closures, promises, and modern ES features.' },
      { skill_id: 'react', name: 'React & State Management', proficiency: 84, confidence: 90, category: 'Frontend', explanation: 'Built multiple SPAs, custom hooks, and React Context state workflows.' },
      { skill_id: 'git', name: 'Git & Collaboration', proficiency: 85, confidence: 96, category: 'Engineering', explanation: 'High activity, clean commit history, modular code organization.' },
      { skill_id: 'python', name: 'Python Backend', proficiency: 72, confidence: 80, category: 'Backend', explanation: 'Used for scripts and utility algorithms across repositories.' },
      { skill_id: 'sql', name: 'PostgreSQL & SQL', proficiency: 60, confidence: 70, category: 'Database', explanation: 'Basic CRUD operations; missing relational schema migrations & indexing.' },
      { skill_id: 'system-design', name: 'System Design & Architecture', proficiency: 52, confidence: 58, category: 'Architecture', explanation: 'Monolithic project layouts; lacks evidence of caching (Redis) or microservices.' }
    ],
    strengths: [
      'Modern React SPA development with clean hooks',
      'Strong JavaScript fundamentals and async programming',
      'High version control discipline and branch management',
      'Responsive UI component composition'
    ],
    weaknesses: [
      'Relational schema design & SQL query optimization',
      'System design principles (Caching, Load Balancing)',
      'Automated testing (Jest, Cypress, Integration tests)'
    ]
  },
  'Data Scientist': {
    user_id: 'usr_hacknexus_2026',
    role: 'Data Scientist',
    readiness_score: 79,
    readiness_status: 'Proficient Analyst',
    summary: 'Proven ability in exploratory data analysis (EDA), Pandas, and statistical modeling. Lacks scalable ETL data engineering pipelines and cloud deployment experience.',
    skills: [
      { skill_id: 'python', name: 'Python (Pandas/NumPy)', proficiency: 90, confidence: 95, category: 'Analytics', explanation: 'Extensive Jupyter Notebook evidence, vectorization, and pandas data cleaning.' },
      { skill_id: 'machine-learning', name: 'Scikit-Learn & Modeling', proficiency: 78, confidence: 84, category: 'Modeling', explanation: 'Implemented Regression, Random Forests, XGBoost across 4 datasets.' },
      { skill_id: 'sql', name: 'SQL Analytics', proficiency: 70, confidence: 80, category: 'Data', explanation: 'Window functions and aggregation queries verified in notebook analysis.' },
      { skill_id: 'visualization', name: 'Matplotlib & Seaborn', proficiency: 85, confidence: 90, category: 'Analytics', explanation: 'Clear visualization outputs, plot customizations, and statistical dashboards.' },
      { skill_id: 'data-engineering', name: 'Data Pipelines & Airflow', proficiency: 45, confidence: 52, category: 'Data Eng', explanation: 'Manual script execution; missing automated orchestrators like Airflow.' }
    ],
    strengths: [
      'Expertise in Pandas data wrangling and EDA',
      'Strong statistical visualization skills',
      'Good practical application of Scikit-Learn baseline models'
    ],
    weaknesses: [
      'Automated data pipeline orchestration',
      'Big Data tools (Spark / PySpark)',
      'Model deployment & REST API integration'
    ]
  }
}

export const mockCareerDNA = mockCareerDNAMap['AI/ML Engineer']
export default mockCareerDNA

export const mockSkillGapsMap = {
  'AI/ML Engineer': [
    {
      skill_id: 'docker',
      skill: 'Docker / Containerization',
      category: 'DevOps & MLOps',
      current_level: 42,
      required_level: 80,
      gap_size: 38,
      priority: 'CRITICAL',
      reason: 'AI/ML Engineers must package model weights, CUDA dependencies, and microservices into reproducible Docker containers.',
      role: 'AI/ML Engineer'
    },
    {
      skill_id: 'fastapi',
      skill: 'FastAPI Serving',
      category: 'Backend Architecture',
      current_level: 58,
      required_level: 85,
      gap_size: 27,
      priority: 'CRITICAL',
      reason: 'Exposing trained models via asynchronous REST endpoints with Pydantic request validation is essential for production inference.',
      role: 'AI/ML Engineer'
    },
    {
      skill_id: 'sql',
      skill: 'SQL & Database Indexing',
      category: 'Data Storage',
      current_level: 62,
      required_level: 80,
      gap_size: 18,
      priority: 'HIGH',
      reason: 'Extracting feature store data efficiently requires multi-table JOINs, subqueries, and indexed queries.',
      role: 'AI/ML Engineer'
    },
    {
      skill_id: 'data-engineering',
      skill: 'ETL Feature Pipelines',
      category: 'Data Engineering',
      current_level: 52,
      required_level: 75,
      gap_size: 23,
      priority: 'HIGH',
      reason: 'Preprocessing raw streams into clean model features requires structured ETL pipeline knowledge.',
      role: 'AI/ML Engineer'
    },
    {
      skill_id: 'pytorch',
      skill: 'PyTorch Deep Learning',
      category: 'Model Frameworks',
      current_level: 76,
      required_level: 85,
      gap_size: 9,
      priority: 'MEDIUM',
      reason: 'Your PyTorch skills are strong; fine-tuning LLMs and attention architectures will push you into top tier.',
      role: 'AI/ML Engineer'
    }
  ],
  'Software Engineer': [
    {
      skill_id: 'system-design',
      skill: 'System Design & Scalability',
      category: 'Architecture',
      current_level: 52,
      required_level: 85,
      gap_size: 33,
      priority: 'CRITICAL',
      reason: 'Designing distributed systems, cache strategies (Redis), and load balancing is vital for mid-to-senior roles.',
      role: 'Software Engineer'
    },
    {
      skill_id: 'sql',
      skill: 'Database Design & ORMs',
      category: 'Backend',
      current_level: 60,
      required_level: 80,
      gap_size: 20,
      priority: 'HIGH',
      reason: 'Relational migrations, normalized schemas, and transaction management are required for backend reliability.',
      role: 'Software Engineer'
    },
    {
      skill_id: 'testing',
      skill: 'Automated Testing (Jest / Vitest)',
      category: 'Quality Assurance',
      current_level: 45,
      required_level: 75,
      gap_size: 30,
      priority: 'HIGH',
      reason: 'Unit and integration test suites demonstrate production code maturity.',
      role: 'Software Engineer'
    }
  ],
  'Data Scientist': [
    {
      skill_id: 'data-engineering',
      skill: 'Data Pipeline Orchestration',
      category: 'Data Infrastructure',
      current_level: 45,
      required_level: 80,
      gap_size: 35,
      priority: 'CRITICAL',
      reason: 'Automating batch jobs and data ingestion pipelines ensures data fresh for analytical dashboards.',
      role: 'Data Scientist'
    },
    {
      skill_id: 'deployment',
      skill: 'Model API Deployment',
      category: 'MLOps',
      current_level: 48,
      required_level: 75,
      gap_size: 27,
      priority: 'HIGH',
      reason: 'Converting Jupyter notebook prototypes into reusable predictions endpoints.',
      role: 'Data Scientist'
    }
  ]
}

export const mockSkillGaps = mockSkillGapsMap['AI/ML Engineer']
export default mockSkillGaps

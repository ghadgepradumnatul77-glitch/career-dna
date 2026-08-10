export const mockNextAction = {
  action: 'Build and deploy an ML API using FastAPI',
  reasoning: 'Your machine learning proficiency is strong (78/100), but your evidence for production deployment is limited (FastAPI: 55/100, Docker: 48/100). This is a critical gap for AI/ML Engineer roles. Building a real API endpoint demonstrates both backend development AND deployment skills.',
  expected_impact: 'This project would significantly improve your readiness score and provide concrete evidence for deployment capabilities. It bridges your ML knowledge with production-grade engineering practices.',
  estimated_effort: '20-30 hours',
  roadmap: [
    {
      step: 1,
      title: 'Train an ML model',
      description: 'Use your existing ML knowledge to train a classifier or regression model on a public dataset.',
      estimatedHours: 4,
      resources: ['Scikit-learn documentation', 'Kaggle datasets']
    },
    {
      step: 2,
      title: 'Create a FastAPI endpoint',
      description: 'Build a REST API with FastAPI that accepts input data and returns model predictions.',
      estimatedHours: 6,
      resources: ['FastAPI official guide', 'Pydantic documentation']
    },
    {
      step: 3,
      title: 'Containerize with Docker',
      description: 'Create a Dockerfile and docker-compose.yml to containerize your application.',
      estimatedHours: 4,
      resources: ['Docker documentation', 'Best practices guide']
    },
    {
      step: 4,
      title: 'Deploy to the cloud',
      description: 'Deploy your Docker container to a cloud platform (AWS, GCP, Render, or Railway).',
      estimatedHours: 6,
      resources: ['Platform deployment guides', 'CI/CD tutorials']
    }
  ],
  current_gaps: [
    {
      gap: 'FastAPI',
      level: 55,
      importance: 'CRITICAL'
    },
    {
      gap: 'Docker',
      level: 48,
      importance: 'CRITICAL'
    }
  ]
}

export default mockNextAction

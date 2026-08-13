export const mockNextActionMap = {
  'AI/ML Engineer': {
    action: 'Build and deploy a production ML Inference API using FastAPI & Docker',
    reasoning: 'Your machine learning proficiency is strong (81/100), but your evidence for production deployment is limited (FastAPI: 58/100, Docker: 42/100). This is your largest critical gap for AI/ML Engineer roles. Building a containerized REST API bridges your model training knowledge with real-world engineering.',
    expected_impact: 'Increases your overall AI/ML Engineer Career Readiness Score from 82 to 91+. Proves containerization, web server routing, and model inference latency optimization.',
    estimated_effort: '15-20 hours',
    target_role: 'AI/ML Engineer',
    current_gaps: [
      { gap: 'Docker Containerization', level: 42, importance: 'CRITICAL' },
      { gap: 'FastAPI Serving', level: 58, importance: 'CRITICAL' }
    ],
    roadmap: [
      {
        step: 1,
        title: 'Export Trained PyTorch Model',
        description: 'Serialize your trained vision or text classification PyTorch model to ONNX or TorchScript format for efficient CPU/GPU inference.',
        estimatedHours: 3,
        resources: ['PyTorch ONNX Export Guide', 'TorchScript Documentation']
      },
      {
        step: 2,
        title: 'Build Async FastAPI Microservice',
        description: 'Construct a FastAPI server with a POST /predict endpoint, Pydantic data schemas, file payload handling, and health check routes.',
        estimatedHours: 5,
        resources: ['FastAPI Official Tutorial', 'Pydantic V2 Usage']
      },
      {
        step: 3,
        title: 'Containerize with Docker Multi-Stage Build',
        description: 'Write a multi-stage Dockerfile using python:3.11-slim, install lightweight dependencies, optimize layer caching, and configure Gunicorn/Uvicorn workers.',
        estimatedHours: 4,
        resources: ['Docker Multi-Stage Build Guide', 'Uvicorn Deployment Docs']
      },
      {
        step: 4,
        title: 'Deploy to Cloud & Add GitHub CI/CD Action',
        description: 'Deploy the Docker container to Render or AWS App Runner and configure a GitHub Action workflow to automate build & deploy on main branch commits.',
        estimatedHours: 6,
        resources: ['GitHub Actions Docker Build', 'Render Deployment Guide']
      }
    ]
  },
  'Software Engineer': {
    action: 'Design and implementation of a Redis Caching Layer & PostgreSQL Migration Suite',
    reasoning: 'Your frontend React & JS skills are solid (86/100), but backend system design (52/100) and SQL optimization (60/100) limit your software engineering score. Adding a cache layer & database migrations provides evidence of backend architectural depth.',
    expected_impact: 'Boosts Software Engineer readiness from 76 to 88. Demonstrates backend query optimization, caching strategies, and data persistence.',
    estimated_effort: '12-16 hours',
    target_role: 'Software Engineer',
    current_gaps: [
      { gap: 'System Design & Scalability', level: 52, importance: 'CRITICAL' },
      { gap: 'Database Design & ORMs', level: 60, importance: 'HIGH' }
    ],
    roadmap: [
      {
        step: 1,
        title: 'Schema Normalization & Prisma Migration',
        description: 'Design normalized PostgreSQL database tables with foreign key constraints, indexes, and write migration scripts.',
        estimatedHours: 4,
        resources: ['PostgreSQL Indexing Docs', 'Prisma Schema Guide']
      },
      {
        step: 2,
        title: 'Implement Redis Cache Strategy',
        description: 'Integrate Redis in-memory cache to store high-frequency GET query results with TTL cache invalidation.',
        estimatedHours: 4,
        resources: ['Redis Node/Python Client Docs']
      },
      {
        step: 3,
        title: 'Write Integration Test Suite with Vitest',
        description: 'Automate endpoint testing covering database transactions, cache hits, and cache misses.',
        estimatedHours: 4,
        resources: ['Vitest API Testing Guide']
      }
    ]
  },
  'Data Scientist': {
    action: 'Create an Automated Airflow Data Extraction Pipeline with Cloud Storage',
    reasoning: 'Your statistical modeling and Pandas skills are top-tier (90/100), but your automated ETL pipeline score (45/100) holds back full data engineering maturity.',
    expected_impact: 'Raises Data Scientist readiness from 79 to 89+. Verifies end-to-end data pipeline automation.',
    estimated_effort: '14-18 hours',
    target_role: 'Data Scientist',
    current_gaps: [
      { gap: 'Data Pipeline Orchestration', level: 45, importance: 'CRITICAL' }
    ],
    roadmap: [
      {
        step: 1,
        title: 'Draft DAG Ingestion Workflow',
        description: 'Write Apache Airflow DAGs to extract raw API data on a daily schedule.',
        estimatedHours: 5,
        resources: ['Apache Airflow Tutorial']
      },
      {
        step: 2,
        title: 'Automate Parquet Storage',
        description: 'Transform raw JSON data into compressed Parquet files saved to S3/GCS bucket.',
        estimatedHours: 5,
        resources: ['PyArrow Parquet Guide']
      },
      {
        step: 3,
        title: 'Build Interactive Streamlit Dashboard',
        description: 'Connect dashboard visualizations directly to the refreshed data warehouse.',
        estimatedHours: 4,
        resources: ['Streamlit Docs']
      }
    ]
  }
}

export const mockNextAction = mockNextActionMap['AI/ML Engineer']
export default mockNextAction

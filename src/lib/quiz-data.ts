interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  category?: string
  explanation?: string
}

// Simulated database/API call - in real app, this would fetch from your data source
export async function getQuizQuestions(): Promise<QuizQuestion[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  return [
    {
      id: 1,
      question: "What is the maximum execution time for an AWS Lambda function?",
      options: ["5 minutes", "10 minutes", "15 minutes", "30 minutes"],
      correctAnswer: 2,
      category: "AWS Lambda",
      explanation: "AWS Lambda functions can run for a maximum of 15 minutes.",
    },
    {
      id: 2,
      question: "Which AWS service is best suited for hosting static websites?",
      options: ["EC2", "S3", "Lambda", "RDS"],
      correctAnswer: 1,
      category: "AWS S3",
      explanation: "S3 (Simple Storage Service) is ideal for hosting static websites with built-in web hosting capabilities.",
    },
    {
      id: 3,
      question: "What is the default memory allocation for a new Lambda function?",
      options: ["64 MB", "128 MB", "256 MB", "512 MB"],
      correctAnswer: 1,
      category: "AWS Lambda",
      explanation: "New Lambda functions are created with 128 MB of memory by default.",
    },
    {
      id: 4,
      question: "Which AWS service provides a NoSQL database?",
      options: ["RDS", "Redshift", "DynamoDB", "Aurora"],
      correctAnswer: 2,
      category: "AWS DynamoDB",
      explanation: "DynamoDB is AWS's fully managed NoSQL database service.",
    },
    {
      id: 5,
      question: "What triggers can invoke AWS Lambda functions?",
      options: ["S3 events only", "API Gateway only", "Multiple AWS services and events", "CloudWatch only"],
      correctAnswer: 2,
      category: "AWS Lambda",
      explanation: "Lambda functions can be triggered by many AWS services including S3, API Gateway, CloudWatch, DynamoDB, and more.",
    },
    {
      id: 6,
      question: "Which EC2 instance type is optimized for compute-intensive applications?",
      options: ["t3.micro", "m5.large", "c5.xlarge", "r5.large"],
      correctAnswer: 2,
      category: "AWS EC2",
      explanation: "C5 instances are compute-optimized and designed for compute-intensive applications.",
    },
    {
      id: 7,
      question: "What is the maximum size of an object that can be stored in S3?",
      options: ["5 GB", "5 TB", "100 GB", "1 TB"],
      correctAnswer: 1,
      category: "AWS S3",
      explanation: "The maximum size for a single S3 object is 5 TB.",
    },
    {
      id: 8,
      question: "Which AWS service helps you manage API endpoints?",
      options: ["Route 53", "CloudFront", "API Gateway", "Load Balancer"],
      correctAnswer: 2,
      category: "AWS API Gateway",
      explanation: "API Gateway is AWS's service for creating, publishing, maintaining, monitoring, and securing APIs.",
    },
    {
      id: 9,
      question: "What is the pricing model for AWS Lambda?",
      options: ["Pay per hour", "Pay per request and compute time", "Monthly subscription", "Pay per GB stored"],
      correctAnswer: 1,
      category: "AWS Lambda",
      explanation: "Lambda uses a pay-per-request model, charging for the number of requests and the compute time consumed.",
    },
    {
      id: 10,
      question: "Which AWS service provides content delivery network (CDN) capabilities?",
      options: ["S3", "CloudFront", "Route 53", "VPC"],
      correctAnswer: 1,
      category: "AWS CloudFront",
      explanation: "CloudFront is AWS's content delivery network service that delivers content with low latency.",
    },
  ]
}
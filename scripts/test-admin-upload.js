const fs = require('fs');

// Test data for CSA questions
const testData = {
  "certification": "AWS Certified Solutions Architect (CSA)",
  "description": "AWS CSA Practice Questions",
  "version": "1.0",
  "questions": [
    {
      "id": "csa-test-001",
      "question": "Which AWS service provides a fully managed NoSQL database service?",
      "options": [
        "Amazon RDS",
        "Amazon DynamoDB",
        "Amazon Redshift", 
        "Amazon ElastiCache"
      ],
      "correct_answer": 1,
      "explanation": "Amazon DynamoDB is a fully managed NoSQL database service that provides fast and predictable performance with seamless scalability.",
      "difficulty": "easy",
      "tags": ["database", "nosql", "managed-services"],
      "domain": "Database"
    },
    {
      "id": "csa-test-002",
      "question": "What is the maximum number of availability zones in a single AWS region?",
      "options": [
        "3",
        "6",
        "12", 
        "Unlimited"
      ],
      "correct_answer": 3,
      "explanation": "AWS regions can have multiple availability zones, and the number varies by region. There's no fixed maximum.",
      "difficulty": "medium",
      "tags": ["availability-zones", "regions", "infrastructure"],
      "domain": "Infrastructure"
    },
    {
      "id": "csa-test-003",
      "question": "Which AWS service is best for storing and retrieving large amounts of unstructured data?",
      "options": [
        "Amazon S3",
        "Amazon EBS",
        "Amazon EFS",
        "Amazon Glacier"
      ],
      "correct_answer": 0,
      "explanation": "Amazon S3 (Simple Storage Service) is designed for storing and retrieving any amount of data from anywhere on the web.",
      "difficulty": "easy",
      "tags": ["storage", "s3", "unstructured-data"],
      "domain": "Storage"
    }
  ]
};

async function testAdminUpload() {
  try {
    console.log('🧪 Testing admin upload functionality...');
    
    const response = await fetch('http://localhost:3002/api/admin/questions/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Upload successful!');
      console.log('📊 Results:', {
        certification: result.certification,
        questionsAdded: result.questionsAdded,
        questionsUpdated: result.questionsUpdated,
        totalProcessed: result.totalProcessed
      });
    } else {
      console.error('❌ Upload failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Save test data to file
fs.writeFileSync('./test-csa-questions.json', JSON.stringify(testData, null, 2));
console.log('📁 Test data saved to test-csa-questions.json');

// Run test
testAdminUpload();

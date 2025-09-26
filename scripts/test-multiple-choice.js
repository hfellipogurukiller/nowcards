const fs = require('fs');

// Test data for multiple choice questions
const testData = {
  "certification": "AWS Certified Solutions Architect (CSA)",
  "description": "AWS CSA Multiple Choice Questions",
  "version": "1.1",
  "questions": [
    {
      "id": "csa-multi-001",
      "question": "Which of the following are benefits of using AWS Auto Scaling? (Select all that apply)",
      "options": [
        "Automatic scaling based on demand",
        "Cost optimization", 
        "High availability",
        "Manual intervention required"
      ],
      "correct_answers": [0, 1, 2],
      "explanation": "AWS Auto Scaling provides automatic scaling, cost optimization, and high availability. Manual intervention is not a benefit of Auto Scaling.",
      "difficulty": "medium",
      "tags": ["auto-scaling", "cost-optimization", "availability"],
      "domain": "Compute"
    },
    {
      "id": "csa-multi-002", 
      "question": "What are the key features of Amazon RDS? (Choose all that apply)",
      "options": [
        "Managed database service",
        "Automatic backups",
        "Manual scaling only",
        "Multi-AZ deployment"
      ],
      "correct_answers": [0, 1, 3],
      "explanation": "Amazon RDS is a managed service with automatic backups and Multi-AZ deployment. It supports automatic scaling, not just manual scaling.",
      "difficulty": "medium",
      "tags": ["rds", "database", "managed-services"],
      "domain": "Database"
    },
    {
      "id": "csa-multi-003",
      "question": "Which AWS services provide storage solutions? (Select all that apply)",
      "options": [
        "Amazon S3",
        "Amazon EBS",
        "Amazon Lambda",
        "Amazon EFS"
      ],
      "correct_answers": [0, 1, 3],
      "explanation": "Amazon S3, EBS, and EFS are storage services. Lambda is a compute service, not storage.",
      "difficulty": "easy",
      "tags": ["storage", "s3", "ebs", "efs"],
      "domain": "Storage"
    }
  ]
};

async function testMultipleChoiceUpload() {
  try {
    console.log('🧪 Testing multiple choice questions upload...');
    
    const response = await fetch('http://localhost:3002/api/admin/questions/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Multiple choice upload successful!');
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
fs.writeFileSync('./test-multiple-choice.json', JSON.stringify(testData, null, 2));
console.log('📁 Test data saved to test-multiple-choice.json');

// Run test
testMultipleChoiceUpload();

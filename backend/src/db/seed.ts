import { getDatabase } from './database.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const categories = [
  { id: 'delivery', name: 'Delivery', description: 'Project delivery and milestones' },
  { id: 'self-dev', name: 'Self development', description: 'Personal and professional growth' },
  { id: 'solution-plus', name: 'Solution+', description: 'Innovation and improvements' },
  { id: 'customer-success', name: 'Customer Success', description: 'Customer relationship and satisfaction' },
  { id: 'team-mgmt', name: 'Team management', description: 'Leadership and team coordination' }
];

const subcategories = [
  // Delivery subcategories
  { id: uuidv4(), category_id: 'delivery', name: 'Milestone', description: 'Project milestones' },
  { id: uuidv4(), category_id: 'delivery', name: 'Reporting', description: 'Status and progress reporting' },
  { id: uuidv4(), category_id: 'delivery', name: 'Documentation', description: 'Technical documentation' },
  { id: uuidv4(), category_id: 'delivery', name: 'Implementation', description: 'Feature implementation' },
  { id: uuidv4(), category_id: 'delivery', name: 'Testing', description: 'Quality assurance and testing' },

  // Self development subcategories
  { id: uuidv4(), category_id: 'self-dev', name: 'Education', description: 'Learning and courses' },
  { id: uuidv4(), category_id: 'self-dev', name: 'Training', description: 'Skills training' },
  { id: uuidv4(), category_id: 'self-dev', name: 'Certification', description: 'Professional certifications' },
  { id: uuidv4(), category_id: 'self-dev', name: 'Skill Building', description: 'Skill development' },
  { id: uuidv4(), category_id: 'self-dev', name: 'Learning', description: 'General learning activities' },

  // Solution+ subcategories
  { id: uuidv4(), category_id: 'solution-plus', name: 'Innovation', description: 'New ideas and innovations' },
  { id: uuidv4(), category_id: 'solution-plus', name: 'Review', description: 'Process and code reviews' },
  { id: uuidv4(), category_id: 'solution-plus', name: 'Research', description: 'Technical research' },
  { id: uuidv4(), category_id: 'solution-plus', name: 'Improvement', description: 'Process improvements' },
  { id: uuidv4(), category_id: 'solution-plus', name: 'Optimization', description: 'Performance optimization' },

  // Customer Success subcategories
  { id: uuidv4(), category_id: 'customer-success', name: 'Support', description: 'Customer support' },
  { id: uuidv4(), category_id: 'customer-success', name: 'Relationship', description: 'Client relationship management' },
  { id: uuidv4(), category_id: 'customer-success', name: 'Feedback', description: 'Customer feedback handling' },
  { id: uuidv4(), category_id: 'customer-success', name: 'Communication', description: 'Client communication' },
  { id: uuidv4(), category_id: 'customer-success', name: 'Satisfaction', description: 'Customer satisfaction' },

  // Team management subcategories
  { id: uuidv4(), category_id: 'team-mgmt', name: 'Leadership', description: 'Team leadership activities' },
  { id: uuidv4(), category_id: 'team-mgmt', name: 'Mentoring', description: 'Team member mentoring' },
  { id: uuidv4(), category_id: 'team-mgmt', name: 'Planning', description: 'Project and team planning' },
  { id: uuidv4(), category_id: 'team-mgmt', name: 'Coordination', description: 'Team coordination' },
  { id: uuidv4(), category_id: 'team-mgmt', name: 'Process', description: 'Process management' }
];

export async function seed() {
  const db = getDatabase();
  
  console.log('Seeding database...');
  
  try {
    // Clear existing data to avoid duplicates
    await db.run('DELETE FROM status_updates');
    await db.run('DELETE FROM reports');
    await db.run('DELETE FROM actions');
    await db.run('DELETE FROM subcategories');
    await db.run('DELETE FROM categories');
    await db.run('DELETE FROM users WHERE role != "admin" OR email != "admin@smartreport.com"');
    
    // Create default admin user
    const adminId = uuidv4();
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    await db.run(
      `INSERT OR REPLACE INTO users (id, email, name, password_hash, role) 
       VALUES (?, ?, ?, ?, ?)`,
      [adminId, 'admin@smartreport.com', 'Admin User', adminPassword, 'admin']
    );

    // Create default user
    const userId = uuidv4();
    const userPassword = await bcrypt.hash('user123', 10);
    
    await db.run(
      `INSERT OR REPLACE INTO users (id, email, name, password_hash, role) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, 'user@smartreport.com', 'Alice Johnson', userPassword, 'user']
    );

    // Insert categories
    for (const category of categories) {
      await db.run(
        `INSERT OR REPLACE INTO categories (id, name, description) VALUES (?, ?, ?)`,
        [category.id, category.name, category.description]
      );
    }

    // Insert subcategories
    for (const subcategory of subcategories) {
      await db.run(
        `INSERT OR REPLACE INTO subcategories (id, category_id, name, description) 
         VALUES (?, ?, ?, ?)`,
        [subcategory.id, subcategory.category_id, subcategory.name, subcategory.description]
      );
    }

    // Create sample actions for the user
    const sampleActions = [
      // Delivery actions
      {
        id: uuidv4(),
        title: 'Deliver project milestone 1',
        category: 'Delivery',
        sub_category: 'Milestone',
        target: 'Complete first phase deliverables',
        definition_of_done: 'All deliverables reviewed and approved by client, documentation updated, and milestone marked complete in project tracker.',
        deadline: '2025-09-08T12:00:00Z',
        member_id: userId,
        parent_objective: 'Client satisfaction and project progress'
      },
      {
        id: uuidv4(),
        title: 'Update API documentation',
        category: 'Delivery',
        sub_category: 'Documentation',
        target: 'Comprehensive API documentation for v2.0',
        definition_of_done: 'All endpoints documented with examples, postman collection updated, and developer portal published',
        deadline: '2025-09-15T17:00:00Z',
        member_id: userId,
        parent_objective: 'Developer experience improvement'
      },
      {
        id: uuidv4(),
        title: 'Feature testing automation',
        category: 'Delivery',
        sub_category: 'Testing',
        target: 'Implement automated testing for key features',
        definition_of_done: 'Test coverage increased to 85%, CI/CD pipeline includes automated tests, and manual testing time reduced',
        deadline: '2025-09-24T18:00:00Z',
        member_id: userId,
        parent_objective: 'Quality assurance and delivery speed'
      },

      // Self Development actions
      {
        id: uuidv4(),
        title: 'Complete React course',
        category: 'Self development',
        sub_category: 'Education',
        target: 'Master advanced React patterns',
        definition_of_done: 'Complete course and implement learned patterns in a project',
        deadline: '2025-09-12T18:00:00Z',
        member_id: userId,
        parent_objective: 'React skills for future projects'
      },
      {
        id: uuidv4(),
        title: 'AWS certification study',
        category: 'Self development',
        sub_category: 'Certification',
        target: 'Pass AWS Solutions Architect exam',
        definition_of_done: 'Complete practice tests with 90%+ score and schedule certification exam',
        deadline: '2025-09-30T23:59:00Z',
        member_id: userId,
        parent_objective: 'Cloud architecture expertise'
      },

      // Solution+ actions
      {
        id: uuidv4(),
        title: 'Propose new solution architecture',
        category: 'Solution+',
        sub_category: 'Innovation',
        target: 'Research and propose microservices migration',
        definition_of_done: 'Architecture proposal document with migration plan, cost analysis, and timeline approved by tech leadership',
        deadline: '2025-09-16T10:00:00Z',
        member_id: userId,
        parent_objective: 'System scalability and performance'
      },
      {
        id: uuidv4(),
        title: 'Code review optimization',
        category: 'Solution+',
        sub_category: 'Review',
        target: 'Improve code review process efficiency',
        definition_of_done: 'New review guidelines implemented, team trained, and review time reduced by 30%',
        deadline: '2025-09-25T12:00:00Z',
        member_id: userId,
        parent_objective: 'Development velocity improvement'
      },
      {
        id: uuidv4(),
        title: 'Performance optimization research',
        category: 'Solution+',
        sub_category: 'Optimization',
        target: 'Research database performance improvements',
        definition_of_done: 'Performance bottlenecks identified, optimization strategies documented, and implementation plan approved',
        deadline: '2025-09-21T11:00:00Z',
        member_id: userId,
        parent_objective: 'System performance and user experience'
      },
      {
        id: uuidv4(),
        title: 'Machine learning feasibility study',
        category: 'Solution+',
        sub_category: 'Research',
        target: 'Evaluate ML integration opportunities',
        definition_of_done: 'Feasibility report with use cases, technology stack recommendations, and ROI analysis presented to leadership',
        deadline: '2025-09-29T14:00:00Z',
        member_id: userId,
        parent_objective: 'Innovation and competitive advantage'
      },

      // Customer Success actions
      {
        id: uuidv4(),
        title: 'Client feedback analysis',
        category: 'Customer Success',
        sub_category: 'Feedback',
        target: 'Analyze Q3 customer feedback trends',
        definition_of_done: 'Comprehensive report with action items, sentiment analysis, and improvement recommendations presented to stakeholders',
        deadline: '2025-09-20T16:00:00Z',
        member_id: userId,
        parent_objective: 'Customer satisfaction improvement'
      },
      {
        id: uuidv4(),
        title: 'Customer onboarding improvement',
        category: 'Customer Success',
        sub_category: 'Support',
        target: 'Streamline new customer onboarding',
        definition_of_done: 'Updated onboarding checklist, automated welcome emails, and reduced setup time by 50%',
        deadline: '2025-09-28T14:00:00Z',
        member_id: userId,
        parent_objective: 'Customer experience enhancement'
      },
      {
        id: uuidv4(),
        title: 'Client relationship health check',
        category: 'Customer Success',
        sub_category: 'Relationship',
        target: 'Assess and improve key client relationships',
        definition_of_done: 'Health check completed for top 10 clients, action plans created for at-risk accounts, and relationship scores improved',
        deadline: '2025-09-19T13:00:00Z',
        member_id: userId,
        parent_objective: 'Client retention and growth'
      },
      {
        id: uuidv4(),
        title: 'Customer success metrics dashboard',
        category: 'Customer Success',
        sub_category: 'Communication',
        target: 'Create comprehensive CS metrics dashboard',
        definition_of_done: 'Dashboard deployed with key metrics, automated reporting, and stakeholder training completed',
        deadline: '2025-09-27T12:00:00Z',
        member_id: userId,
        parent_objective: 'Data-driven customer success'
      },

      // Team Management actions
      {
        id: uuidv4(),
        title: 'Team sprint planning workshop',
        category: 'Team management',
        sub_category: 'Planning',
        target: 'Facilitate effective sprint planning sessions',
        definition_of_done: 'Workshop delivered to 3 teams, feedback collected, and planning efficiency improved by 25%',
        deadline: '2025-09-18T15:00:00Z',
        member_id: userId,
        parent_objective: 'Team productivity and collaboration'
      },
      {
        id: uuidv4(),
        title: 'Junior developer mentoring program',
        category: 'Team management',
        sub_category: 'Mentoring',
        target: 'Establish mentoring program for new hires',
        definition_of_done: 'Program structure defined, mentors assigned, and first cohort onboarded with tracking metrics',
        deadline: '2025-09-22T17:00:00Z',
        member_id: userId,
        parent_objective: 'Team skill development and retention'
      },
      {
        id: uuidv4(),
        title: 'Cross-team communication process',
        category: 'Team management',
        sub_category: 'Coordination',
        target: 'Improve inter-team communication protocols',
        definition_of_done: 'Communication guidelines published, regular sync meetings established, and team satisfaction survey shows improvement',
        deadline: '2025-09-26T16:00:00Z',
        member_id: userId,
        parent_objective: 'Organizational efficiency'
      }
    ];

    // Insert sample actions
    for (const action of sampleActions) {
      await db.run(
        `INSERT OR REPLACE INTO actions 
         (id, title, category, sub_category, target, definition_of_done, deadline, member_id, parent_objective)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          action.id, action.title, action.category, action.sub_category,
          action.target, action.definition_of_done, action.deadline,
          action.member_id, action.parent_objective
        ]
      );
    }

    // Add comprehensive status updates for various weeks and progress levels
    const weeks = ['2025-W34', '2025-W35', '2025-W36', '2025-W37'];
    const progressLevels = [0, 25, 50, 75, 100];
    const statusOptions = ['Not started', 'On-going', 'Done', 'Blocked', 'Cancelled'];
    
    for (let i = 0; i < sampleActions.length; i++) {
      const action = sampleActions[i];
      
      // Add status updates for each action across different weeks
      for (let weekIndex = 0; weekIndex < weeks.length; weekIndex++) {
        const week = weeks[weekIndex];
        let progress = Math.min(progressLevels[weekIndex] || 0, 100);
        let status = 'Not started';
        
        if (progress === 0) status = 'Not started';
        else if (progress === 100) status = 'Done';
        else if (progress > 0 && Math.random() > 0.8) status = 'Blocked';
        else if (progress > 0) status = 'On-going';

        // Add some variety - some actions might be cancelled or have different progress patterns
        if (i % 7 === 0 && weekIndex === 2) {
          status = 'Cancelled';
          progress = Math.max(0, progress - 25);
        }

        await db.run(
          `INSERT OR REPLACE INTO status_updates (id, action_id, week, progress, work_status)
           VALUES (?, ?, ?, ?, ?)`,
          [uuidv4(), action.id, week, progress, status]
        );
      }
    }

    // Create sample reports
    const sampleReports = [
      {
        id: uuidv4(),
        title: 'Q3 Development Progress Report',
        content: `# Q3 Development Progress Summary

## Key Achievements
- Completed 15 out of 18 planned deliverables
- Improved code review process efficiency by 30%
- Onboarded 3 new team members successfully

## Challenges
- API documentation updates delayed due to resource constraints
- Client feedback integration took longer than expected

## Next Quarter Focus
- Complete remaining deliverables
- Implement new testing automation
- Enhance customer onboarding process`,
        week: '2025-W36',
        member_id: userId,
        created_at: '2025-09-09T10:30:00Z'
      },
      {
        id: uuidv4(),
        title: 'Customer Success Metrics - September',
        content: `# Customer Success Report - September 2025

## Customer Satisfaction
- Overall CSAT score: 4.2/5.0 (↑0.3 from August)
- Net Promoter Score: 7.8/10 (↑0.5 from August)
- Support ticket resolution time: 2.4 hours average

## Key Wins
- Successfully onboarded 5 new enterprise clients
- Reduced churn rate by 15% through proactive outreach
- Launched customer feedback dashboard

## Areas for Improvement
- Need faster response time for technical support
- Enhance onboarding documentation
- Implement predictive churn analysis`,
        week: '2025-W37',
        member_id: userId,
        created_at: '2025-09-10T14:15:00Z'
      },
      {
        id: uuidv4(),
        title: 'Team Management Weekly Update',
        content: `# Team Management Update - Week 37

## Team Performance
- Sprint velocity: 85 story points (target: 80)
- Code quality score: 92% (↑5% from last week)
- Team satisfaction survey: 4.1/5.0

## Leadership Activities
- Conducted 1-on-1s with all team members
- Facilitated cross-team planning session
- Organized team building workshop

## Upcoming Initiatives
- Launch mentoring program for junior developers
- Implement new communication protocols
- Plan Q4 team objectives`,
        week: '2025-W37',
        member_id: userId,
        created_at: '2025-09-11T09:45:00Z'
      },
      {
        id: uuidv4(),
        title: 'Innovation & Research Update',
        content: `# Innovation & Research Report

## Current Research Projects
- Machine Learning integration feasibility study (70% complete)
- Database performance optimization analysis (45% complete)
- Microservices architecture proposal (85% complete)

## Key Findings
- ML integration could improve user experience by 40%
- Database optimization can reduce query time by 60%
- Microservices migration estimated at 6-month timeline

## Recommendations
- Proceed with ML pilot project
- Implement database optimizations in Q4
- Begin microservices planning phase`,
        week: '2025-W36',
        member_id: userId,
        created_at: '2025-09-08T16:20:00Z'
      }
    ];

    // Insert sample reports
    for (const report of sampleReports) {
      await db.run(
        `INSERT OR REPLACE INTO reports (id, title, content, week, member_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [report.id, report.title, report.content, report.week, report.member_id, report.created_at]
      );
    }

    console.log('Database seeded successfully');
    console.log('Users created:');
    console.log('  Admin: admin@smartreport.com / admin123');
    console.log('  User: user@smartreport.com / user123 (Alice Johnson)');
    console.log(`  Total actions created: ${sampleActions.length}`);
    console.log(`  Total reports created: ${sampleReports.length}`);
    
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

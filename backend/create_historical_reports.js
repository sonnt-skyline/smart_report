import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';

// Enable verbose mode
sqlite3.verbose();

// Week calculation functions
function getCurrentWeek() {
  const now = new Date();
  const year = now.getFullYear();
  const onejan = new Date(year, 0, 1);
  const week = Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}

function getPreviousWeek(currentWeek) {
  const [yearStr, weekStr] = currentWeek.split('-W');
  const year = parseInt(yearStr);
  const weekNum = parseInt(weekStr);
  
  if (weekNum > 1) {
    return `${year}-W${(weekNum - 1).toString().padStart(2, '0')}`;
  } else {
    // Go to previous year's last week (simplified to 52)
    const prevYear = year - 1;
    return `${prevYear}-W52`;
  }
}

function getPreviousWeeks(numWeeks) {
  const weeks = [];
  let currentWeek = getCurrentWeek();
  
  for (let i = 0; i < numWeeks; i++) {
    currentWeek = getPreviousWeek(currentWeek);
    weeks.push(currentWeek);
  }
  
  return weeks;
}

// Connect to database
const db = new sqlite3.Database('smart_report.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    return;
  }
  console.log('Connected to SQLite database.');
});

// Promisify db methods
const dbRun = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const dbGet = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Sample report content variations
const progressNotesTemplates = [
  "Excellent progress made across multiple deliverables this week. Team collaboration has been outstanding and we're ahead of schedule on key milestones. Successfully completed several critical tasks and maintained high quality standards.",
  "Steady progress on all fronts with good momentum building. Made significant headway on technical implementation and documentation. Team communication has improved and we're seeing better coordination across departments.",
  "Mixed week with some excellent achievements and a few challenges. Overall progress is solid and we're maintaining our timeline. Successfully resolved several blocking issues and improved our development workflow.",
  "Strong week with notable progress on high-priority items. Completed several major deliverables and received positive feedback from stakeholders. Team morale is high and productivity remains excellent.",
  "Good progress despite some unexpected challenges. Adapted well to changing requirements and maintained delivery quality. Team showed great resilience and problem-solving skills.",
  "Productive week with focus on code quality and technical debt reduction. Made significant improvements to system performance and maintainability. Documentation efforts are paying off well.",
  "Excellent collaboration week with cross-team initiatives showing strong results. Knowledge sharing sessions were particularly valuable. Made good progress on long-term strategic goals.",
  "Focused week on customer-facing features with great results. Received excellent feedback from user testing sessions. Team is becoming more user-centric in approach."
];

const blockersNotesTemplates = [
  "Minor API integration delays resolved through vendor collaboration. Brief environment setup issues quickly addressed by DevOps team. No significant blockers remaining for next week.",
  "Dependency on external service caused brief delays but alternative solution implemented. Team coordination improved after initial communication gaps. All blockers now resolved.",
  "Third-party library compatibility issues required additional research time. Successfully found workaround and documented for future reference. No current blockers.",
  "Brief delay due to infrastructure changes but quickly adapted. Testing environment issues resolved with updated configurations. Clear path forward established.",
  "Initial complexity underestimation led to scope adjustments. Re-prioritized tasks based on business value. Team alignment improved through better planning.",
  "Resource allocation challenges resolved through better workload distribution. Cross-training initiatives helping reduce single points of failure. Improved resilience achieved.",
  "Code review bottleneck addressed through process improvements. Automated testing pipeline enhancements reducing manual effort. Workflow optimization ongoing.",
  "Client feedback incorporation required some rework but valuable insights gained. Design iteration process streamlined for better efficiency. Quality improvements implemented."
];

const nextStepsTemplates = [
  "Continue with planned sprint activities focusing on API completion and testing automation. Begin preparation for next quarter's major release. Initiate performance optimization research.",
  "Focus on user interface improvements and accessibility features. Complete pending documentation updates. Start planning for upcoming integration milestones.",
  "Prioritize technical debt reduction and code refactoring. Enhance monitoring and alerting systems. Begin stakeholder review process for next phase.",
  "Complete current milestone deliverables and prepare demo materials. Initiate security audit process. Plan team training sessions for new technologies.",
  "Finalize testing frameworks and deployment pipelines. Start customer feedback integration process. Prepare for upcoming client presentations.",
  "Focus on cross-team collaboration initiatives and knowledge transfer. Complete pending certifications and skill development. Begin architecture review process.",
  "Enhance development tools and improve developer experience. Complete code quality improvements. Initiate performance benchmarking activities.",
  "Prepare for upcoming feature releases and user acceptance testing. Focus on documentation completeness. Begin planning for next quarter objectives."
];

const additionalNotesTemplates = [
  "Team morale continues to be excellent with strong engagement in retrospectives. Learning culture is thriving with regular knowledge sharing sessions. Looking forward to upcoming technology conference.",
  "Client satisfaction scores remain high with positive feedback on recent deliveries. Team collaboration tools proving very effective. Excited about upcoming innovation sprint.",
  "Professional development initiatives showing great results with team skill improvements. Mentoring programs working well. Planning team building activities for next month.",
  "Continuous improvement mindset well established across team. Process optimizations delivering measurable benefits. Strong foundation for scaling operations.",
  "Cross-functional collaboration reaching new levels of effectiveness. Communication clarity improved significantly. Team autonomy and accountability well balanced.",
  "Innovation time allocation proving valuable with several promising prototypes. Technical exploration sessions generating good ideas. Culture of experimentation thriving.",
  "Knowledge documentation efforts creating lasting value for team. Onboarding process improvements showing immediate benefits. Sustainable practices being adopted.",
  "Customer focus initiatives showing positive impact on product decisions. User empathy growing across development team. Quality-first mindset well established."
];

async function createHistoricalReports() {
  try {
    // Get the regular user
    const user = await dbGet("SELECT * FROM users WHERE role = 'user' LIMIT 1");
    if (!user) {
      console.error('No regular user found. Please run the seed script first.');
      return;
    }
    
    console.log('Creating historical reports for user:', user.name, '(' + user.email + ')');
    
    // Get user's actions
    const actions = await dbAll("SELECT * FROM actions WHERE member_id = ?", [user.id]);
    console.log('Found', actions.length, 'actions for the user');
    
    if (actions.length === 0) {
      console.error('No actions found for the user. Please run the seed script first.');
      return;
    }
    
    // Create reports for the last 8 weeks (excluding current week)
    const previousWeeks = getPreviousWeeks(8);
    console.log('Creating reports for weeks:', previousWeeks.join(', '));
    
    const validStatuses = ['Not started', 'On-going', 'Blocked', 'On hold', 'Completed'];
    
    for (let i = 0; i < previousWeeks.length; i++) {
      const week = previousWeeks[i];
      const weekIndex = i; // 0 is most recent, 7 is oldest
      
      console.log(`\nCreating report for week ${week} (${weekIndex + 1} weeks ago)...`);
      
      // Check if weekly report already exists
      const existingReport = await dbGet(
        "SELECT * FROM weekly_reports WHERE member_id = ? AND week = ?",
        [user.id, week]
      );
      
      if (existingReport) {
        console.log(`Weekly report for week ${week} already exists, skipping...`);
        continue;
      }
      
      // Create weekly report with varied content
      const reportId = uuidv4();
      const now = new Date().toISOString();
      
      // Select random content but ensure variety
      const progressNote = progressNotesTemplates[i % progressNotesTemplates.length];
      const blockersNote = blockersNotesTemplates[i % blockersNotesTemplates.length];
      const nextStepsNote = nextStepsTemplates[i % nextStepsTemplates.length];
      const additionalNote = additionalNotesTemplates[i % additionalNotesTemplates.length];
      
      await dbRun(
        `INSERT INTO weekly_reports 
         (id, member_id, week, progress_notes, blockers_notes, next_steps_notes, additional_notes, submitted_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          reportId,
          user.id,
          week,
          progressNote,
          blockersNote,
          nextStepsNote,
          additionalNote,
          now,
          now,
          now
        ]
      );
      
      console.log(`Created weekly report ${reportId} for week ${week}`);
      
      // Create realistic status updates for actions
      const numActionsToUpdate = Math.floor(actions.length * (0.5 + Math.random() * 0.3)); // 50-80% of actions
      const selectedActions = actions.sort(() => 0.5 - Math.random()).slice(0, numActionsToUpdate);
      
      for (const action of selectedActions) {
        // Check if status update already exists
        const existingStatus = await dbGet(
          "SELECT * FROM status_updates WHERE action_id = ? AND week = ?",
          [action.id, week]
        );
        
        if (existingStatus) {
          continue;
        }
        
        // Generate realistic progress based on how long ago the week was
        let progress, workStatus;
        const random = Math.random();
        
        if (weekIndex >= 6) {
          // Very old weeks - mostly early stages or not started
          if (random < 0.3) {
            progress = 0;
            workStatus = 'Not started';
          } else if (random < 0.7) {
            progress = Math.floor(Math.random() * 25) + 5; // 5-30%
            workStatus = 'On-going';
          } else if (random < 0.85) {
            progress = Math.floor(Math.random() * 20) + 10; // 10-30%
            workStatus = 'On-going';
          } else if (random < 0.95) {
            progress = Math.floor(Math.random() * 15) + 5; // 5-20%
            workStatus = 'Blocked';
          } else {
            progress = Math.floor(Math.random() * 15) + 5; // 5-20%
            workStatus = 'On hold';
          }
        } else if (weekIndex >= 4) {
          // Mid-range weeks - moderate progress
          if (random < 0.1) {
            progress = 0;
            workStatus = 'Not started';
          } else if (random < 0.6) {
            progress = Math.floor(Math.random() * 40) + 20; // 20-60%
            workStatus = 'On-going';
          } else if (random < 0.8) {
            progress = Math.floor(Math.random() * 30) + 30; // 30-60%
            workStatus = 'On-going';
          } else if (random < 0.9) {
            progress = Math.floor(Math.random() * 25) + 20; // 20-45%
            workStatus = 'Blocked';
          } else {
            progress = Math.floor(Math.random() * 30) + 25; // 25-55%
            workStatus = 'On hold';
          }
        } else if (weekIndex >= 2) {
          // Recent weeks - higher progress
          if (random < 0.05) {
            progress = 0;
            workStatus = 'Not started';
          } else if (random < 0.15) {
            progress = 100;
            workStatus = 'Completed';
          } else if (random < 0.7) {
            progress = Math.floor(Math.random() * 40) + 40; // 40-80%
            workStatus = 'On-going';
          } else if (random < 0.85) {
            progress = Math.floor(Math.random() * 30) + 50; // 50-80%
            workStatus = 'On-going';
          } else if (random < 0.95) {
            progress = Math.floor(Math.random() * 30) + 30; // 30-60%
            workStatus = 'Blocked';
          } else {
            progress = Math.floor(Math.random() * 40) + 40; // 40-80%
            workStatus = 'On hold';
          }
        } else {
          // Most recent weeks - high progress, some completions
          if (random < 0.25) {
            progress = 100;
            workStatus = 'Completed';
          } else if (random < 0.8) {
            progress = Math.floor(Math.random() * 40) + 50; // 50-90%
            workStatus = 'On-going';
          } else if (random < 0.9) {
            progress = Math.floor(Math.random() * 30) + 60; // 60-90%
            workStatus = 'On-going';
          } else if (random < 0.95) {
            progress = Math.floor(Math.random() * 30) + 40; // 40-70%
            workStatus = 'Blocked';
          } else {
            progress = Math.floor(Math.random() * 40) + 50; // 50-90%
            workStatus = 'On hold';
          }
        }
        
        const statusId = uuidv4();
        await dbRun(
          `INSERT INTO status_updates 
           (id, action_id, week, progress, work_status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [statusId, action.id, week, progress, workStatus, now, now]
        );
        
        console.log(`  - ${action.title.substring(0, 35)}... - ${progress}% (${workStatus})`);
      }
    }
    
    console.log('\n✅ Historical reports created successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Created weekly reports for ${previousWeeks.length} weeks`);
    console.log(`- Generated status updates for ${actions.length} actions`);
    console.log(`- Week range: ${previousWeeks[previousWeeks.length - 1]} to ${previousWeeks[0]}`);
    
  } catch (error) {
    console.error('Error creating historical reports:', error);
  } finally {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed.');
      }
    });
  }
}

// Run the script
createHistoricalReports();

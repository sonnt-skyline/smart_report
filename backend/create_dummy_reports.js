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

// Get 2 previous weeks
const currentWeek = getCurrentWeek();
const lastWeek = getPreviousWeek(currentWeek);
const twoWeeksAgo = getPreviousWeek(lastWeek);

console.log('Current week:', currentWeek);
console.log('Last week:', lastWeek);
console.log('Two weeks ago:', twoWeeksAgo);

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

async function createDummyReports() {
  try {
    // Get the regular user (not admin)
    const user = await dbGet("SELECT * FROM users WHERE role = 'user' LIMIT 1");
    if (!user) {
      console.error('No regular user found. Please run the seed script first.');
      return;
    }
    
    console.log('Creating reports for user:', user.name, '(' + user.email + ')');
    
    // Get user's actions
    const actions = await dbAll("SELECT * FROM actions WHERE member_id = ?", [user.id]);
    console.log('Found', actions.length, 'actions for the user');
    
    if (actions.length === 0) {
      console.error('No actions found for the user. Please run the seed script first.');
      return;
    }
    
    // Create reports for 2 previous weeks
    const weeks = [twoWeeksAgo, lastWeek];
    
    for (const week of weeks) {
      console.log(`\nCreating report for week ${week}...`);
      
      // Check if weekly report already exists
      const existingReport = await dbGet(
        "SELECT * FROM weekly_reports WHERE member_id = ? AND week = ?",
        [user.id, week]
      );
      
      if (existingReport) {
        console.log(`Weekly report for week ${week} already exists, skipping...`);
        continue;
      }
      
      // Create weekly report
      const reportId = uuidv4();
      const now = new Date().toISOString();
      
      await dbRun(
        `INSERT INTO weekly_reports 
         (id, member_id, week, progress_notes, blockers_notes, next_steps_notes, additional_notes, submitted_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          reportId,
          user.id,
          week,
          `Good progress made on multiple fronts during week ${week}. Key deliverables are on track and team collaboration has been effective. Successfully completed several milestones and maintained good velocity throughout the week.`,
          `Minor dependency issue resolved with external API integration. Brief delay in testing due to environment setup but resolved quickly with team collaboration. No major blockers remaining.`,
          `Continue with planned tasks for next week. Focus on completing documentation and preparing for upcoming milestones. Will prioritize the AWS certification study and API documentation updates.`,
          `Team morale is high and client feedback has been positive. Looking forward to the next sprint. Collaboration tools are working well and communication has improved significantly.`,
          now,
          now,
          now
        ]
      );
      
      console.log(`Created weekly report ${reportId} for week ${week}`);
      
      // Create status updates for random actions
      const numActionsToUpdate = Math.min(actions.length, Math.floor(Math.random() * 4) + 3); // 3-6 actions
      const selectedActions = actions.sort(() => 0.5 - Math.random()).slice(0, numActionsToUpdate);
      
      for (const action of selectedActions) {
        // Generate realistic progress based on week
        let progress, workStatus;
        const random = Math.random();
        
        if (week === twoWeeksAgo) {
          // Earlier week - lower progress
          if (random < 0.3) {
            progress = Math.floor(Math.random() * 30) + 10; // 10-40%
            workStatus = 'On-going';
          } else if (random < 0.6) {
            progress = Math.floor(Math.random() * 20) + 20; // 20-40%
            workStatus = 'On-going';
          } else if (random < 0.8) {
            progress = Math.floor(Math.random() * 15) + 5; // 5-20%
            workStatus = 'On-going';
          } else if (random < 0.9) {
            progress = 0;
            workStatus = 'Not started';
          } else {
            progress = Math.floor(Math.random() * 10) + 10; // 10-20%
            workStatus = 'Blocked';
          }
        } else {
          // Last week - higher progress
          if (random < 0.4) {
            progress = Math.floor(Math.random() * 30) + 50; // 50-80%
            workStatus = 'On-going';
          } else if (random < 0.6) {
            progress = Math.floor(Math.random() * 20) + 70; // 70-90%
            workStatus = 'On-going';
          } else if (random < 0.8) {
            progress = 100;
            workStatus = 'Completed';
          } else if (random < 0.9) {
            progress = Math.floor(Math.random() * 20) + 30; // 30-50%
            workStatus = 'On-going';
          } else {
            progress = Math.floor(Math.random() * 30) + 40; // 40-70%
            workStatus = 'On hold';
          }
        }
        
        // Check if status update already exists
        const existingStatus = await dbGet(
          "SELECT * FROM status_updates WHERE action_id = ? AND week = ?",
          [action.id, week]
        );
        
        if (!existingStatus) {
          const statusId = uuidv4();
          await dbRun(
            `INSERT INTO status_updates 
             (id, action_id, week, progress, work_status, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [statusId, action.id, week, progress, workStatus, now, now]
          );
          
          console.log(`  - Updated action "${action.title}" - ${progress}% (${workStatus})`);
        }
      }
    }
    
    console.log('\n✅ Dummy reports created successfully!');
    
  } catch (error) {
    console.error('Error creating dummy reports:', error);
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
createDummyReports();

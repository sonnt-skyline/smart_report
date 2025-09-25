-- Script to inject test weekly reports for user@smartreport.com
-- User ID: 346feaac-4d01-4a3e-9b40-853bdd017d21

-- Clear any existing test data first
DELETE FROM status_updates WHERE action_id IN (
  SELECT id FROM actions WHERE member_id = '346feaac-4d01-4a3e-9b40-853bdd017d21'
) AND week IN ('2025-W34', '2025-W35', '2025-W36');

DELETE FROM weekly_reports WHERE member_id = '346feaac-4d01-4a3e-9b40-853bdd017d21' 
AND week IN ('2025-W34', '2025-W35', '2025-W36');

-- Week 2025-W34 (3 weeks ago) - High success week
INSERT INTO weekly_reports (
  id, member_id, week, progress_notes, blockers_notes, next_steps_notes, additional_notes,
  submitted_at, created_at, updated_at
) VALUES (
  'report-w34-' || substr(hex(randomblob(8)), 1, 16),
  '346feaac-4d01-4a3e-9b40-853bdd017d21',
  '2025-W34',
  'Excellent week with major completions: Successfully delivered primary objective, exceeded expectations on quality metrics, received positive feedback from all stakeholders, performance improvements exceeded targets by 25%. Completed milestone delivery and documentation updates.',
  'No significant blockers this week. Team worked efficiently and all dependencies were resolved promptly. Communication channels were clear and effective.',
  'Building on this success: Begin next phase of the project, conduct retrospective to capture lessons learned, update documentation with new processes, plan celebration for team achievements, set up monitoring for delivered features.',
  'This was a milestone week that demonstrated our team''s capabilities. Great collaboration and execution across all areas. Team morale is high and momentum is strong.',
  '2025-08-25 17:30:00',
  '2025-08-25 17:30:00',
  '2025-08-25 17:30:00'
);

-- Status updates for Week 2025-W34
INSERT INTO status_updates (
  id, action_id, week, progress, work_status, created_at, updated_at
) VALUES 
-- Deliver project milestone 1 - Completed
('status-w34-' || substr(hex(randomblob(8)), 1, 16), '5b08fda0-d280-46e7-bc15-a8ae397e8764', '2025-W34', 100, 'Completed', '2025-08-25 17:00:00', '2025-08-25 17:00:00'),
-- Update API documentation - Completed  
('status-w34-' || substr(hex(randomblob(8)), 1, 16), 'ca97a60c-8fbb-4728-a159-322699a0ea2a', '2025-W34', 100, 'Completed', '2025-08-25 17:00:00', '2025-08-25 17:00:00');

-- Week 2025-W35 (2 weeks ago) - Good progress week
INSERT INTO weekly_reports (
  id, member_id, week, progress_notes, blockers_notes, next_steps_notes, additional_notes,
  submitted_at, created_at, updated_at
) VALUES (
  'report-w35-' || substr(hex(randomblob(8)), 1, 16),
  '346feaac-4d01-4a3e-9b40-853bdd017d21',
  '2025-W35',
  'Great progress this week! Successfully advanced on multiple fronts: Made significant progress on testing automation, continued learning on React course, made good headway on performance optimization research. Team collaboration was excellent and we maintained good momentum.',
  'Minor blockers encountered: Waiting for stakeholder feedback on automation framework design, some course materials were more complex than expected, one performance test required additional hardware setup that took longer than planned.',
  'Planned for next week: Complete remaining automation test cases, finish React course modules 8-10, conduct performance benchmark tests, schedule review meetings with stakeholders, begin integration testing phase.',
  'Overall a productive week with good momentum. Learning curve on new technologies is steep but manageable. Team morale remains high and we''re building solid foundations.',
  '2025-09-01 16:45:00',
  '2025-09-01 16:45:00',
  '2025-09-01 16:45:00'
);

-- Status updates for Week 2025-W35
INSERT INTO status_updates (
  id, action_id, week, progress, work_status, created_at, updated_at
) VALUES 
-- Feature testing automation - Good progress
('status-w35-' || substr(hex(randomblob(8)), 1, 16), 'ed2956ff-00a4-4f90-9394-c057037a5bc4', '2025-W35', 75, 'On-going', '2025-09-01 16:30:00', '2025-09-01 16:30:00'),
-- Complete React course - Steady progress
('status-w35-' || substr(hex(randomblob(8)), 1, 16), '6426c552-9515-4903-81f8-8ba2f959bc1b', '2025-W35', 60, 'On-going', '2025-09-01 16:30:00', '2025-09-01 16:30:00'),
-- Performance optimization research - Initial work done
('status-w35-' || substr(hex(randomblob(8)), 1, 16), 'dc228f87-c5a1-430a-b1fa-d2139c94115d', '2025-W35', 40, 'On-going', '2025-09-01 16:30:00', '2025-09-01 16:30:00');

-- Week 2025-W36 (last week) - Mixed results week
INSERT INTO weekly_reports (
  id, member_id, week, progress_notes, blockers_notes, next_steps_notes, additional_notes,
  submitted_at, created_at, updated_at
) VALUES (
  'report-w36-' || substr(hex(randomblob(8)), 1, 16),
  '346feaac-4d01-4a3e-9b40-853bdd017d21',
  '2025-W36',
  'Mixed week with some wins and challenges: Successfully completed testing automation framework, made significant progress on React course (almost finished), hit some roadblocks on performance research due to infrastructure limitations, started AWS certification study.',
  'Several blockers this week: Performance testing environment had configuration issues, React course final project required additional time for debugging, AWS study materials were more extensive than anticipated, team member was out sick affecting some collaborative work.',
  'Recovery plan for next week: Fix performance testing environment setup, complete React course final project and certification, establish dedicated study schedule for AWS materials, catch up on delayed collaborative tasks, conduct team sync to realign priorities.',
  'Despite challenges, we maintained good communication and adapted quickly. Learned valuable lessons about infrastructure planning and time estimation. The automation framework completion was a major win that will benefit future projects.',
  '2025-09-08 18:15:00',
  '2025-09-08 18:15:00',
  '2025-09-08 18:15:00'
);

-- Status updates for Week 2025-W36
INSERT INTO status_updates (
  id, action_id, week, progress, work_status, created_at, updated_at
) VALUES 
-- Feature testing automation - Completed!
('status-w36-' || substr(hex(randomblob(8)), 1, 16), 'ed2956ff-00a4-4f90-9394-c057037a5bc4', '2025-W36', 100, 'Completed', '2025-09-08 18:00:00', '2025-09-08 18:00:00'),
-- Complete React course - Nearly done
('status-w36-' || substr(hex(randomblob(8)), 1, 16), '6426c552-9515-4903-81f8-8ba2f959bc1b', '2025-W36', 85, 'On-going', '2025-09-08 18:00:00', '2025-09-08 18:00:00'),
-- Performance optimization research - Blocked by infrastructure
('status-w36-' || substr(hex(randomblob(8)), 1, 16), 'dc228f87-c5a1-430a-b1fa-d2139c94115d', '2025-W36', 30, 'Blocked', '2025-09-08 18:00:00', '2025-09-08 18:00:00'),
-- AWS certification study - Just started
('status-w36-' || substr(hex(randomblob(8)), 1, 16), '26dcf7a4-3151-4c0a-be9f-7acccd5427cd', '2025-W36', 15, 'Not started', '2025-09-08 18:00:00', '2025-09-08 18:00:00');

-- Verify the inserted data
SELECT 'Weekly Reports:' as info;
SELECT week, substr(progress_notes, 1, 50) || '...' as progress_summary 
FROM weekly_reports 
WHERE member_id = '346feaac-4d01-4a3e-9b40-853bdd017d21' 
AND week IN ('2025-W34', '2025-W35', '2025-W36')
ORDER BY week;

SELECT 'Status Updates:' as info;
SELECT su.week, a.title, su.progress, su.work_status
FROM status_updates su
JOIN actions a ON su.action_id = a.id
WHERE a.member_id = '346feaac-4d01-4a3e-9b40-853bdd017d21'
AND su.week IN ('2025-W34', '2025-W35', '2025-W36')
ORDER BY su.week, a.title;

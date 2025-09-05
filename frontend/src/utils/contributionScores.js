// Utility functions for calculating member contribution scores

/**
 * Calculate the contribution score for a member based on completed actions and objective impacts
 * @param {Object} memberData Data object containing member's actions and objectives
 * @returns {Object} Calculated scores
 */
export const calculateContributionScore = (memberData) => {
  const { completedActions, objectiveImpacts } = memberData;
  
  // Handle possible undefined/null values
  if (!completedActions || !objectiveImpacts) {
    return {
      actionScore: 0,
      impactScore: 0,
      actionScoreWeighted: 0,
      impactScoreWeighted: 0,
      totalScore: 0,
      rawScore: 0
    };
  }
  
  // Action completion score (30% weight)
  const actionScore = (completedActions.count || 0) * 10;
  const actionScoreWeighted = actionScore * 0.3;
  
  // Objective impact score (70% weight)
  const impactScore = Array.isArray(objectiveImpacts) 
    ? objectiveImpacts.reduce((sum, impact) => sum + (impact.score || 0), 0)
    : 0;
  const impactScoreWeighted = impactScore * 0.7;
  
  // Total contribution score
  const totalScore = actionScoreWeighted + impactScoreWeighted;
  
  return {
    actionScore,
    impactScore,
    actionScoreWeighted,
    impactScoreWeighted,
    totalScore: Math.round(totalScore), // Round to nearest integer
    rawScore: totalScore
  };
};

/**
 * Calculate team averages from an array of member scores
 * @param {Array} membersData Array of member data objects
 * @returns {Object} Team average scores
 */
export const calculateTeamAverages = (membersData) => {
  // Safety check for null/undefined or empty array
  if (!membersData || !Array.isArray(membersData) || membersData.length === 0) {
    return {
      actionScore: 0,
      impactScore: 0,
      totalScore: 0,
      actionScoreWeighted: 0,
      impactScoreWeighted: 0
    };
  }
  
  // Filter out any invalid member data
  const validMembers = membersData.filter(member => member && typeof member === 'object');
  const totalMembers = validMembers.length;
  
  // If no valid members after filtering, return zeros
  if (totalMembers === 0) {
    return {
      actionScore: 0,
      impactScore: 0,
      totalScore: 0,
      actionScoreWeighted: 0,
      impactScoreWeighted: 0
    };
  }
  
  const totals = validMembers.reduce((acc, member) => {
    const scores = calculateContributionScore(member);
    return {
      actionScore: acc.actionScore + scores.actionScore,
      impactScore: acc.impactScore + scores.impactScore,
      totalScore: acc.totalScore + scores.totalScore,
      actionScoreWeighted: acc.actionScoreWeighted + scores.actionScoreWeighted,
      impactScoreWeighted: acc.impactScoreWeighted + scores.impactScoreWeighted
    };
  }, { 
    actionScore: 0, 
    impactScore: 0, 
    totalScore: 0,
    actionScoreWeighted: 0,
    impactScoreWeighted: 0
  });
  
  return {
    actionScore: Math.round(totals.actionScore / totalMembers),
    impactScore: Math.round(totals.impactScore / totalMembers),
    totalScore: Math.round(totals.totalScore / totalMembers),
    actionScoreWeighted: Math.round(totals.actionScoreWeighted / totalMembers),
    impactScoreWeighted: Math.round(totals.impactScoreWeighted / totalMembers)
  };
};

/**
 * Calculate percentiles for each member compared to the team
 * @param {Array} membersData Array of member data objects
 * @returns {Array} Enhanced member data with percentiles
 */
export const calculateMemberPercentiles = (membersData) => {
  // Safety check for null/undefined or empty array
  if (!membersData || !Array.isArray(membersData) || membersData.length === 0) {
    return [];
  }
  
  // Filter out invalid member data
  const validMembers = membersData.filter(member => member && typeof member === 'object');
  
  if (validMembers.length === 0) {
    return [];
  }
  
  // Calculate all scores first
  const scoresArray = validMembers.map(member => ({
    ...member,
    scores: calculateContributionScore(member)
  }));
  
  // Sort by total score to determine rankings
  const sortedByScore = [...scoresArray].sort((a, b) => {
    // Handle NaN or undefined scores
    const scoreA = Number.isFinite(b.scores.totalScore) ? b.scores.totalScore : 0;
    const scoreB = Number.isFinite(a.scores.totalScore) ? a.scores.totalScore : 0;
    return scoreA - scoreB;
  });
  
  // Handle ties by giving the same rank to members with identical scores
  let currentRank = 1;
  let currentScore = sortedByScore.length > 0 ? sortedByScore[0].scores.totalScore : 0;
  let skipCount = 0;
  
  // Assign rankings and percentiles
  return sortedByScore.map((member, index) => {
    // Check if score is different from previous to handle ties
    if (member.scores.totalScore !== currentScore) {
      currentRank = index + 1;
      currentScore = member.scores.totalScore;
      skipCount = 0;
    } else if (index > 0) {
      // This is a tie with the previous member
      skipCount++;
    }
    
    const rank = currentRank;
    
    // Calculate percentile based on rank position (100 is top, 0 is bottom)
    // Use a more accurate calculation with proper handling of ties
    const percentile = Math.max(0, Math.min(100, 
      sortedByScore.length > 1 
        ? 100 - Math.round((rank - 1) / (sortedByScore.length - 1) * 100)
        : 100
    ));
    
    return {
      ...member,
      rank,
      percentile,
      scores: member.scores,
      tied: skipCount > 0 // Flag to indicate this member is tied with others
    };
  });
};

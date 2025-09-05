import { sampleActions, sampleObjectives } from '../data';

// Map status to quality score
const statusScore = {
  'on track': 1,
  'not started': 0.5,
  'off track': 0,
  'blocked': 0,
  'completed': 1,
};

function getObjectiveWeight(objective) {
  return (objective.importance || 1) * (objective.urgency || 1);
}

function getObjectiveByName(name) {
  return sampleObjectives.find(obj => obj.name === name);
}

export function assessMembers() {
  // Get all unique members
  const members = [...new Set(sampleActions.map(a => a.member))];
  const totalObjectives = sampleObjectives.length;

  // Map: member -> objectives participated (by name)
  const memberObjectives = {};
  members.forEach(member => {
    memberObjectives[member] = new Set();
  });

  // Map: member -> { objectiveName: [actions] }
  const memberActionsByObjective = {};
  members.forEach(member => {
    memberActionsByObjective[member] = {};
  });

  sampleActions.forEach(action => {
    const { member, parentObjective } = action;
    if (member && parentObjective) {
      memberObjectives[member].add(parentObjective);
      if (!memberActionsByObjective[member][parentObjective]) {
        memberActionsByObjective[member][parentObjective] = [];
      }
      memberActionsByObjective[member][parentObjective].push(action);
    }
  });

  // Calculate scores
  const results = members.map(member => {
    const objectives = Array.from(memberObjectives[member]);
    let weightedQuantity = 0;
    let weightedQuality = 0;
    objectives.forEach(objName => {
      const obj = getObjectiveByName(objName);
      if (!obj) return;
      const weight = getObjectiveWeight(obj);
      weightedQuantity += weight;
      // For quality, average the quality score of all actions for this objective
      const actions = memberActionsByObjective[member][objName] || [];
      let qualitySum = 0;
      actions.forEach(action => {
        // Use aiAssessment.status if available, else selfAssessment.status
        const status = (action.aiAssessment && action.aiAssessment.status) || (action.selfAssessment && action.selfAssessment.status) || '';
        qualitySum += statusScore[status] !== undefined ? statusScore[status] : 0.5;
      });
      const avgQuality = actions.length ? qualitySum / actions.length : 0.5;
      weightedQuality += avgQuality * weight;
    });
    return {
      member,
      participantRate: objectives.length / totalObjectives,
      weightedQuantity,
      weightedQuality,
    };
  });

  // Calculate max for normalization
  const maxQuantity = Math.max(...results.map(r => r.weightedQuantity)) || 1;
  const maxQuality = Math.max(...results.map(r => r.weightedQuality)) || 1;

  // Calculate single score (normalized product)
  results.forEach(r => {
    r.singleScore = (r.weightedQuantity / maxQuantity) * (r.weightedQuality / maxQuality);
  });

  // Sort for ranking (descending)
  results.sort((a, b) => b.singleScore - a.singleScore);
  results.forEach((r, idx) => { r.rank = idx + 1; });

  return results;
}

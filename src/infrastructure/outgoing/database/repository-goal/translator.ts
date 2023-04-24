import { Goal } from '@/core/domain/goal';

export type GoalRow = {
  id: string;
  team: string;
};

export function dehydrate(goal: Goal): GoalRow {
  return {
    id: goal['id'],
    team: goal['team'],
  };
}

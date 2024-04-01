export type BriefScheduledTaskEntry = {
  id: string;
  name: string;
  dueDate: Date;
  points: number;
};

export type BriefCompletedTaskEntry = BriefScheduledTaskEntry & {
  penalty: number;
  isPenalised: boolean;
};

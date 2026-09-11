export type RootStackParamList = {
  Tabs: undefined;
  Intake: undefined;
  DecisionMemo: { requestId: string };
  JobStatus: { jobId: string };
  MessageThread: { threadId: string };
};

export type TabParamList = {
  Home: undefined;
  Requests: undefined;
  Messages: undefined;
  Account: undefined;
};

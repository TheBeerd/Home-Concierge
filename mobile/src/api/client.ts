import type {
  CompletionConfirmationInput,
  DashboardData,
  DecisionMemo,
  IntakeSession,
  JobStatus,
} from '../types/domain';

/**
 * The single contract the UI codes against. Whatever the backend ends up
 * being (REST, GraphQL, Firebase, etc.), a new class implementing this
 * interface is the only thing that needs to change — see mockClient.ts
 * (used today) and restClient.ts (the shape of the real thing later).
 */
export interface HomeConciergeApi {
  getDashboard(): Promise<DashboardData>;

  /** Kicks off a new guided-intake conversation for a fresh request. */
  startIntakeSession(): Promise<IntakeSession>;

  /**
   * Sends the homeowner's next message/answer and returns the updated
   * session (server decides the next AI question, per the "human-reviewed
   * AI intake" model — ops can edit/redirect this server-side later).
   */
  sendIntakeReply(
    sessionId: string,
    reply: { text?: string; quickReply?: string; attachmentLabel?: string },
  ): Promise<IntakeSession>;

  /** Finalizes intake and hands the structured brief to ops/contractors. */
  submitIntakeSession(sessionId: string): Promise<{ requestId: string }>;

  getDecisionMemo(requestId: string): Promise<DecisionMemo>;

  /** Homeowner accepts a bid from the memo; returns the resulting job. */
  acceptBid(requestId: string, bidId: string): Promise<JobStatus>;

  getJobStatus(jobId: string): Promise<JobStatus>;

  /**
   * The primary anti-fraud signal: the homeowner (not the contractor)
   * confirms the job happened. See CompletionConfirmationInput for the
   * optional photo/note that feeds the trust graph.
   */
  confirmJobCompletion(
    jobId: string,
    confirmation: CompletionConfirmationInput,
  ): Promise<JobStatus>;
}

import type {
  AccountProfile,
  CompletionConfirmationInput,
  DashboardData,
  DecisionMemo,
  IntakeSession,
  JobStatus,
  MessageThread,
  MessageThreadDetail,
  ServiceRequestSummary,
  ThreadMessage,
} from '../types/domain';
import type { HomeConciergeApi } from './client';

/**
 * The real backend client, once one exists. Same interface as
 * MockHomeConciergeApi so swapping `src/api/index.ts` over is a one-line
 * change — no screen or component needs to know which one is active.
 *
 * Left unimplemented on purpose: wiring this up is a backend task
 * (auth/session headers, error shape, retry policy) that shouldn't be
 * guessed at from the app side. Fill each method in as the corresponding
 * endpoint ships.
 */
export class RestHomeConciergeApi implements HomeConciergeApi {
  constructor(private readonly baseUrl: string) {}

  private notImplemented(method: string): never {
    throw new Error(
      `RestHomeConciergeApi.${method}() is not implemented yet — baseUrl: ${this.baseUrl}`,
    );
  }

  getDashboard(): Promise<DashboardData> {
    this.notImplemented('getDashboard');
  }

  startIntakeSession(): Promise<IntakeSession> {
    this.notImplemented('startIntakeSession');
  }

  sendIntakeReply(): Promise<IntakeSession> {
    this.notImplemented('sendIntakeReply');
  }

  submitIntakeSession(): Promise<{ requestId: string }> {
    this.notImplemented('submitIntakeSession');
  }

  getDecisionMemo(): Promise<DecisionMemo> {
    this.notImplemented('getDecisionMemo');
  }

  acceptBid(): Promise<JobStatus> {
    this.notImplemented('acceptBid');
  }

  getJobStatus(): Promise<JobStatus> {
    this.notImplemented('getJobStatus');
  }

  confirmJobCompletion(_jobId: string, _confirmation: CompletionConfirmationInput): Promise<JobStatus> {
    this.notImplemented('confirmJobCompletion');
  }

  listRequests(): Promise<ServiceRequestSummary[]> {
    this.notImplemented('listRequests');
  }

  listMessageThreads(): Promise<MessageThread[]> {
    this.notImplemented('listMessageThreads');
  }

  getMessageThread(): Promise<MessageThreadDetail> {
    this.notImplemented('getMessageThread');
  }

  sendMessage(): Promise<ThreadMessage[]> {
    this.notImplemented('sendMessage');
  }

  getAccountProfile(): Promise<AccountProfile> {
    this.notImplemented('getAccountProfile');
  }
}

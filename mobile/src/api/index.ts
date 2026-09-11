import Constants from 'expo-constants';
import type { HomeConciergeApi } from './client';
import { MockHomeConciergeApi } from './mockClient';
import { RestHomeConciergeApi } from './restClient';

export type { HomeConciergeApi } from './client';

const extra = (Constants.expoConfig?.extra ?? {}) as { apiBaseUrl?: string };

/**
 * Flip this once the real API exists — everything else in the app is
 * already coded against the HomeConciergeApi interface, so no screen
 * changes are needed.
 */
const USE_MOCK_API = !extra.apiBaseUrl;

export const api: HomeConciergeApi = USE_MOCK_API
  ? new MockHomeConciergeApi()
  : new RestHomeConciergeApi(extra.apiBaseUrl!);

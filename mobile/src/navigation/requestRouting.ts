import type { NavigationProp } from '@react-navigation/native';
import { Alert } from 'react-native';
import type { ServiceRequestSummary } from '../types/domain';
import type { RootStackParamList } from './types';

/**
 * Callers pass a composite navigation prop (tab + root stack), which
 * isn't structurally a `NavigationProp<RootStackParamList>` as a whole
 * (its `dispatch` is narrower) — but its `navigate` alone does support
 * every root-stack route, which is all this helper needs.
 */
type NavigateOnly = Pick<NavigationProp<RootStackParamList>, 'navigate'>;

/**
 * Shared "what happens when you tap a request" logic, used by both the
 * Home screen's in-progress preview and the full Requests tab so they
 * can't drift out of sync.
 */
export function openRequest(navigation: NavigateOnly, request: ServiceRequestSummary) {
  switch (request.status) {
    case 'memo_ready':
      navigation.navigate('DecisionMemo', { requestId: request.id });
      return;
    case 'booked':
    case 'awaiting_confirmation':
    case 'completed':
      if (request.jobId) {
        navigation.navigate('JobStatus', { jobId: request.jobId });
      }
      return;
    case 'intake':
    case 'matching':
      Alert.alert('Still on it', "We're matching you with contractors — check back soon.");
      return;
  }
}

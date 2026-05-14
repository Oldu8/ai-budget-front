import { VoiceRecorder } from '@/features/voice-expense/ui/VoiceRecorder';
import { ThemedView } from '@/shared/ui/ThemedView';

export default function VoiceExpenseScreen() {
  return (
    <ThemedView className="flex-1 bg-brand-grey-low">
      <VoiceRecorder />
    </ThemedView>
  );
}

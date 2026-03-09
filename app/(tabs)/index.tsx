import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  return (
    <ThemedView className="flex-1 items-center justify-center bg-brand-grey-low">
      <ThemedText type="title" className="text-brand-primary">
        AI Budget
      </ThemedText>
      <ThemedText className="text-brand-grey mt-2">
        Главный экран
      </ThemedText>
    </ThemedView>
  );
}
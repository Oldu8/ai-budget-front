import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  return (
    <ThemedView className="flex-1 items-center justify-center bg-slate-900">
      <ThemedText type="title" className="text-white">
        AI Budget
      </ThemedText>
      <ThemedText className="text-slate-300 mt-2">
        Главный экран
      </ThemedText>
    </ThemedView>
  );
}
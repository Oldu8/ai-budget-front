import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  return (
    <ThemedView className="flex-1 justify-center items-center bg-brand-grey-low">
      <ThemedText type="title" className="text-brand-primary">
        AI Budget
      </ThemedText>
      <ThemedText className="mt-2 text-brand-grey">
        This is the home screen. Here you can see your budget and your operations.
      </ThemedText>
    </ThemedView>
  );
}
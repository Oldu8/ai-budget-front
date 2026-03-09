import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function AddScreen() {
  return (
    <ThemedView className="flex-1 justify-center items-center bg-brand-grey-low">
      <ThemedText type="title" className="text-brand-primary">
        Add operation
      </ThemedText>
      <ThemedText className="mt-2 text-brand-grey">
        This is the screen for adding an operation. Here a form will appear later.
      </ThemedText>
    </ThemedView>
  );
}


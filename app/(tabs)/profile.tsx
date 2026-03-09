import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ProfileScreen() {
  return (
    <ThemedView className="flex-1 justify-center items-center bg-brand-grey-low">
      <ThemedText type="title" className="text-brand-primary">
        Profile
      </ThemedText>
      <ThemedText className="mt-2 text-brand-grey">
        This is the profile screen. Here settings of account will appear later.
      </ThemedText>
    </ThemedView>
  );
}


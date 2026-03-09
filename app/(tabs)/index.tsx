import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <ThemedView className="flex-1 justify-center items-center bg-brand-grey-low">
      <ThemedText type="title" className="text-brand-primary">
        {t('home.title')}
      </ThemedText>
      <ThemedText className="mt-2 text-brand-grey">
        {t('home.description')}
      </ThemedText>
    </ThemedView>
  );
}
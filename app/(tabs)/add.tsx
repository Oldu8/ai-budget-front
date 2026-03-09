import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTranslation } from 'react-i18next';

export default function AddScreen() {
  const { t } = useTranslation();

  return (
    <ThemedView className="flex-1 justify-center items-center bg-brand-grey-low">
      <ThemedText type="title" className="text-brand-primary">
        {t('add.title')}
      </ThemedText>
      <ThemedText className="mt-2 text-brand-grey">
        {t('add.description')}
      </ThemedText>
    </ThemedView>
  );
}


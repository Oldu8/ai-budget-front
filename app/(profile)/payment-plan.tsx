import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import { SubscriptionProfileBlock } from '@/features/subscription';
import { BackButton } from '@/shared/ui/BackButton';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';

export default function PaymentPlanScreen() {
  const { subscription, subscriptionStatus, scanUsage } = useAuthContext();

  return (
    <View style={styles.screen}>
      <BackButton />
      <ScreenContainer variant="default" edges={[]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <SubscriptionProfileBlock
            subscription={subscription}
            subscriptionStatus={subscriptionStatus}
            scanUsage={scanUsage}
            showManageBilling={false}
          />
        </ScrollView>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
});

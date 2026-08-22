import * as Linking from 'expo-linking';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@/shared/constants/theme';
import { env } from '@/shared/constants/env';
import { ThemedText } from '@/shared/ui/ThemedText';

/**
 * Apple requires subscription terms (auto-renewal, cancellation) and links to the Privacy
 * Policy / Terms of Use right on the purchase screen (guideline 3.1.2) — iOS/IAP only, Stripe
 * Checkout already shows its own required terms during the hosted checkout flow.
 */
export function SubscriptionTermsFooter() {
  const { t } = useTranslation();
  const baseUrl = env.apiUrl;

  return (
    <View style={styles.container}>
      <ThemedText style={styles.text}>
        {t(
          'billing.subscriptionTerms',
          'Subscriptions renew automatically unless canceled at least 24 hours before the end of the current period. Manage or cancel anytime in your Apple ID account settings.'
        )}
      </ThemedText>
      <View style={styles.links}>
        <ThemedText
          style={styles.link}
          onPress={() => void Linking.openURL(`${baseUrl}/terms`)}
        >
          {t('billing.termsOfUse', 'Terms of Use')}
        </ThemedText>
        <ThemedText style={styles.linkSeparator}>·</ThemedText>
        <ThemedText
          style={styles.link}
          onPress={() => void Linking.openURL(`${baseUrl}/privacy`)}
        >
          {t('billing.privacyPolicy', 'Privacy Policy')}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
    paddingTop: 8,
  },
  text: {
    fontSize: 11,
    lineHeight: 15,
    color: Colors.grey,
  },
  links: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  link: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  linkSeparator: {
    fontSize: 11,
    color: Colors.grey,
  },
});

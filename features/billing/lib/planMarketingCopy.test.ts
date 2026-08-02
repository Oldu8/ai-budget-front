import type { TFunction } from 'i18next';

import { PlanType } from '@/entities/user';

import { getPlanCopy, getPlanFeatureLines } from './planMarketingCopy';

function makeT(objectData: Record<string, unknown>, textData: Record<string, string> = {}) {
  const t = ((key: string, opts?: { returnObjects?: boolean }) => {
    if (opts?.returnObjects) return objectData[key];
    return textData[key] ?? key;
  }) as unknown as TFunction;
  return t;
}

describe('getPlanCopy', () => {
  it('returns null for a type outside the PlanType enum', () => {
    const t = makeT({});
    expect(getPlanCopy(t, 'not-a-plan')).toBeNull();
  });

  it('returns null when the translation is missing tagline/bullets', () => {
    const t = makeT({
      'billing.planMarketing.free': { tagline: 'Free tagline' },
    });
    expect(getPlanCopy(t, PlanType.Free)).toBeNull();
  });

  it('returns tagline and bullets for a valid translation', () => {
    const t = makeT({
      'billing.planMarketing.free': {
        tagline: 'Free tagline',
        bullets: ['Bullet 1', 'Bullet 2'],
      },
    });
    expect(getPlanCopy(t, PlanType.Free)).toEqual({
      tagline: 'Free tagline',
      includesBridge: undefined,
      bullets: ['Bullet 1', 'Bullet 2'],
    });
  });

  it('resolves includesBridge from inheritIntroKey', () => {
    const t = makeT(
      {
        'billing.planMarketing.plus': {
          tagline: 'Plus tagline',
          bullets: ['Plus bullet'],
          inheritIntroKey: 'free',
        },
      },
      {
        'billing.planMarketing.free': 'Everything in Free, plus:',
      },
    );
    expect(getPlanCopy(t, PlanType.Plus)).toEqual({
      tagline: 'Plus tagline',
      includesBridge: 'Everything in Free, plus:',
      bullets: ['Plus bullet'],
    });
  });
});

describe('getPlanFeatureLines', () => {
  const objectData = {
    'billing.planMarketing.free': {
      tagline: 'Free tagline',
      bullets: ['Free bullet'],
    },
    'billing.planMarketing.basic': {
      tagline: 'Basic tagline',
      bullets: ['Basic bullet'],
    },
    'billing.planMarketing.plus': {
      tagline: 'Plus tagline',
      bullets: ['Plus bullet'],
    },
    'billing.planMarketing.premium': {
      tagline: 'Premium tagline',
      bullets: ['Premium bullet'],
    },
  };

  it('returns an empty array for a type outside the plan tier order', () => {
    const t = makeT(objectData);
    expect(getPlanFeatureLines(t, 'not-a-plan')).toEqual([]);
  });

  it('returns only the bullets for Free when type is Free', () => {
    const t = makeT(objectData);
    expect(getPlanFeatureLines(t, PlanType.Free)).toEqual(['Free bullet']);
  });

  it('accumulates bullets for every tier up to and including the given type', () => {
    const t = makeT(objectData);
    expect(getPlanFeatureLines(t, PlanType.Plus)).toEqual([
      'Free bullet',
      'Basic bullet',
      'Plus bullet',
    ]);
  });

  it('skips tiers whose translation could not be resolved', () => {
    const t = makeT({
      'billing.planMarketing.free': objectData['billing.planMarketing.free'],
      'billing.planMarketing.plus': objectData['billing.planMarketing.plus'],
    });
    expect(getPlanFeatureLines(t, PlanType.Plus)).toEqual([
      'Free bullet',
      'Plus bullet',
    ]);
  });
});

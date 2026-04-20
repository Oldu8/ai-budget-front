import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import type { Locale } from 'date-fns';
import { format, startOfDay } from 'date-fns';
import { enUS, es, uk as ukLocale } from 'date-fns/locale';
import React, { useMemo, useState } from 'react';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/shared/constants/theme';
import { IconSymbol } from '@/shared/ui/IconSymbol';
import { ThemedText } from '@/shared/ui/ThemedText';

const DATE_FNS_LOCALES: Record<string, Locale> = {
  en: enUS,
  es,
  uk: ukLocale,
};

interface TransactionDateFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  disabled?: boolean;
  /**
   * Max selectable date. `undefined` = today (manual expense default).
   * `null` = no upper bound (e.g. recurring start / end dates).
   */
  maximumDate?: Date | null;
  /** i18n key for text before formatted date (default `add.manual.datePrefix`). */
  datePrefixI18nKey?: string;
}

export function TransactionDateField<T extends FieldValues>({
  control,
  name,
  disabled = false,
  maximumDate: maximumDateProp,
  datePrefixI18nKey = 'add.manual.datePrefix',
}: TransactionDateFieldProps<T>) {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);

  const dateLocale = useMemo(() => {
    const code = i18n.language.split(/[-_]/)[0] ?? 'en';
    return DATE_FNS_LOCALES[code] ?? enUS;
  }, [i18n.language]);

  const resolvedMaximumDate =
    maximumDateProp === undefined
      ? new Date()
      : maximumDateProp === null
        ? undefined
        : maximumDateProp;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState }) => {
        const raw = value as unknown;
        const date =
          raw instanceof Date && !Number.isNaN(raw.getTime())
            ? raw
            : startOfDay(new Date());
        const line = `${t(datePrefixI18nKey)} ${format(date, 'MMM d, yyyy', {
          locale: dateLocale,
        })}`;

        const applyDate = (next: Date) => {
          onChange(startOfDay(next));
        };

        const onPickerChange = (
          event: DateTimePickerEvent,
          selected?: Date
        ) => {
          if (Platform.OS === 'android') {
            setOpen(false);
            if (event.type !== 'set' || !selected) return;
            applyDate(selected);
            return;
          }
          if (selected) applyDate(selected);
        };

        const openPicker = () => {
          if (disabled || Platform.OS === 'web') return;
          setOpen(true);
        };

        return (
          <View style={styles.wrap}>
            <Pressable
              onPress={openPicker}
              disabled={disabled || Platform.OS === 'web'}
              style={({ pressed }) => [
                styles.pressable,
                pressed && styles.rowPressed,
                disabled && styles.rowDisabled,
              ]}
            >
              {/*
                Inner row View (like SettingsRow): iOS Pressable does not always
                honor row flex for direct children — layout lives on the View.
              */}
              <View style={styles.row}>
                <View style={styles.iconContainer}>
                  <IconSymbol name="calendar" size={20} color={Colors.grey} />
                </View>
                <View style={styles.textWrap}>
                  <ThemedText
                    lightColor={Colors.grey}
                    style={styles.label}
                    numberOfLines={1}
                  >
                    {line}
                  </ThemedText>
                </View>
              </View>
            </Pressable>

            {fieldState.error?.message ? (
              <ThemedText
                style={styles.error}
                lightColor={Colors.error}
                numberOfLines={2}
              >
                {fieldState.error.message}
              </ThemedText>
            ) : null}

            {open && Platform.OS === 'android' ? (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                {...(resolvedMaximumDate != null
                  ? { maximumDate: resolvedMaximumDate }
                  : {})}
                onChange={onPickerChange}
              />
            ) : null}

            {Platform.OS === 'ios' ? (
              <Modal
                visible={open}
                animationType="slide"
                transparent
                onRequestClose={() => setOpen(false)}
              >
                <View style={styles.modalRoot}>
                  <Pressable
                    style={styles.modalBackdrop}
                    onPress={() => setOpen(false)}
                  />
                  <View
                    style={[
                      styles.modalSheet,
                      { paddingBottom: Math.max(insets.bottom, 16) },
                    ]}
                  >
                    <View style={styles.pickerWrap}>
                      <DateTimePicker
                        value={date}
                        mode="date"
                        display="spinner"
                        themeVariant="light"
                        {...(resolvedMaximumDate != null
                          ? { maximumDate: resolvedMaximumDate }
                          : {})}
                        onChange={onPickerChange}
                        style={styles.iosPicker}
                      />
                    </View>
                    <Pressable
                      onPress={() => setOpen(false)}
                      style={styles.doneBtn}
                    >
                      <ThemedText type="defaultSemiBold" style={styles.doneText}>
                        {t('add.manual.dateDone')}
                      </ThemedText>
                    </Pressable>
                  </View>
                </View>
              </Modal>
            ) : null}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'stretch',
    paddingHorizontal: 4,
    marginTop: 12,
    marginBottom: 4,
  },
  pressable: {
    width: '100%',
    minHeight: 44,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: Colors.greyLow,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.greyHover,
  },
  iconContainer: {
    width: 28,
    minWidth: 28,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textWrap: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
    flexShrink: 1,
  },
  rowPressed: {
    opacity: 0.85,
  },
  rowDisabled: {
    opacity: 0.55,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
  },
  error: {
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 8,
  },
  pickerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iosPicker: {
    alignSelf: 'center',
  },
  doneBtn: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  doneText: {
    color: Colors.primary,
    fontSize: 17,
  },
});

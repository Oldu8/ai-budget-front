import type React from 'react';

export interface SelectItem {
  label: string;
  value: string;
  subtitle?: string;
  leftIcon?: string;
  badge?: string;
  keywords?: string[];
}

export interface SearchableSelectTriggerProps {
  onPress: () => void;
}

export interface SearchableSelectProps {
  items: SelectItem[];
  value: string | null;
  placeholder?: string;
  onChange: (value: string) => void;
  /** When false, search input does not auto-focus (avoids opening keyboard). Default: false */
  autoFocusSearch?: boolean;
  /** Custom trigger; when provided, replaces the default trigger. Use for inline settings row. */
  renderTrigger?: (props: SearchableSelectTriggerProps) => React.ReactNode;
}

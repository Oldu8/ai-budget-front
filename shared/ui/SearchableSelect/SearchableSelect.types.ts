export interface SelectItem {
  label: string;
  value: string;
  subtitle?: string;
  leftIcon?: string;
  badge?: string;
  keywords?: string[];
}

export interface SearchableSelectProps {
  items: SelectItem[];
  value: string | null;
  placeholder?: string;
  onChange: (value: string) => void;
}

import { Colors } from '@/constants/theme';

type ThemeColorProps = {
  light?: string;
};

export function useThemeColor(props: ThemeColorProps, colorName: keyof typeof Colors) {
  if (props.light) {
    return props.light;
  }

  return Colors[colorName];
}

import type { ComponentProps } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export type IconSymbolName = ComponentProps<typeof MaterialIcons>['name'];

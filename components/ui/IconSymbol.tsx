// Fallback for using MaterialIcons on Android and web.

import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';
import { ThemedText } from '../ThemedText';

type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': '🏠',
  'list.bullet': '📋',
  'gear.fill': '⚙️',
  'paperplane.fill': '✈️',
  'chevron.left.forwardslash.chevron.right': '💻',
  'chevron.right': '➡️',
  'refresh': '🔄', // Added refresh icon
} as const;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
}) {
  return <ThemedText style={[{ fontSize: size, color }, style]}>{MAPPING[name]}</ThemedText>;
}

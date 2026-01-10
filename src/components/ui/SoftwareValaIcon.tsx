import { cn } from '@/lib/utils';
import logoImage from '@/assets/logo.jpg';

type IconSize = 'favicon-sm' | 'favicon' | 'mobile' | 'header' | 'sidebar-collapsed' | 'sidebar-expanded' | 'button' | 'large';

interface SoftwareValaIconProps {
  size?: IconSize;
  className?: string;
}

const sizeMap: Record<IconSize, number> = {
  'favicon-sm': 16,
  'favicon': 32,
  'mobile': 28,
  'header': 36,
  'sidebar-collapsed': 32,
  'sidebar-expanded': 36,
  'button': 40,
  'large': 48,
};

/**
 * Software Vala – Round Icon (Official)
 * 
 * Master component for the Software Vala logo.
 * - Perfect circle (100% radius)
 * - No shadow, border, glow, or background
 * - Scales proportionally on all screens
 * 
 * @usage
 * <SoftwareValaIcon size="header" />
 * <SoftwareValaIcon size="sidebar-collapsed" />
 * <SoftwareValaIcon size="sidebar-expanded" />
 * <SoftwareValaIcon size="large" />
 */
export function SoftwareValaIcon({ size = 'header', className }: SoftwareValaIconProps) {
  const dimension = sizeMap[size];

  return (
    <img
      src={logoImage}
      alt="Software Vala"
      width={dimension}
      height={dimension}
      className={cn(
        'rounded-full object-cover object-center shrink-0',
        'select-none pointer-events-none',
        className
      )}
      style={{
        width: dimension,
        height: dimension,
        minWidth: dimension,
        minHeight: dimension,
      }}
      draggable={false}
    />
  );
}

export default SoftwareValaIcon;

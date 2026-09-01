/**
 * KPICard — Molecule
 * Key performance metric card displaying label, value, Badge atom, and trend indicator.
 * Used in: SettingsPanel, AppShell
 */

import React from 'react'
import { Badge } from '@/components/atoms/Badge'
import { Icon } from '@/components/atoms/Icon'
import { KPICardProps } from './KPICard.types'

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  trend,
  badgeText,
  badgeVariant = 'neutral',
  className = '',
}) => {
  return (
    <div
      className={[
        'p-5 rounded-xl border border-border-default bg-bg-surface-1 text-text-primary shadow-xs flex flex-col gap-2 transition-all hover:border-border-strong',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider">
          {title}
        </span>
        {badgeText && <Badge variant={badgeVariant}>{badgeText}</Badge>}
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <span className="text-2xl font-bold font-serif">{value}</span>
        {change && (
          <span
            className={[
              'text-xs font-medium inline-flex items-center gap-0.5',
              trend === 'up'
                ? 'text-status-success-text'
                : trend === 'down'
                ? 'text-status-error-text'
                : 'text-text-tertiary',
            ].join(' ')}
          >
            {trend === 'up' && <Icon name="check" size={12} />}
            {trend === 'down' && <Icon name="x" size={12} />}
            {change}
          </span>
        )}
      </div>
    </div>
  )
}

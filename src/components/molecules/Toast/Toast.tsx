/**
 * Toast — Molecule
 * Alert notification banner combining Icon, text, and close Button atoms.
 * Used in: SettingsPanel, AppShell
 */

import React from 'react'
import { Icon, IconName } from '@/components/atoms/Icon'
import { Button } from '@/components/atoms/Button'
import { ToastProps } from './Toast.types'

export const Toast: React.FC<ToastProps> = ({
  title,
  description,
  type = 'info',
  onDismiss,
  className = '',
}) => {
  const iconMap: Record<NonNullable<ToastProps['type']>, IconName> = {
    success: 'check',
    warning: 'bell',
    error: 'x',
    info: 'bell',
  }

  const containerStyles: Record<NonNullable<ToastProps['type']>, string> = {
    success: 'bg-status-success-bg border-status-success-border text-status-success-text',
    warning: 'bg-status-warning-bg border-status-warning-border text-status-warning-text',
    error: 'bg-status-error-bg border-status-error-border text-status-error-text',
    info: 'bg-status-info-bg border-status-info-border text-status-info-text',
  }

  return (
    <div
      role="alert"
      className={[
        'flex items-start gap-3 p-4 rounded-lg border shadow-sm transition-all w-full max-w-md',
        containerStyles[type],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Icon name={iconMap[type]} size={20} className="mt-0.5" />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold">{title}</h4>
        {description && <p className="text-xs opacity-90 mt-0.5">{description}</p>}
      </div>
      {onDismiss && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          aria-label="Dismiss toast"
          className="h-6 w-6 p-0 hover:bg-transparent opacity-70 hover:opacity-100"
        >
          <Icon name="x" size={14} />
        </Button>
      )}
    </div>
  )
}

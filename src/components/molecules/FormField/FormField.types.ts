import { InputProps } from '@/components/atoms/Input'

export interface FormFieldProps extends InputProps {
  label: string
  helperText?: string
  errorMessage?: string
  required?: boolean
}

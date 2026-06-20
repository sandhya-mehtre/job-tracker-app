import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'
import { cn } from '@/lib/utils'

const CONTROL_CLASSES =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-indigo-500/20 aria-[invalid=true]:border-red-400'

interface FieldWrapperProps {
  label: string
  htmlFor?: string
  error?: string
  required?: boolean
  children: ReactNode
}

/** Label + control + error message layout shared by every field. */
export function Field({ label, htmlFor, error, required, children }: FieldWrapperProps) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput({ label, error, required, id, className, ...rest }, ref) {
    return (
      <Field label={label} htmlFor={id} error={error} required={required}>
        <input
          id={id}
          ref={ref}
          aria-invalid={Boolean(error)}
          className={cn(CONTROL_CLASSES, className)}
          {...rest}
        />
      </Field>
    )
  },
)

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  options: readonly { value: string; label: string }[]
  placeholder?: string
}

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  function SelectInput(
    { label, error, required, id, options, placeholder, className, ...rest },
    ref,
  ) {
    return (
      <Field label={label} htmlFor={id} error={error} required={required}>
        <select
          id={id}
          ref={ref}
          aria-invalid={Boolean(error)}
          className={cn(CONTROL_CLASSES, className)}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>
    )
  },
)

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea({ label, error, required, id, className, ...rest }, ref) {
    return (
      <Field label={label} htmlFor={id} error={error} required={required}>
        <textarea
          id={id}
          ref={ref}
          aria-invalid={Boolean(error)}
          className={cn(CONTROL_CLASSES, 'min-h-24 resize-y', className)}
          {...rest}
        />
      </Field>
    )
  },
)

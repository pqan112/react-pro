import { forwardRef, InputHTMLAttributes, useState } from 'react'

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
}

const NUMBER_REGEX = /^\d+$/

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberInner(
  {
    errorMessage,
    className,
    classNameInput = 'w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500',
    classNameError = 'mt-1 min-h-[1.3rem] text-sm text-red-600',
    onChange,
    value = '',
    ...rest
  },
  ref
) {
  const [localValue, setLocalValue] = useState(value)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (NUMBER_REGEX.test(value) || value === '') {
      onChange && onChange(event)
      // update localValue
      setLocalValue(value)
    }
  }

  return (
    <div className={className}>
      <input
        className={classNameInput}
        value={value === undefined ? localValue : value}
        onChange={handleChange}
        {...rest}
        ref={ref}
      />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
})

export default InputNumber

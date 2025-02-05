import { InputHTMLAttributes } from 'react'
import type { UseFormRegister } from 'react-hook-form'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>
}

const Input = ({
  type,
  errorMessage,
  placeholder,
  className,
  name,
  register,
  autoComplete,
  classNameInput = 'w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500',
  classNameError = 'mt-1 min-h-[1.3rem] text-sm text-red-600'
}: Props) => {
  const registerResult = register && name ? register(name) : {}
  return (
    <div className={className}>
      <input
        type={type}
        placeholder={placeholder}
        className={classNameInput}
        {...registerResult}
        autoComplete={autoComplete}
        // onKeyUp={() => trigger(name)}
      />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}

export default Input

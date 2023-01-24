import type { UseFormRegister, UseFormTrigger, RegisterOptions } from 'react-hook-form'

interface Props {
  type: React.HTMLInputTypeAttribute
  errorMessage?: string
  placeholder?: string
  className?: string
  name: string
  register: UseFormRegister<any>
  autoComplete?: string
  // trigger: UseFormTrigger<any>
  // rules: RegisterOptions
}

const Input = ({
  type,
  errorMessage,
  placeholder,
  className,
  name,
  register,
  autoComplete
}: Props) => {
  return (
    <div className={className}>
      <input
        type={type}
        className='w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500'
        placeholder={placeholder}
        // {...register(name, rules)}
        {...register(name)}
        autoComplete={autoComplete}
        // onKeyUp={() => trigger(name)}
      />
      <div className='mt-1 min-h-[1.3rem] text-sm text-red-600'>{errorMessage}</div>
    </div>
  )
}

export default Input

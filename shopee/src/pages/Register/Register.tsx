import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { omit } from 'lodash'
import { useContext } from 'react'

import { schema, type RegisterSchema } from 'src/utils/rules'
import Input from 'src/components/Input'
import { registerAccount } from 'src/apis/auth.api'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import { AppContext } from 'src/contexts/app.context'

type FormData = RegisterSchema

const Register = () => {
  const navigate = useNavigate()
  const { setIsAuthenticated } = useContext(AppContext)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => registerAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    console.log(data)
    // const { confirm_password, ...body } = data
    const body = omit(data, ['confirm_password'])
    registerAccountMutation.mutate(body, {
      onSuccess: () => {
        setIsAuthenticated(true)
        navigate('/')
      },
      onError: (error) => {
        if (
          isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)
        ) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                type: 'Server'
              })
            })
          }
          // if (formError?.email) {
          //   setError('email', {
          //     message: formError.email,
          //     type: 'Server'
          //   })
          // }
          // if (formError?.password) {
          //   setError('password', {
          //     message: formError.password,
          //     type: 'Server'
          //   })
          // }
        }
      }
    })
  })

  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <h1 className='text-2xl'>Đăng ký</h1>
              <Input
                type='email'
                name='email'
                className='mt-8'
                placeholder='Enter email'
                register={register}
                // trigger={trigger}
                // rules={rules.email}
                errorMessage={errors.email?.message}
              />
              <Input
                type='password'
                name='password'
                className='mt-2'
                placeholder='Enter password'
                autoComplete='on'
                register={register}
                // trigger={trigger}
                // rules={rules.password}
                errorMessage={errors.password?.message}
              />
              <Input
                type='password'
                name='confirm_password'
                className='mt-2'
                placeholder='Enter confirm password'
                autoComplete='on'
                register={register}
                // trigger={trigger}
                // rules={rules.confirm_password}
                errorMessage={errors.confirm_password?.message}
              />

              <div className='mt-3'>
                <button
                  type='submit'
                  className='w-full bg-red-500 py-4 px-2 text-center text-sm uppercase text-white hover:bg-red-700'
                >
                  Đăng ký
                </button>
              </div>
              <div className='mt-8'>
                <div className='flex items-center justify-center'>
                  <span className='text-gray-500'>Bạn đã có tài khoản?</span>
                  <Link to='/login' className='ml-1 text-red-400'>
                    Đăng nhập
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register

import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import userApi from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import InputNumber from 'src/components/InputNumber'
import { QueryKeys } from 'src/constants/queryKey'
import { AppContext } from 'src/contexts/app.context'
import { ErrorResponse } from 'src/types/utils.type'
import { setProfileToLocalStorage } from 'src/utils/auth'
import { userSchema, UserSchema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import DateSelect from '../../components/DateSelect'

// Flow 1:
// Nhấn upload: upload lên server luôn => server trả về url ảnh
// Nhấn submit thì gửi url ảnh cộng với data lên server
// user spam gửi nhiều hình lên server
// get progress and status

// Flow 2:
// Nhấn upload: không upload lên server
// Nhấn submit thì tiến hành upload lên server, nếu upload thành công thì tiến hành gọi api updateProfile

type FormData = Pick<UserSchema, 'name' | 'address' | 'phone' | 'date_of_birth' | 'avatar'>
type FormDataError = Omit<FormData, 'date_of_birth'> & {
  date_of_birth?: string
}
const profileSchema = userSchema.pick(['name', 'address', 'phone', 'date_of_birth', 'avatar'])
export default function Profile() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  // const [status, setStatus] = useState<UploadStatus>(Status.Idle)
  // const [progress, setProgress] = useState<number>(0)
  const { setProfile } = useContext(AppContext)
  const { data: profileData } = useQuery({
    queryKey: [QueryKeys.profile],
    queryFn: userApi.getProfile
  })

  console.log('profileData', profileData)
  const profile = profileData?.data.data
  const {
    register,
    control,
    formState: { errors, isDirty },
    handleSubmit,
    watch,
    setValue,
    reset,
    setError
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(profileSchema)
  })
  const avatar = watch('avatar')
  console.log('isDirty', isDirty)
  const previewImage = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return avatar
  }, [file, avatar])

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        address: profile.address,
        avatar: profile.avatar,
        date_of_birth: profile.date_of_birth // string ISO-8601
          ? new Date(profile.date_of_birth)
          : new Date(1990, 0, 1),
        phone: profile.phone
      })
    }
  }, [profile, reset])

  // get progess upload image
  // const uploadAvatar = async () => {
  //   if (!file) return
  //   setStatus(Status.Loading)
  //   setProgress(0)
  //   const formData = new FormData()
  //   formData.append('image', file)
  //   try {
  //     const res = await http.post<SuccessResponse<string>>('user/upload-avatar', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       },
  //       onUploadProgress: (progressEvent: AxiosProgressEvent) => {
  //         const progress = progressEvent.total
  //           ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
  //           : 0
  //         setProgress(progress)
  //       }
  //     })
  //     setValue('avatar', res.data.data)
  //     setStatus(Status.Success)
  //     setProgress(100)
  //   } catch (error) {
  //     console.log('error', error)
  //     setStatus(Status.Error)
  //     setProgress(0)
  //   }
  // }

  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile
  })
  const uploadAvatarMutaion = useMutation({
    mutationFn: userApi.uploadAvatar
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!file) return
      let avatarName = avatar
      const form = new FormData()
      form.append('image', file)
      const uploadRes = await uploadAvatarMutaion.mutateAsync(form)
      avatarName = uploadRes.data.data
      setValue('avatar', avatarName)
      const res = await updateProfileMutation.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar: avatarName
      })
      setProfile(res.data.data)
      setProfileToLocalStorage(res.data.data)
      toast.success(res.data.message)
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormDataError>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormDataError, {
              message: formError[key as keyof FormDataError],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]
    if (fileFromLocal) {
      setFile(fileFromLocal)
    }
  }

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveAvatar = () => {
    setFile(null)
    setValue('avatar', '')
    // fix behavior xóa image cũ rồi không chọn được image đó nữa -> set value của input field là string rỗng
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Hồ Sơ Của Tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </div>
      </div>
      {/* <FormProvider {...methods}> */}
      <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit}>
        <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
          <div className='flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Email</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <div className='pt-3 text-gray-700'>{profile?.email}</div>
            </div>
          </div>
          {/* <Info /> */}
          <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Tên</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                name='name'
                placeholder='Tên'
                errorMessage={errors.name?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Số điện thoại</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Controller
                control={control}
                name='phone'
                render={({ field }) => (
                  <InputNumber
                    classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                    placeholder='Số điện thoại'
                    errorMessage={errors.phone?.message}
                    {...field}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>

          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Địa chỉ</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                name='address'
                placeholder='Địa chỉ'
                errorMessage={errors.address?.message}
              />
            </div>
          </div>
          <Controller
            control={control}
            name='date_of_birth'
            render={({ field }) => (
              <DateSelect
                errorMessage={errors.date_of_birth?.message}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right' />
            <div className='sm:w-[80%] sm:pl-5'>
              <Button
                className='flex h-9 items-center rounded-sm bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'
                type='submit'
                disabled={!isDirty}
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>
        <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
          <div className='flex flex-col items-center'>
            <div className='relative my-5 h-24 w-24'>
              {previewImage ? (
                <button
                  className='absolute top-0 right-0 h-5 w-5 rounded-full bg-red-600 text-white'
                  type='button'
                  onClick={handleRemoveAvatar}
                >
                  x
                </button>
              ) : null}
              <img
                src={previewImage}
                alt='avatar'
                className='h-full w-full rounded-full object-cover'
              />
            </div>
            {/* {status === Status.Loading && (
              <div className='mb-3 h-2 w-[100px] rounded-md border border-gray-300'>
                <div
                  className='h-full rounded-md bg-blue-600'
                  style={{ width: `${progress}px` }}
                ></div>
              </div>
            )} */}
            <input
              className='hidden'
              type='file'
              accept='.jpg,.jpeg,.png'
              ref={fileInputRef}
              onChange={handleChangeFile}
            />
            <button
              className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'
              type='button'
              onClick={handleUpload}
            >
              Chọn ảnh
            </button>

            <div className='mt-3 text-gray-400'>
              <div>Dụng lượng file tối đa 1 MB</div>
              <div>Định dạng:.JPEG, .PNG</div>
            </div>
          </div>
        </div>
      </form>
      {/* </FormProvider> */}
    </div>
  )
}

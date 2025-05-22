import React from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import useQueryConfig from './useQueryConfig'
import { useForm } from 'react-hook-form'
import { schema, Schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { omit } from 'lodash'
import path from 'src/constants/path'

type FormData = Pick<Schema, 'name'>
const nameSchema = schema.pick(['name'])

export default function useSearchProducts() {
  const navigate = useNavigate()
  const queryConfig = useQueryConfig()

  const { register, handleSubmit, formState } = useForm<FormData>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(nameSchema)
  })
  const onSubmitSearch = handleSubmit((data: FormData) => {
    const config = queryConfig.order
      ? omit(
          {
            ...queryConfig,
            name: data.name,
            page: String(1)
          },
          ['order', 'sort_by']
        )
      : {
          ...queryConfig,
          name: data.name,
          page: String(1)
        }

    navigate({
      pathname: path.home,
      search: createSearchParams(config).toString()
    })
  })

  return { onSubmitSearch, register, formState }
}

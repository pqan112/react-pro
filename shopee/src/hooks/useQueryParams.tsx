import { useSearchParams } from 'react-router-dom'

export default function useQueryParams() {
  const [searchParams] = useSearchParams()

  console.log(searchParams)
  console.log(searchParams.get('page'))
  console.log(Object.fromEntries([...searchParams]))

  return Object.fromEntries([...searchParams])
}

import React from 'react'

export default function DateSelect() {
  return (
    <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
      <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Ngày sinh</div>
      <div className='sm:w-[80%] sm:pl-5'>
        <div className='flex justify-between'>
          <select className='h-10 w-[32%] rounded-sm border border-black/10 px-3'>
            <option disabled>Ngày</option>
          </select>
          <select className='h-10 w-[32%] rounded-sm border border-black/10 px-3'>
            <option disabled>Tháng</option>
          </select>
          <select className='h-10 w-[32%] rounded-sm border border-black/10 px-3'>
            <option disabled>Năm</option>
          </select>
        </div>
      </div>
    </div>
  )
}

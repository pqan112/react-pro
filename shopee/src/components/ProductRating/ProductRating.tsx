import React from 'react'

const ProductRating = ({ rating }: { rating: number }) => {
  // rating = 3.4

  const handleWidth = (order: number) => {
    // 1 <=3.4 => 100%
    // 2 <=3.4 => 100%
    // 3 <=3.4 => 100%

    if (order <= rating) {
      return '100%'
    }
    // 4 > 3.4  && 4 - 3.4 < 1 => 40%
    // return 3.4 - 3 = 0.4 * 100 = 40%
    if (order > rating && order - rating < 1) {
      return (rating - Math.floor(rating)) * 100 + '%'
    }
    // 5 > 3.4 && 5 - 3.4 > 1 => 0%
    return '0%'
  }

  return (
    <div className='flex items-center'>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <div className='relative' key={index}>
            <div
              className='absolute top-0 left-0 h-full overflow-hidden'
              style={{ width: handleWidth(index + 1) }}
            >
              <svg
                enableBackground='new 0 0 15 15'
                viewBox='0 0 15 15'
                x={0}
                y={0}
                className='h-3 w-3 fill-yellow-500 text-yellow-500'
              >
                <polygon
                  points='7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeMiterlimit={10}
                />
              </svg>
            </div>
            <svg
              enableBackground='new 0 0 15 15'
              viewBox='0 0 15 15'
              x={0}
              y={0}
              className='h-3 w-3 fill-current text-gray-400'
            >
              <polygon
                points='7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeMiterlimit={10}
              />
            </svg>
          </div>
        ))}
    </div>
  )
}

export default ProductRating

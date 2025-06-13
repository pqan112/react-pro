import { useMutation, useQuery } from '@tanstack/react-query'
import { produce } from 'immer'
import isEqual from 'lodash/isEqual'
import keyBy from 'lodash/keyBy'
import { useContext, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

import purchaseApi from 'src/apis/purchase.api'
import noproduct from 'src/assets/images/no-product.png'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import path from 'src/constants/path'
import { purchaseStatus } from 'src/constants/purchase'
import { QueryKeys } from 'src/constants/queryKey'
import { AppContext } from 'src/contexts/app.context'
import { ExtendedPurchase, Purchase } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'

export default function Cart() {
  const location = useLocation()
  const purchaseBuyNowId = (location.state as { purchaseId: string } | null)?.purchaseId
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext)
  const { data: purchaseInCartData, refetch } = useQuery({
    queryKey: [QueryKeys.purchases, { status: purchaseStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchaseStatus.inCart })
  })
  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetch()
    }
  })
  const buyProductsMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (data) => {
      refetch()
      toast.success(data.data.message, {
        position: 'top-center',
        autoClose: 1000
      })
    }
  })
  const deletePurchasesMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: () => {
      refetch()
    }
  })
  const purchasesInCart = purchaseInCartData?.data.data

  const isAllChecked = useMemo(
    () => extendedPurchases.every((purchase) => purchase.checked),
    [extendedPurchases]
  )
  const checkedPurchases = useMemo(
    () => extendedPurchases.filter((purchase) => purchase.checked),
    [extendedPurchases]
  )
  const checkedPurchasesCount = checkedPurchases.length

  const totalCheckedPurchasePrice = useMemo(
    () =>
      checkedPurchases.reduce((total, purchase) => {
        return total + purchase.product.price * purchase.buy_count
      }, 0),
    [checkedPurchases]
  )
  const totalCheckedPurchaseSavingPrice = useMemo(
    () =>
      checkedPurchases.reduce((total, purchase) => {
        return (
          total +
          (purchase.product.price_before_discount - purchase.product.price) * purchase.buy_count
        )
      }, 0),
    [checkedPurchases]
  )

  // because extendedPurchases is move to AppContext,
  // it has a different reference with the new state
  // so we have to check are the prev and new state equal
  // before updating the state
  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchaseObject = keyBy(prev, '_id')
      const newExtendedPurchases =
        purchasesInCart?.map((purchase) => {
          const isChoosenPurchaseFromLocation = purchaseBuyNowId === purchase._id
          return {
            ...purchase,
            disabled: false,
            checked:
              isChoosenPurchaseFromLocation ||
              Boolean(extendedPurchaseObject[purchase._id]?.checked)
          }
        }) || []

      // Only update if the new state is different from the previous state
      if (isEqual(prev, newExtendedPurchases)) {
        return prev
      }
      return newExtendedPurchases
    })
  }, [purchasesInCart, purchaseBuyNowId])

  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  }, [])

  const handleCheck = (purchaseId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draft) => {
        const purchaseIndex = draft.findIndex(
          (purchase: ExtendedPurchase) => purchase._id === purchaseId
        )
        if (purchaseIndex >= 0) {
          draft[purchaseIndex].checked = e.target.checked
        }
      })
    )
  }

  const handleCheckAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => ({ ...purchase, checked: !isAllChecked }))
    )
  }

  const handleTypeQuantity = (purchaseId: string) => (value: number) => {
    const purchaseIndex = extendedPurchases.findIndex(
      (purchase: ExtendedPurchase) => purchase._id === purchaseId
    )
    if (purchaseIndex < 0) return
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }

  const handleQuantity = (purchaseId: string, value: number, enable: boolean) => {
    if (enable) {
      const purchaseIndex = extendedPurchases.findIndex(
        (purchase: ExtendedPurchase) => purchase._id === purchaseId
      )
      if (purchaseIndex < 0) return
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disabled = true
        })
      )
      updatePurchaseMutation.mutate({
        product_id: purchase?.product._id as string,
        buy_count: value
      })
    }
  }

  const handleDelete = (purchaseId: string) => () => {
    const extendedPurchaseObject = keyBy(extendedPurchases, '_id')
    deletePurchasesMutation.mutate([extendedPurchaseObject[purchaseId]._id])
  }

  const handleDeleteManyPurchases = () => {
    const purchasesIds = checkedPurchases.map((purchase) => purchase._id)
    deletePurchasesMutation.mutate(purchasesIds)
  }

  const handleBuyPurchases = () => {
    if (checkedPurchases.length > 0) {
      const body = checkedPurchases.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count
      }))
      buyProductsMutation.mutate(body)
    }
  }

  return (
    <div className='bg-neutral-100 py-16'>
      <div className='container'>
        {extendedPurchases.length > 0 ? (
          <>
            <div className='overflow-auto'>
              <div className='min-w-[1000px]'>
                <div className='grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow'>
                  <div className='sticky left-9 col-span-6 bg-white'>
                    <div className='flex items-center'>
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <input
                          type='checkbox'
                          className='h-5 w-5 accent-orange'
                          checked={isAllChecked && extendedPurchases.length > 0}
                          onChange={handleCheckAll}
                        />
                      </div>
                      <div className='flex-grow text-black'>Sản phẩm</div>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div className='grid grid-cols-5 text-center'>
                      <div className='col-span-2'>Đơn giá</div>
                      <div className='col-span-1'>Số lượng</div>
                      <div className='col-span-1'>Số tiền</div>
                      <div className='col-span-1'>Thao tác</div>
                    </div>
                  </div>
                </div>
                <div className='my-3 rounded-sm shadow'>
                  {extendedPurchases?.map((purchase, index) => (
                    <div
                      className='mb-5 grid grid-cols-12 items-center rounded-sm bg-white py-5 px-9 text-center text-sm text-gray-500 first:mt-0'
                      key={purchase._id}
                    >
                      <div className='sticky left-9 col-span-6 bg-white'>
                        <div className='flex'>
                          <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                            <input
                              type='checkbox'
                              className='h-5 w-5 accent-orange'
                              checked={purchase.checked}
                              onChange={handleCheck(purchase._id)}
                            />
                          </div>
                          <div className='flex-grow'>
                            <div className='flex'>
                              <Link
                                className='h-20 w-20 flex-shrink-0'
                                to={`${path.home}${generateNameId({
                                  name: purchase.product.name,
                                  id: purchase.product._id
                                })}`}
                              >
                                <img alt={purchase.product.name} src={purchase.product.image} />
                              </Link>
                              <div className='flex-grow px-2 pt-1 pb-2'>
                                <Link
                                  to={`${path.home}${generateNameId({
                                    name: purchase.product.name,
                                    id: purchase.product._id
                                  })}`}
                                  className='text-left line-clamp-2'
                                >
                                  {purchase.product.name}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col-span-6'>
                        <div className='grid grid-cols-5 items-center'>
                          <div className='col-span-2'>
                            <div className='flex items-center justify-center'>
                              <span className='text-gray-300 line-through'>
                                ₫{formatCurrency(purchase.product.price_before_discount)}
                              </span>
                              <span className='ml-3'>
                                ₫{formatCurrency(purchase.product.price)}
                              </span>
                            </div>
                          </div>
                          <div className='col-span-1'>
                            <QuantityController
                              max={purchase.product.quantity}
                              value={purchase.buy_count}
                              classNameWrapper=''
                              onIncrease={(value) =>
                                handleQuantity(
                                  purchase._id,
                                  value,
                                  value <= purchase.product.quantity
                                )
                              }
                              onDecrease={(value) =>
                                handleQuantity(purchase._id, value, value >= 1)
                              }
                              onType={handleTypeQuantity(purchase._id)}
                              onFocusOut={(value) => {
                                handleQuantity(
                                  purchase._id,
                                  value,
                                  value >= 1 &&
                                    value <= purchase.product.quantity &&
                                    value !== (purchasesInCart as Purchase[])[index].buy_count
                                )
                              }}
                              disabled={purchase.disabled}
                            />
                          </div>
                          <div className='col-span-1'>
                            <span className='text-orange'>
                              ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                            </span>
                          </div>
                          <div className='col-span-1'>
                            <button
                              onClick={handleDelete(purchase._id)}
                              className='bg-none text-black transition-colors hover:text-orange'
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='sticky bottom-0 z-10 mt-8 flex flex-col rounded-sm border border-gray-100 bg-white p-5 shadow sm:flex-row sm:items-center'>
              <div className='flex items-center'>
                <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                  <input
                    type='checkbox'
                    className='h-5 w-5 accent-orange'
                    checked={isAllChecked && extendedPurchases.length > 0}
                    onChange={handleCheckAll}
                  />
                </div>

                <button className='mx-3 border-none bg-none'>
                  Chọn tất cả ({extendedPurchases.length})
                </button>

                <button onClick={handleDeleteManyPurchases} className='mx-3 border-none bg-none'>
                  Xóa
                </button>
              </div>

              <div className='mt-5 flex flex-col sm:ml-auto sm:mt-0 sm:flex-row sm:items-center'>
                <div>
                  <div className='flex items-center sm:justify-end'>
                    <div>Tổng thanh toán ({checkedPurchasesCount} sản phẩm):</div>
                    <div className='ml-2 text-2xl text-orange'>
                      ₫{formatCurrency(totalCheckedPurchasePrice)}
                    </div>
                  </div>
                  <div className='flex items-center text-sm sm:justify-end'>
                    <div className='text-gray-500'>Tiết kiệm</div>
                    <div className='ml-6 text-orange'>
                      ₫{formatCurrency(totalCheckedPurchaseSavingPrice)}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleBuyPurchases}
                  disabled={buyProductsMutation.isLoading}
                  className='flex h-10 w-52 items-center justify-center bg-red-500 text-sm uppercase text-white hover:bg-red-600 sm:ml-4 sm:mt-0'
                >
                  Mua hàng
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className='text-center'>
            <img src={noproduct} alt='no purchase' className='mx-auto h-24 w-24' />
            <div className='mt-5 font-bold capitalize text-gray-600'>Chưa có sản phẩm</div>
            <Link
              to={path.home}
              className='mt-5 inline-block bg-orange px-8 py-3 uppercase text-white transition-all hover:bg-orange/80'
            >
              Mua ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

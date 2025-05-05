export const purchaseStatus = {
  inCart: -1,
  all: 0,
  waitForConfirmation: 1,
  waitForGetting: 2,
  inProgress: 3,
  delivered: 4,
  cancelled: 5
} as const

export type PurchaseListStatus = (typeof purchaseStatus)[keyof typeof purchaseStatus]

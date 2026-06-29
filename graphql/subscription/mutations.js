import { gql } from 'graphql-tag'

export const VALIDATE_TOP_UP = gql`
  mutation unitTopUp($transaction: String) {
    validateTransaction(transaction: $transaction) {
      id
      action_type
      units
      amount
      created_at
    }
  }
`

export const INIT_SUBSCRIPTION_PAYMENT_MUTATION = gql`
  mutation initPay($units: Int, $action_type: String) {
    initStripePayment(units: $units, action_type: $action_type)
  }
`

export const CANCEL_UNIT_TOP_UP = gql`
  mutation cancelUnitTopUp($transaction: String) {
    cancelStripePayment(transaction: $transaction)
  }
`

export const INIT_PLAN_UPGRADE = gql`
  mutation changePlan($plan_id: Int) {
    changePlan(plan_id: $plan_id)
  }
`
export const CANCEL_PLAN_UPGRADE = gql`
  mutation cancelPlanUpgrade($transaction: String) {
    cancelPlanUpgrade(transaction: $transaction)
  }
`
export const CONFIRM_PLAN_UPGRADE = gql`
  mutation confirmPlanUpgrade($transaction: String) {
    confirmPlanUpgrade(transaction: $transaction)
  }
`

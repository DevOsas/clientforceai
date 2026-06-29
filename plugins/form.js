import { Form } from 'vform'

export default ({ app: { $axios } }, inject) => {
  Form.axios = $axios

  inject('form', Form)
}

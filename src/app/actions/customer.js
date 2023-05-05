import { fetch } from '../../utils/fetch'

const getCustomerData = (query) => (dispatch) =>
	new Promise((resolve, reject) => {
		fetch({
			method: 'get',
			url: 'https://mocki.io/v1/5cd16cc8-79ce-460c-9149-2798f7762561',
			query,
		})
			.then((res) => {
				if (res.data.success) {
					dispatch(setCustomerData(res.data.data))
					resolve(true)
				} else {
					reject(res.data)
				}
			})
			.catch((error) => {
				console.log(error)
			})
	})

const setCustomerData = (data) => ({
	type: 'GETDATA',
	customerData: data,
})

export default {
	getCustomerData,
}

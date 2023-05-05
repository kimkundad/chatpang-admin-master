import { fetch } from '../../utils/fetch'

const getSuperAdminData = (query) => (dispatch) => {
	dispatch(onLoading(true))
	return new Promise((resolve, reject) => {
		fetch({
			method: 'get',
			url: '/super-admin',
			query,
		})
			.then((res) => {
				if (res.data.success) {
					const data =res.data.data
				const resData=	data.map((val,i)=>{
					val.key=i+1 
					return val
				})
					dispatch(setSuperAdminData(resData))
					dispatch(onLoading(false))
					resolve(true)
				} else {
					dispatch(onLoading(false))
					reject(res.data)
				}
			})
			.catch((error) => {
				console.log(error)
			})
	})
}

const getSuperAdminDetail = (userId) => (dispatch) => {
	dispatch(onLoading(true))
	return new Promise((resolve, reject) => {
		fetch({
			method: 'get',
			url: `/super-admin/${userId}`,
		})
			.then((res) => {
				if (res.data.success) {
					dispatch(setSuperAdminDetail(res.data.data))
					dispatch(onLoading(false))
					resolve(true)
				} else {
					dispatch(onLoading(false))
					reject(res.data)
				}
			})
			.catch((error) => {
				console.log(error)
			})
	})
}

const createSuperAdminDetail = (data) => (dispatch) => {
	dispatch(onLoading(true))

	return new Promise((resolve, reject) => {
		fetch({
			method: 'POST',
			url: '/super-admin',
			data,
		})
			.then((res) => {
				if (res.data.success) {
					dispatch(onLoading(false))
					resolve(true)
				} else {
					dispatch(onLoading(false))
					reject(res.data)
				}
			})
			.catch((error) => {
				console.log(error)
			})
	})
}

const updateSuperAdminDetail = (userId, data) => (dispatch) => {
	dispatch(onLoading(true))
	return new Promise((resolve, reject) => {
		fetch({
			method: 'put',
			url: `/super-admin/${userId}`,
			data,
		})
			.then((res) => {
				if (res.data.success) {
					dispatch(onLoading(false))
					resolve(true)
				} else {
					console.log('eee', res.data)
					dispatch(onLoading(false))
					reject(res.data)
				}
			})
			.catch((error) => {
				console.log(error)
			})
	})
}

const deleteSuperAdminDetail = (userId) => (dispatch) => {
	dispatch(onLoading(true))

	return new Promise((resolve, reject) => {
		fetch({
			method: 'delete',
			url: `/super-admin/${userId}`,
		})
			.then((res) => {
				if (res.data.success) {
					dispatch(onLoading(false))
					resolve(true)
				} else {
					dispatch(onLoading(false))
					reject(res.data)
				}
			})
			.catch((error) => {
				console.log(error)
			})
	})
}

const setActionPage = (value) => ({
	type: 'SETACTION',
	actionPage: value,
})

const setSuperAdminData = (data) => ({
	type: 'GETDATA',
	superAdminData: data,
})
const setSuperAdminDetail = (detail) => ({
	type: 'GETDETAIL',
	superAdminDetail: detail,
})
const onLoading = (action) => ({
	type: 'LOADING',
	isLoading: action,
})

export default {
	getSuperAdminData,
	getSuperAdminDetail,
	createSuperAdminDetail,
	updateSuperAdminDetail,
	deleteSuperAdminDetail,
	setActionPage,
	setSuperAdminData,
}

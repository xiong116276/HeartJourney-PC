import {
	getBaseURL,getRootURL
} from '../../../public/js/common.js';
let rootURL = getRootURL();
let baseURL = getBaseURL();
import {Message} from 'element-ui'
//配置axios
import axios from 'axios'
import $ from "jquery";
axios.defaults.timeout = 1000*30; //响应时间，大量数据请求时，会超时，所有时间设置长点
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; //配置请求头
axios.defaults.baseURL = baseURL; //配置接口地址
import CryptoJS from 'crypto-js';

let aesKey = 'dc96245b9fa5070a';

let aesEncrypt = function(word) {
	let key = CryptoJS.enc.Utf8.parse(aesKey);
	let srcs = CryptoJS.enc.Utf8.parse(word);
	let encrypted = CryptoJS.AES.encrypt(srcs, key, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	});
	return encrypted.toString();
};

let aesDecrypt = function(word) {
	let key = CryptoJS.enc.Utf8.parse(aesKey);
	let decrypt = CryptoJS.AES.decrypt(word, key, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	});
	return CryptoJS.enc.Utf8.stringify(decrypt).toString();
};

let requestLoading = function() {
	if ($('.loading').length === 0) {
		$(document.body).append(`<div class="loading"> <span class="loading-text"></span></div>`);
	}
};

//添加请求拦截器
axios.interceptors.request.use((config) => {
	// console.log(config)
	let showLoading = true;
	if (config.url === `/updatetoken/${localStorage.getItem('systemType')}`) {
		showLoading = false;
	}

	let showLoadingQrytype = ["TypeSetCheck","QmsSetCheck"];
	if (config.url.hasOwnProperty('params')) {
		if (config.url.params.hasOwnProperty('qrytype')) {
			let qrytype = config.url.params.qrytype;
			if (qrytype === 'ErpSysMessage') {
				showLoading = false;
			}else {
				// console.log(qrytype)
				if(showLoadingQrytype.indexOf(qrytype) > -1){
					requestLoading();
				}
			}
		}
	}
	if (showLoading) {
		//请求loading界面。
		//requestLoading();
	}
	//在发送请求之前做某件事
	if (config.url !== `/login/${localStorage.getItem('systemType')}`) {
		config.headers['Authorization'] =
			`${localStorage.getItem('token_type')} ${localStorage.getItem(`access_token_${sessionStorage.getItem('username')}`)}`
	}
	//开发环境：development//生产环境：production
	if (process.env.NODE_ENV === 'development') {
		// if(config.url === 'address_data.json'){
		//   config.baseURL = window.location.origin
		// }
	}else{
		//生产环境加密开发环境不加密
		if (sessionStorage.getItem('encrypt') == '1') {
			if (config.hasOwnProperty('data')) { // post/put/delete
				//config['data'] = aesEncrypt(JSON.stringify(config['data']));
			} else if (config.hasOwnProperty('params') && config.method == 'get') {
				if (config['params'].hasOwnProperty('qrytype') &&
					config['params'].hasOwnProperty('qryfunc') &&
					config['params'].hasOwnProperty('argc')) {
					config['params']['qrytype'] = aesEncrypt(config['params']['qrytype']);
					config['params']['qryfunc'] = aesEncrypt(config['params']['qryfunc']);
					config['params']['argc'] = aesEncrypt(config['params']['argc']);
				}
			}
		}
	}
	// console.log(config);


	return config;
}, (error) => {
	setTimeout(() => {
		$('.loading').remove();
	}, 100)
	//console.log('错误的传参')
	// console.log(error.response)
	// console.log(error.message)
	// console.log(error.config)
	// return Promise.reject(error);
	let err = '';
	if (error.response) {
		err = error.response;
	} else {
		err = {
			response: {
				data: {
					detail: '接口异常！'
				}
			}
		};
	}

	return Promise.reject(err);
});

//返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) => {
	setTimeout(() => {
		$('.loading').remove();
	}, 100)
	//对响应数据做些事
	// console.log(JSON.parse(JSON.stringify(res)))
	if (res.status === 200) {
		if (sessionStorage.getItem('encrypt') == '1') {
			if (typeof res['data'] != 'object') {
				// console.log(res['data'])
				// console.log(aesDecrypt(res['data']))
				// console.log(JSON.parse(aesDecrypt(res['data'])))
				res['data'] = JSON.parse(aesDecrypt(res['data']));
			}
		}	
		
		return Promise.resolve(res);
	} else {
		return Promise.reject(res);
	}
}, (error) => {
	// console.log(error)
	$('.loading').remove();
	// console.log(error.response)
	// console.log(error.message)
	// console.log(error.config)
	if (error.response) {
		return Promise.reject(error);
	} else {
		let err = {
			response: {
				data: {
					detail: '接口异常！'
				}
			}
		};
		return Promise.reject(err);
	}
});

export default {
	$message:Message,
	$fetchPost(url, params, type) {
		return new Promise((resolve, reject) => {
			let postPrams = {
				method: "post",
				url: (url.includes(`/${localStorage.getItem('systemType')}`)) ? url : `${url}/${localStorage.getItem('systemType')}`,
				data: params,
			};
			if (type === 'object') {
				postPrams['params'] = params;
			}
			axios(postPrams)
				.then(response => {
					resolve(response);
				})
				.catch((error) => {
					reject(error)
				})
		})
	},
	$fetchGet(url, params) {
		return new Promise((resolve, reject) => {
			axios({
					method: "get",
					url: (url.includes(`/${localStorage.getItem('systemType')}`)) ? url : `${url}/${localStorage.getItem('systemType')}`,
					params: params,
				})
				.then(response => {
					resolve(response)
				})
				.catch((error) => {
					reject(error)
				})
		})
	},
	$fetchGetSQL( params) {
		let from_str = params.from_str||'';
		let select_str = params.select_str||'';
		let where_str = params.where_str||'';
		let url = `${rootURL}/crm/get_data/pc?from_str=${from_str}&select_str=${select_str}&where_str= 1=1 ${where_str}`;
		return new Promise((resolve, reject) => {
			axios({
				method: "get",
				url: url,
				params: {},
			})
				.then(response => {
					resolve(response)
				})
				.catch((error) => {
					reject(error)
				})
		})
	},
	$fetchGet2(url, params) {
		return new Promise((resolve, reject) => {
			axios({
					method: "get",
					url: `${url}`,
					params: params,
				})
				.then(response => {
					resolve(response)
				})
				.catch((error) => {
					reject(error)
				})
		})
	},
	$fetchPut(url, params) {
		return new Promise((resolve, reject) => {
			let arrUrl = url.split('/');
			let len = arrUrl.length;
			let id = arrUrl[len - 1];
			let currUrlId = "";
			if(id){
				currUrlId = '/'+id;
			}
			let urlLast = arrUrl.slice(0, len - 1).join('/') + '/' + localStorage.getItem('systemType') + currUrlId;
			axios({
					method: "put",
					url: urlLast,
					data: params,
				})
				.then(response => {
					resolve(response);
				})
				.catch((error) => {
					reject(error)
				})
		})
	},
	$fetchDelete(url, params) {
		return new Promise((resolve, reject) => {
			let arrUrl = url.split('/');
			let len = arrUrl.length;
			let id = arrUrl[len - 1];
			let currUrlId = "";
			if(id){
				currUrlId = '/'+id;
			}
			let urlLast = arrUrl.slice(0, len - 1).join('/') + '/' + localStorage.getItem('systemType') + currUrlId;
			axios({
					method: "delete",
					url: urlLast,
					params: params,
				})
				.then(response => {
					resolve(response)
				})
				.catch((error) => {
					reject(error)
				})
		})
	},
	$fetchUpload(url, data) {
		return new Promise(function(resolve, reject) {
			var loadingStatus = 0;
			var duration = 0;
			var timer2 = null;
			if (loadingStatus === 0) {
				if ($('.loading').length === 0) {
					$(document.body).append(`<div class="loading"> <span class="loading-text"></span></div>`);
				}
			}
			var timer2 = setInterval(() => {
				duration++;
				if (loadingStatus == 1) {
					duration = 0;
					$('.loading').remove();
					clearInterval(timer2);
					timer2 = null;
				}
			}, 1000);
			setTimeout(() => {
				$.ajax({
					url: baseURL + url,
					type: 'POST',
					cache: false,
					data: data,
					async: false,
					processData: false,
					contentType: false
				}).done(function(res) {
					loadingStatus = 1;
					resolve(res)
				}).fail(function(res) {
					$('.loading').remove();
					reject(res);
				});
			}, 500)
		});
	},
	$fetchAxios(method, url, params, type) {
		return new Promise((resolve, reject) => {
			let urlLast;
			if (method === 'delete' || method === 'put') {
				let arrUrl = url.split('/');
				let len = arrUrl.length;
				let id = arrUrl[len - 1];
				let currUrlId = "";
				if(id){
					currUrlId = '/'+id;
				}
				urlLast = arrUrl.slice(0, len - 1).join('/') + '/' + localStorage.getItem('systemType')+currUrlId ;

			} else {
				urlLast = `${url}/${localStorage.getItem('systemType')}`;
			}

			let postPrams = {
				method: method,
				url: urlLast,
				data: params,
			};
			if(url === 'importfile'){
				postPrams['timeout'] = 1000*60*10;
			}
			if (type === 'object') {
				postPrams['params'] = params;
				delete postPrams['data']
			} else {
				postPrams['data'] = params;
				delete postPrams['params']
			}
			axios(postPrams)
				.then(response => {
					resolve(response)
				})
				.catch((error) => {
					reject(error)
				})
		})
	},
	$defaultAxios(obj){
		//默认get请求。
		let method = obj.method||'get';
		let url = obj.url||'/get';
		let argc = obj.argc||{};
		let type = obj.dataType||'object';
		let qrytype = obj.qrytype, qryfunc = obj.qryfunc;
		if(method === 'put'){
			url =  `/${obj.url||'update'}/${obj.Id}`;
		}
		return new Promise((resolve, reject) => {
			let params = {qrytype:qrytype,qryfunc:qryfunc,argc:JSON.stringify(argc)};
			// console.log(params)
			this.$fetchAxios(method,url,params,type).then(result=>{
				if(result.data.code == 0){
					resolve(result);
				}else{
					this.$message({type:"error",message:result.data.msg});
				}
			}).catch(error=>{
				this.$message({type:"error",message:error.response.data.detail});
			})
		})
	}
}

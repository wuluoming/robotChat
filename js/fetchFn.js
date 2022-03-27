const baseUrl = 'https://study.duyiedu.com/api';

const fetchFn = async({ url, method = 'GET', params = {} }) => {
    //get请求的参数拼接
    let result = null;
    const expandsObj = {};
    sessionStorage.token &&
        (expandsObj.Authorization = 'Bearer ' + sessionStorage.token);
    if (method === 'GET' && Object.keys(params).length) {
        url +=
            '?' +
            Object.keys(params)
            .map((key) => ''.concat(key, '=', params[key]))
            .join('&');
    }
    try {
        const response = await fetch(baseUrl + url, {
            method,
            headers: { 'Content-Type': 'application/json', ...expandsObj },
            body: method === 'GET' ? null : JSON.stringify(params),
        });
        //获取后端的token的值
        const token = response.headers.get('Authorization');
        //存储token的值
        token && (sessionStorage.token = token);
        result = await response.json();
        if (result.code === 0) {
            //判断后端返回值是否有chatTotal
            if (result.hasOwnProperty('chatTotal')) {
                result.data = { chatTotal: result.chatTotal, data: result.data };
            }
            return result.data;
        } else {
            //权限错误处理
            if (result.status === 401) {
                window.alert('权限token不正确');
                sessionStorage.removeItem('token');
                window.location.replace('/login.html');
                return;
            }
            window.alert(result.msg);
        }
    } catch (err) {
        console.log(err);
    }
};
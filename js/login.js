(() => {
    //页面初始化

    function init() {
        formContainer.addEventListener('submit', formSubmitClick);
    }
    //表单提交事件
    function formSubmitClick(e) {
        //阻止表单默认行为
        e.preventDefault();
        //获取表单数据
        const loginId = userName.value.trim();
        const loginPwd = userPassword.value.trim();

        //表单数据的发送
        if (!loginId || !loginPwd) {
            window.alert('用户或密码不能为空');
        }
        sendData(loginId, loginPwd);
    }

    async function sendData(loginId, loginPwd) {
        const res = await fetchFn({
            url: '/user/login',
            method: 'POST',
            params: { loginId, loginPwd },
        });
        res && window.location.replace(BASE_URL);

        // const result = await fetch('https://study.duyiedu.com/api/user/login', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         loginId,
        //         loginPwd,
        //     }),
        // });
        // const res = await result.json();
        // if (res.code !== 0) {
        //     window.alert(res.msg);
        //     return;
        // }
    }

    init();
})();
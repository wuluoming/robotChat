(() => {
    //初始化
    function init() {
        //账号验证事件
        userName.addEventListener('blur', userNameBlur);
        //表单提交事件
        formContainer.addEventListener('submit', formSubmitClick);
    }
    let isRepeat = false;

    //验证账号
    async function userNameBlur() {
        const loginId = userName.value.trim();
        //如果是空的信息，不做任何事情
        if (!loginId) return;

        const res = await fetchFn({
            url: '/user/exists',
            method: 'GET',
            params: { loginId },
        });
        isRepeat = res;

        // const result = await fetch(
        //     `https://study.duyiedu.com/api/user/exists?loginId=${loginId}`
        // );
        // const res = await result.json();
        // if (res.code !== 0) {
        //     window.alert(res.msg);
        //     return;
        // }
        // isRepeat = res.data;
    }
    //注册事件
    function formSubmitClick(e) {
        //阻止默认行为】
        e.preventDefault();
        const loginId = userName.value.trim();
        const nickname = userNickname.value.trim();
        const loginPwd = userPassword.value.trim();
        const confirmPwd = userConfirmPassword.value.trim();
        //验证表单是否能发送
        if (!checkForm(loginId, nickname, loginPwd, confirmPwd)) return;
        sendData(loginId, nickname, loginPwd);
    }

    async function sendData(loginId, nickname, loginPwd) {
        const res = await fetchFn({
            url: '/user/reg',
            method: 'POST',
            params: { loginId, nickname, loginPwd },
        });
        // const result = await fetch('https://study.duyiedu.com/api/user/reg', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ loginId, nickname, loginPwd }),
        // });
        // const res = await result.json();
        // if (res.code !== 0) {
        //     window.alert(res.msg);
        //     return;
        // }
        res && window.location.replace('/');
    }

    function checkForm(loginId, nickname, loginPwd, confirmPwd) {
        switch (true) {
            case !loginId:
                window.alert('用户名不能为空');
                return;
            case !nickname:
                window.alert('用户昵称不能为空');
                return;
            case !loginPwd:
                window.alert('注册密码不能为空');
                return;
            case !confirmPwd:
                window.alert('确认密码不能为空');
                return;
            case loginPwd !== confirmPwd:
                window.alert('注册密码与确认密码，请重新输入');
                return;
            case isRepeat:
                window.alert('用户名已存在');
                return;
            default:
                return true;
        }
    }

    init();
})();
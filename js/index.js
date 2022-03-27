(async() => {
    //页面初始化
    let page = 0;
    let size = 10;
    let chatTotal = 0;
    let sendType = 'enter';

    function init() {
        getUserInfo();
        initChatList('bottom');
        sendBtn.addEventListener('click', sendClick);
        contentBody.addEventListener('scroll', contentScroll);
        arrow.addEventListener('click', arrowClick);
        document
            .querySelectorAll('.select-item')
            .forEach((node) => node.addEventListener('click', selectClick));
        inputContainer.addEventListener('keyup', inputContainerKeyup);
        closeBtn.addEventListener('click', closeClick);
        clearBtn.addEventListener('click', clearClick);
    }
    //清除事件
    function clearClick() {
        inputContainer.value = '';
    }
    //退出事件
    function closeClick() {
        //清空sessionStorage
        sessionStorage.removeItem('token');
        //界面跳转
        window.location.replace(BASE_URL + 'login.html');
    }
    //键盘输入事件
    function inputContainerKeyup(e) {
        if (
            (e.keyCode === 13 && sendType === 'enter' && !e.ctrlKey) ||
            (e.keyCode === 13 && sendType === 'ctrlEnter' && e.ctrlKey)
        ) {
            sendClick();
        }
    }

    //选择按钮列表事件
    function selectClick() {
        //处理高亮状态
        const itemOn = document.querySelector('.select-item.on');
        itemOn && itemOn.classList.remove('on');
        this.classList.add('on');

        sendType = this.getAttribute('type');
        selectType.style.display = 'none';
    }

    //定义箭头点击事件
    function arrowClick() {
        selectType.style.display = 'block';
    }

    //滚动事件
    function contentScroll() {
        if (this.scrollTop === 0) {
            //判断后端是否还有数据
            if (chatTotal <= (page + 1) * size) {
                return;
            }
            page++;
            initChatList('top');
        }
    }

    //点击发送事件
    async function sendClick() {
        const content = inputContainer.value.trim();
        if (!content) {
            window.alert('发送内容不能为空');
            return;
        }
        renderChatForm([{ from: 'user', content }], 'bottom');
        inputContainer.value = '';
        //发送数据到后端
        const res = await fetchFn({
            url: '/chat',
            method: 'POST',
            params: { content },
        });

        renderChatForm([{ from: 'robot', content: res.content }], 'bottom');
    }

    //定义获取用户信息的方法
    const getUserInfo = async() => {
        const res = await fetchFn({
            url: '/user/profile',
        });
        nickName.innerHTML = res.nickname;
        accountName.innerHTML = res.loginId;
        loginTime.innerHTML = formaDate(res.lastLoginTime);
    };

    //获取历史聊天记录
    async function initChatList(direction) {
        const res = await fetchFn({
            url: '/chat/history',
            params: {
                page,
                size,
            },
        });
        chatTotal = res.chatTotal;
        //渲染聊天界面
        renderChatForm(res.data, direction);
    }
    //定义渲染聊天界面的函数
    function renderChatForm(res, direction) {
        res.reverse();
        if (!res.length) {
            contentBody.innerHTML = `<div class="chat-container robot-container">
                                        <img src="./img/robot.jpg" alt="" />
                                        <div class="chat-txt">
                                            您好！我是腾讯机器人，非常欢迎您的到来，有什么想和我聊聊的吗？
                                        </div>
                                    </div>`;
            return;
        }
        const chatData = res
            .map((item) => {
                return item.from === 'user' ?
                    `<div class="chat-container avatar-container">
                        <img src="./img/avtar.png" alt="" />
                        <div class="chat-txt">${item.content}</div>
                    </div>` :
                    `<div class="chat-container robot-container">
                        <img src="./img/robot.jpg" alt="" />
                        <div class="chat-txt">${item.content}</div>
                    </div>`;
            })
            .join('');
        if (direction === 'bottom') {
            contentBody.innerHTML += chatData;
            const chats = document.querySelectorAll('.chat-container');
            const bottom = chats[chats.length - 1].offsetTop;
            contentBody.scrollTo(0, bottom);
        } else {
            contentBody.innerHTML = chatData + contentBody.innerHTML;
        }
    }

    init();
})();
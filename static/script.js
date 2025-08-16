document.addEventListener('DOMContentLoaded', function () {
    // 获取当前文章ID
    var currentPostId = getCurrentPostId();

    // 初始化隐藏内容
    initSecretContent();

    // 添加评论提交事件监听
    addCommentSubmitListener();

    /**
     * 获取当前文章ID（更稳健）
     */
    function getCurrentPostId() {
        // 1) 从隐藏容器 data-cid 获取（插件已输出）
        var secretWithCid = document.querySelector('.secret-content[data-cid]');
        if (secretWithCid) {
            var cid = secretWithCid.getAttribute('data-cid');
            if (cid) return cid;
        }

        // 2) 从URL中获取 /archives/123 或 /archives/123.html 或 /archives/123/
        var path = location.pathname;
        var match = path.match(/\/(?:index\.php\/)?archives\/(\d+)(?:\.html|\/)?/);
        if (match && match[1]) {
            return match[1];
        }

        // 3) 从 canonical 链接中获取
        var canonical = document.querySelector('link[rel="canonical"]');
        if (canonical && canonical.href) {
            match = canonical.href.match(/\/(?:index\.php\/)?archives\/(\d+)(?:\.html|\/)?/);
            if (match && match[1]) {
                return match[1];
            }
        }

        // 4) 从文章内容区域获取
        var articleElement = document.querySelector('article[data-cid], [data-cid]');
        if (articleElement && articleElement.getAttribute('data-cid')) {
            return articleElement.getAttribute('data-cid');
        }

        // 5) 从评论表单 action 或隐藏域中解析 cid
        var commentForm = document.getElementById('comment-form') || document.querySelector('form[action*="comments"], form[action*="feedback"]');
        if (commentForm) {
            // 5.1 隐藏域 cid
            var cidInput = commentForm.querySelector('input[name="cid"], input[name="cid[]"]');
            if (cidInput && cidInput.value) return cidInput.value;
            // 5.2 从 action 中解析 ?cid=123
            try {
                var action = commentForm.getAttribute('action') || '';
                if (action) {
                    var url = new URL(action, location.origin);
                    var cidParam = url.searchParams.get('cid');
                    if (cidParam) return cidParam;
                }
            } catch (e) { }
        }

        // 6) 兜底：从页面任何链接包含 /archives/123 的位置推断
        var a = document.querySelector('a[href*="/archives/"]');
        if (a && a.href) {
            match = a.href.match(/\/(?:index\.php\/)?archives\/(\d+)(?:\.html|\/)?/);
            if (match && match[1]) {
                return match[1];
            }
        }

        return null;
    }

    /**
     * 初始化隐藏内容
     */
    function initSecretContent() {
        var secretContents = document.querySelectorAll('.secret-content:not(.revealed)');
        if (secretContents.length === 0) return;

        var hasCommented = checkCommentStatus();

        // 如果本地检测到已评论，尝试向服务器验证并显示内容
        if (hasCommented) {
            revealAllSecretContents();
        } else {
            // 未评论用户添加点击提示
            secretContents.forEach(function (content) {
                content.addEventListener('click', function () {
                    alert('请评论后查看隐藏内容');
                });
            });
        }
    }

    /**
     * 显示所有隐藏内容（带服务器校验）
     */
    function revealAllSecretContents() {
        var secretContents = document.querySelectorAll('.secret-content:not(.revealed)');

        secretContents.forEach(function (content) {
            var hiddenContent = content.querySelector('.hidden-content');
            if (!hiddenContent) return; // 非单篇文章或无隐藏块

            var originalContent = hiddenContent.getAttribute('data-content');
            if (!originalContent) return;

            var xhr = new XMLHttpRequest();
            xhr.open('POST', window.location.href, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        // 直接使用服务器返回的解析后内容，不再检查特定HTML结构
                        if (xhr.responseText && xhr.responseText.trim() !== '您需要评论后才能查看此内容') {
                            content.classList.add('revealed');
                            content.innerHTML = xhr.responseText;
                        }
                    }
                }
            };
            xhr.send('do=parseSecret&content=' + encodeURIComponent(originalContent));
        });
    }

    /**
     * 添加评论提交事件监听
     */
    function addCommentSubmitListener() {
        var forms = [];
        var mainForm = document.getElementById('comment-form');
        if (mainForm) forms.push(mainForm);
        document.querySelectorAll('form[action*="comments"], form[action*="feedback"]').forEach(function (f) { forms.push(f); });

        if (forms.length === 0) return;

        forms.forEach(function (commentForm) {
            commentForm.addEventListener('submit', function () {
                setCommentedFlag();
            });
        });
    }

    /**
     * 设置评论状态标记，只对当前文章有效
     */
    function setCommentedFlag() {
        if (!currentPostId) return;

        try {
            localStorage.setItem('xuansecret_commented_' + currentPostId, 'true');
        } catch (e) { }

        try {
            var expire = new Date();
            expire.setTime(expire.getTime() + 30 * 24 * 60 * 60 * 1000);
            document.cookie = 'xuansecret_commented_' + currentPostId + '=true; expires=' + expire.toUTCString() + '; path=/';
        } catch (e) { }
    }

    /**
     * 检查是否已经评论过当前文章
     */
    function checkCommentStatus() {
        if (!currentPostId) return false;

        // 检查 Cookie（新旧两种）
        var commentedCookies = document.cookie.split(';').some(function (item) {
            var trimmed = item.trim();
            var hasXuanSecret = trimmed.indexOf('xuansecret_commented_' + currentPostId + '=') === 0;
            var hasTypecho = trimmed.indexOf('typecho_commented_' + currentPostId + '=') === 0;
            return hasXuanSecret || hasTypecho;
        });

        // 检查 localStorage（新旧两种）
        var hasLocalStorage = false;
        try {
            var xuanSecretLS = localStorage.getItem('xuansecret_commented_' + currentPostId);
            var typechoLS = localStorage.getItem('typecho_commented_' + currentPostId);
            hasLocalStorage = (xuanSecretLS === 'true') || (typechoLS === 'true');
        } catch (e) {
            console.log('XuanSecret Debug: localStorage access failed:', e);
        }

        var result = commentedCookies || hasLocalStorage;
        return result;
    }
}); 
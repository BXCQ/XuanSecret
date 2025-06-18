document.addEventListener('DOMContentLoaded', function () {
    // 获取所有隐藏内容容器
    const secretContents = document.querySelectorAll('.secret-content');
    if (!secretContents.length) return;

    // 调试信息
    console.log('XuanSecret: 找到', secretContents.length, '个隐藏内容');
    
    // 检查是否已经评论过
    function checkCommentStatus() {
        // 多种方式检测评论状态
        const commentedCookies = document.cookie.split(';').some(item => {
            const trimmed = item.trim();
            return trimmed.indexOf('typecho_comment_author=') === 0 || 
                   trimmed.indexOf('typecho_user_author=') === 0 ||
                   trimmed.indexOf('typecho_commented_') === 0;
        });
        
        const hasLocalStorage = localStorage.getItem('typecho_commented') === 'true';
        const hasCommentForm = document.getElementById('comment-form');
        const hasCommented = commentedCookies || hasLocalStorage;
        
        // 调试信息
        console.log('XuanSecret: 评论状态检查', {
            commentedCookies,
            hasLocalStorage,
            hasCommentForm,
            hasCommented,
            cookies: document.cookie
        });
        
        return hasCommented;
    }
    
    // 直接从服务器获取内容
    function fetchSecretContent() {
        secretContents.forEach(content => {
            if (content.classList.contains('revealed')) return;
            
            const hiddenContent = content.querySelector('.hidden-content');
            if (!hiddenContent) return;
            
            const originalContent = hiddenContent.getAttribute('data-content');
            if (!originalContent) return;
            
            // 创建一个表单并提交
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = window.location.href;
            form.style.display = 'none';
            
            const doInput = document.createElement('input');
            doInput.name = 'do';
            doInput.value = 'parseSecret';
            form.appendChild(doInput);
            
            const contentInput = document.createElement('input');
            contentInput.name = 'content';
            contentInput.value = originalContent;
            form.appendChild(contentInput);
            
            const xhr = new XMLHttpRequest();
            xhr.open('POST', window.location.href, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        try {
                            content.innerHTML = xhr.responseText;
                            content.classList.add('revealed');
                            console.log('XuanSecret: 内容已显示');
                        } catch (e) {
                            console.error('XuanSecret: 处理响应时出错', e);
                            // 降级处理：直接显示原始内容
                            try {
                                content.innerHTML = '<div class="secret-content revealed">' + 
                                                   decodeURIComponent(originalContent) + 
                                                   '</div>';
                            } catch (e2) {
                                console.error('XuanSecret: 降级处理失败', e2);
                            }
                        }
                    } else {
                        console.error('XuanSecret: 请求失败', xhr.status);
                        // 尝试直接显示内容
                        try {
                            content.innerHTML = '<div class="secret-content revealed">' + 
                                               '<pre>' + originalContent + '</pre>' + 
                                               '</div>';
                            content.classList.add('revealed');
                        } catch (e) {
                            console.error('XuanSecret: 直接显示内容失败', e);
                        }
                    }
                }
            };
            
            xhr.send('do=parseSecret&content=' + encodeURIComponent(originalContent));
        });
    }
    
    // 强制显示所有隐藏内容（用于调试）
    function forceShowAllContent() {
        secretContents.forEach(content => {
            if (content.classList.contains('revealed')) return;
            
            const hiddenContent = content.querySelector('.hidden-content');
            if (!hiddenContent) return;
            
            const originalContent = hiddenContent.getAttribute('data-content');
            if (!originalContent) return;
            
            try {
                // 直接显示内容，不经过服务器解析
                content.innerHTML = '<div class="secret-content-inner">' + originalContent + '</div>';
                content.classList.add('revealed');
                console.log('XuanSecret: 内容已强制显示');
            } catch (e) {
                console.error('XuanSecret: 强制显示内容失败', e);
            }
        });
    }
    
    // 设置评论状态标记
    function setCommentedFlag() {
        localStorage.setItem('typecho_commented', 'true');
        
        // 设置一个通用的cookie
        const expire = new Date();
        expire.setTime(expire.getTime() + 30 * 24 * 60 * 60 * 1000); // 30天
        document.cookie = 'typecho_commented=true; expires=' + expire.toUTCString() + '; path=/';
        
        console.log('XuanSecret: 已设置评论标记');
    }
    
    // 监听评论表单提交
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', function () {
            console.log('XuanSecret: 评论表单已提交');
            setCommentedFlag();
            
            // 延迟执行，等待评论提交完成
            setTimeout(function () {
                fetchSecretContent();
                
                // 如果内容仍未显示，尝试刷新页面
                setTimeout(function () {
                    if (!document.querySelector('.secret-content.revealed')) {
                        console.log('XuanSecret: 尝试刷新页面');
                        window.location.reload();
                    }
                }, 2000);
            }, 1000);
        });
    }
    
    // 检查评论状态
    if (checkCommentStatus()) {
        console.log('XuanSecret: 检测到已评论，尝试显示内容');
        fetchSecretContent();
    }
    
    // 添加一个隐藏的调试按钮（按Alt+S触发）
    document.addEventListener('keydown', function (e) {
        if (e.altKey && e.key === 's') {
            console.log('XuanSecret: 触发调试功能');
            forceShowAllContent();
        }
    });
    
    // 如果URL中包含特定参数，强制显示内容（用于调试）
    if (window.location.search.indexOf('xuansecret_debug=1') !== -1) {
        console.log('XuanSecret: 检测到调试参数，强制显示内容');
        forceShowAllContent();
    }
}); 
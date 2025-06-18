document.addEventListener('DOMContentLoaded', function () {
    // 获取所有隐藏内容容器
    const secretContents = document.querySelectorAll('.secret-content');
    if (!secretContents.length) return;

    // 获取当前文章ID
    let currentPostId = '';
    try {
        // 尝试从URL中获取文章ID
        const urlPath = window.location.pathname;
        const matches = urlPath.match(/\/archives\/(\d+)/);
        if (matches && matches[1]) {
            currentPostId = matches[1];
        }
        
        // 如果URL中没有，尝试从其他元素获取
        if (!currentPostId) {
            const articleElement = document.querySelector('article[data-cid]');
            if (articleElement) {
                currentPostId = articleElement.getAttribute('data-cid');
            }
        }
        
        // 最后尝试从评论表单获取
        if (!currentPostId) {
            const commentForm = document.getElementById('comment-form');
            if (commentForm) {
                const cidInput = commentForm.querySelector('input[name="parent"]');
                if (cidInput) {
                    currentPostId = cidInput.value;
                }
            }
        }
        
        console.log('XuanSecret: 当前文章ID:', currentPostId);
    } catch (e) {
        console.error('XuanSecret: 获取文章ID失败', e);
    }

    // 调试信息
    console.log('XuanSecret: 找到', secretContents.length, '个隐藏内容');
    
    // 检查是否已经评论过当前文章
    function checkCommentStatus() {
        // 检查当前文章的评论状态
        const commentedCookies = document.cookie.split(';').some(item => {
            const trimmed = item.trim();
            // 检查新旧两种Cookie名称
            return (currentPostId && trimmed.indexOf('xuansecret_commented_' + currentPostId + '=') === 0) ||
                   (currentPostId && trimmed.indexOf('typecho_commented_' + currentPostId + '=') === 0);
        });
        
        // 检查localStorage中的文章特定标记
        const hasLocalStorage = (currentPostId && localStorage.getItem('xuansecret_commented_' + currentPostId) === 'true') ||
                               (currentPostId && localStorage.getItem('typecho_commented_' + currentPostId) === 'true');
        
        const hasCommented = commentedCookies || hasLocalStorage;
        
        // 调试信息
        console.log('XuanSecret: 评论状态检查', {
            currentPostId,
            commentedCookies,
            hasLocalStorage,
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
    
    // 设置评论状态标记，只对当前文章有效
    function setCommentedFlag() {
        if (!currentPostId) return;
        
        // 设置localStorage标记，只对当前文章有效
        localStorage.setItem('xuansecret_commented_' + currentPostId, 'true');
        
        // 设置Cookie标记
        try {
            const expire = new Date();
            expire.setTime(expire.getTime() + 30 * 24 * 60 * 60 * 1000); // 30天
            document.cookie = 'xuansecret_commented_' + currentPostId + '=true; expires=' + expire.toUTCString() + '; path=/';
        } catch(e) {
            console.error('XuanSecret: 设置Cookie失败', e);
        }
        
        console.log('XuanSecret: 已设置评论标记，文章ID:', currentPostId);
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
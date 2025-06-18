document.addEventListener('DOMContentLoaded', function() {
    // 获取当前文章ID
    var currentPostId = getCurrentPostId();
    
    // 初始化隐藏内容
    initSecretContent();
    
    // 添加评论提交事件监听
    addCommentSubmitListener();
    
    /**
     * 获取当前文章ID
     */
    function getCurrentPostId() {
        // 从URL中获取
        var match = location.pathname.match(/\/archives\/(\d+)\.html/);
        if (match && match[1]) {
            return match[1];
        }
        
        // 从canonical链接中获取
        var canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            match = canonical.href.match(/\/archives\/(\d+)\.html/);
            if (match && match[1]) {
                return match[1];
            }
        }
        
        // 从文章内容区域获取
        var articleElement = document.querySelector('article[data-cid]');
        if (articleElement && articleElement.getAttribute('data-cid')) {
            return articleElement.getAttribute('data-cid');
        }
        
        // 从评论表单获取
        var commentForm = document.getElementById('comment-form');
        if (commentForm && commentForm.querySelector('input[name="parent"]')) {
            return commentForm.querySelector('input[name="parent"]').value;
        }
        
        return null;
    }
    
    /**
     * 初始化隐藏内容
     */
    function initSecretContent() {
        // 查找所有隐藏内容
        var secretContents = document.querySelectorAll('.secret-content:not(.revealed)');
        if (secretContents.length === 0) return;
        
        // 检查评论状态
        var hasCommented = checkCommentStatus();
        
        // 如果已评论，显示所有隐藏内容
        if (hasCommented) {
            revealAllSecretContents();
        } else {
            // 否则添加点击事件监听
            secretContents.forEach(function(content) {
                content.addEventListener('click', function() {
                    alert('请评论后查看隐藏内容');
                });
            });
        }
    }
    
    /**
     * 显示所有隐藏内容
     */
    function revealAllSecretContents() {
        var secretContents = document.querySelectorAll('.secret-content:not(.revealed)');
        
        secretContents.forEach(function(content) {
            var hiddenContent = content.querySelector('.hidden-content');
            if (!hiddenContent) return;
            
            var originalContent = hiddenContent.getAttribute('data-content');
            if (!originalContent) return;
            
            // 添加已显示标记
            content.classList.add('revealed');
            
            // 使用Ajax获取解析后的内容
            var xhr = new XMLHttpRequest();
            xhr.open('POST', window.location.href, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        content.innerHTML = xhr.responseText;
                    } else {
                        // 降级处理：直接显示原始内容
                        content.innerHTML = '<div class="secret-content-inner"><pre>' + originalContent + '</pre></div>';
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
        var commentForm = document.getElementById('comment-form');
        if (!commentForm) return;
        
        commentForm.addEventListener('submit', function() {
            // 设置评论状态
            setCommentedFlag();
        });
    }
    
    /**
     * 设置评论状态标记，只对当前文章有效
     */
    function setCommentedFlag() {
        if (!currentPostId) return;
        
        // 设置localStorage标记，只对当前文章有效
        localStorage.setItem('xuansecret_commented_' + currentPostId, 'true');
        
        // 设置Cookie标记
        try {
            const expire = new Date();
            expire.setTime(expire.getTime() + 30 * 24 * 60 * 60 * 1000); // 30天
            document.cookie = 'xuansecret_commented_' + currentPostId + '=true; expires=' + expire.toUTCString() + '; path=/';
        } catch(e) {}
    }
    
    /**
     * 检查是否已经评论过当前文章
     */
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
        
        return hasCommented;
    }
}); 
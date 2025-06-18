document.addEventListener('DOMContentLoaded', function() {
    const secretContents = document.querySelectorAll('.secret-content');
    
    function revealContent(content) {
        try {
            const hiddenContent = content.querySelector('.hidden-content');
            if (hiddenContent) {
                // 获取原始markdown内容
                const originalMarkdown = hiddenContent.getAttribute('data-content');
                if (originalMarkdown) {
                    // 使用Ajax请求服务器解析Markdown
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', window.location.href, true);
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            try {
                                // 将解析后的内容放入容器
                                content.innerHTML = xhr.responseText;
                                content.classList.add('revealed');
                            } catch (e) {
                                console.error('Error processing response:', e);
                                // 降级处理：直接显示原始内容
                                content.textContent = decodeURIComponent(originalMarkdown);
                                content.classList.add('revealed');
                            }
                        }
                    };
                    xhr.send('do=parseSecret&content=' + encodeURIComponent(originalMarkdown));
                } else {
                    console.error('No content data found');
                }
            }
        } catch (error) {
            console.error('Error revealing content:', error);
        }
    }
    
    function checkCommentStatus() {
        // 检查是否已评论用户
        const commentedFlag = document.cookie.indexOf('typecho_comment_author') !== -1;
        
        if (commentedFlag) {
            secretContents.forEach(content => {
                // 如果内容还没有被显示，则显示它
                if (!content.classList.contains('revealed')) {
                    revealContent(content);
                }
            });
        }
    }

    // 初始检查
    checkCommentStatus();

    // 监听评论表单提交
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', function() {
            // 延迟检查，等待评论提交完成
            setTimeout(checkCommentStatus, 2000);
        });
    }
}); 
document.addEventListener('DOMContentLoaded', function() {
    const secretContents = document.querySelectorAll('.secret-content');
    
    function revealContent(content) {
        try {
            const hiddenContent = content.querySelector('.hidden-content');
            if (hiddenContent) {
                // 直接设置内容，不使用动画
                const parser = new DOMParser();
                const doc = parser.parseFromString(hiddenContent.innerHTML, 'text/html');
                content.innerHTML = doc.body.innerHTML;
                content.classList.add('revealed');
            }
        } catch (error) {
            console.error('Error revealing content:', error);
        }
    }
    
    function checkCommentStatus() {
        // 检查是否已登录用户
        if (document.cookie.indexOf('typecho_user_author') !== -1) {
            secretContents.forEach(content => {
                // 如果内容还没有被显示，则显示它
                if (!content.classList.contains('revealed')) {
                    const hiddenContent = content.querySelector('.hidden-content');
                    if (hiddenContent) {
                        revealContent(content);
                    }
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
            setTimeout(checkCommentStatus, 2000);
        });
    }
}); 
<?php
if (!defined('__TYPECHO_ROOT_DIR__')) exit;

/**
 * 此插件为文章内容隐藏插件，支持隐藏文字、图片、附件等内容，访客评论后即可查看
 * 
 * @package XuanSecret
 * @author 璇
 * @version 1.2.10
 * @link https://blog.ybyq.wang/
 */
class XuanSecret_Plugin implements Typecho_Plugin_Interface
{
    /**
     * 激活插件方法
     */
    public static function activate()
    {
        Typecho_Plugin::factory('Widget_Abstract_Contents')->contentEx = array('XuanSecret_Plugin', 'parse');
        Typecho_Plugin::factory('Widget_Archive')->header = array('XuanSecret_Plugin', 'header');
        Typecho_Plugin::factory('admin/write-post.php')->option = array('XuanSecret_Plugin', 'render');
        Typecho_Plugin::factory('admin/write-page.php')->option = array('XuanSecret_Plugin', 'render');
        Typecho_Plugin::factory('Widget_Archive')->beforeRender = array('XuanSecret_Plugin', 'handleAjax');
        Typecho_Plugin::factory('Widget_Feedback')->finishComment = array('XuanSecret_Plugin', 'afterComment');
        return _t('插件启用成功');
    }

    /**
     * 禁用插件方法
     */
    public static function deactivate()
    {
        return _t('插件禁用成功');
    }

    /**
     * 插件配置面板
     */
    public static function config(Typecho_Widget_Helper_Form $form)
    {
        $tipText = new Typecho_Widget_Helper_Form_Element_Text(
            'tipText',
            NULL,
            '此内容需要评论后才能查看哦 (*^▽^*)',
            _t('提示文本'),
            _t('当内容被隐藏时显示的提示文本')
        );
        $form->addInput($tipText);

        $commentCount = new Typecho_Widget_Helper_Form_Element_Text(
            'commentCount',
            NULL,
            '1',
            _t('需要评论次数'),
            _t('访客需要评论多少次才能查看隐藏内容')
        );
        $form->addInput($commentCount->addRule('isInteger', _t('必须是整数')));

        $enablePreview = new Typecho_Widget_Helper_Form_Element_Radio(
            'enablePreview',
            array('0' => '禁用', '1' => '启用'),
            '0',
            _t('启用内容预览'),
            _t('是否显示隐藏内容的一小部分预览')
        );
        $form->addInput($enablePreview);

        $guestComment = new Typecho_Widget_Helper_Form_Element_Radio(
            'guestComment',
            array('0' => '需要登录', '1' => '允许游客评论'),
            '1',
            _t('游客评论设置'),
            _t('是否允许游客无需登录即可评论')
        );
        $form->addInput($guestComment);
    }

    /**
     * 个人用户的配置面板
     */
    public static function personalConfig(Typecho_Widget_Helper_Form $form) {}

    /**
     * 添加头部CSS和JS
     */
    public static function header()
    {
        $cssUrl = Helper::options()->pluginUrl . '/XuanSecret/static/style.css';
        $jsUrl = Helper::options()->pluginUrl . '/XuanSecret/static/script.js';
        echo '<link rel="stylesheet" href="' . $cssUrl . '">';
        echo '<script src="' . $jsUrl . '"></script>';
    }

    /**
     * 评论提交后的处理
     */
    public static function afterComment($comment)
    {
        // 设置Cookie标记评论状态，只对当前文章有效
        $expire = time() + 30 * 24 * 3600; // 30天有效期

        // 使用更简单的Cookie名称
        $cookieName = 'xuansecret_commented_' . $comment->cid;

        // 设置Cookie，确保路径正确
        setcookie($cookieName, 'true', $expire, '/', '', false, false);

        // 直接在页面上输出JavaScript来设置localStorage
        echo '<script>
            try {
                localStorage.setItem("xuansecret_commented_' . $comment->cid . '", "true");
            } catch(e) {}
        </script>';

        return $comment;
    }

    /**
     * 处理Ajax请求，解析Markdown内容
     */
    public static function handleAjax($archive)
    {
        if (isset($_POST['do']) && $_POST['do'] == 'parseSecret' && isset($_POST['content'])) {
            // 验证是否已评论或者是管理员
            $user = Typecho_Widget::widget('Widget_User');
            $hasCommented = self::checkUserCommented($archive) ||
                ($user->hasLogin() && ($user->group == 'administrator' || $archive->authorId == $user->uid));

            if ($hasCommented) {
                $content = $_POST['content'];
                try {
                    // 智能判断内容类型并输出
                    if (strip_tags($content) !== $content) {
                        // 内容包含HTML标签，直接输出
                        echo $content;
                    } else {
                        // 内容是纯文本/Markdown，进行解析
                        $parsedContent = $archive->markdown($content);
                        echo $parsedContent;
                    }
                } catch (Exception $e) {
                    // 降级处理：直接返回原始内容，但保持格式
                    echo strip_tags($content) !== $content ? $content : nl2br(htmlspecialchars($content));
                }
                exit;
            } else {
                // 未评论用户不能解析内容
                echo '您需要评论后才能查看此内容';
                exit;
            }
        }
    }

    /**
     * 检查用户是否已评论
     */
    private static function checkUserCommented($widget)
    {
        try {
            // 调试模式：允许通过URL参数强制显示未评论状态
            if (isset($_GET['xuansecret_test_uncommented']) && $_GET['xuansecret_test_uncommented'] === '1') {
                return false;
            }

            $options = Helper::options()->plugin('XuanSecret');
            $db = Typecho_Db::get();
            $user = Typecho_Widget::widget('Widget_User');

            // 检查是否是管理员或作者本人
            if ($user->hasLogin() && ($user->group == 'administrator' || $widget->authorId == $user->uid)) {
                return true;
            }

            // 检查Cookie中的文章特定标记 - 同时检查新旧两种Cookie名称
            if (isset($_COOKIE['xuansecret_commented_' . $widget->cid]) && $_COOKIE['xuansecret_commented_' . $widget->cid] === 'true') {
                return true;
            }

            if (isset($_COOKIE['typecho_commented_' . $widget->cid]) && $_COOKIE['typecho_commented_' . $widget->cid] === 'true') {
                return true;
            }

            // 检查评论数据库
            if ($user->hasLogin()) {
                // 已登录用户
                $commentCount = $db->fetchObject($db->select(array('COUNT(coid)' => 'count'))
                    ->from('table.comments')
                    ->where('cid = ?', $widget->cid)
                    ->where('status = ? AND authorId = ?', 'approved', $user->uid))->count;

                $hasCommented = $commentCount >= intval($options->commentCount);
                return $hasCommented;
            } else {
                // 未登录用户
                $ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '';
                $commentCount = $db->fetchObject($db->select(array('COUNT(coid)' => 'count'))
                    ->from('table.comments')
                    ->where('cid = ?', $widget->cid)
                    ->where('status = ? AND ip = ?', 'approved', $ip))->count;

                $hasCommented = $commentCount >= intval($options->commentCount);
                return $hasCommented;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * 解析内容
     */
    public static function parse($content, $widget, $lastResult)
    {
        try {
            $content = empty($lastResult) ? $content : $lastResult;
            $options = Helper::options()->plugin('XuanSecret');

            // 先将正常显示的[secret]文本替换为特殊标记
            $content = preg_replace('/(?<!\[)secret(?!\])/i', '{{NORMAL_SECRET_TEXT}}', $content);

            // 现在处理的是已解析的HTML内容，需要查找HTML中的[secret]标签
            // 这些标签可能在<p>标签或其他HTML元素中
            $pattern = '/\[secret\]([\s\S]*?)\[\/secret\]/';

            // 获取当前用户对象
            $user = Typecho_Widget::widget('Widget_User');

            // 检查是否是管理员或作者本人
            $isAdminOrAuthor = $user->hasLogin() && ($user->group == 'administrator' || $widget->authorId == $user->uid);

            // 检查评论状态
            $hasCommented = $isAdminOrAuthor || self::checkUserCommented($widget);

            // 根据用户状态处理内容
            if ($widget->is('single')) {
                if ($hasCommented) {
                    // 评论过的用户：直接移除[secret]标签，保留内部的HTML内容
                    $content = preg_replace_callback(
                        $pattern,
                        function ($matches) {
                            // 直接返回HTML内容，不再进行任何解析
                            return trim($matches[1]);
                        },
                        $content
                    );
                } else {
                    // 未评论过的用户：替换为提示框，并存储原始内容用于Ajax
                    $content = preg_replace_callback(
                        $pattern,
                        function ($matches) use ($options, $widget, $user) {
                            // 存储原始内容（这时候可能是HTML，也可能是Markdown）
                            $originalContent = trim($matches[1]);
                            
                            $preview = '';
                            if ($options->enablePreview == '1') {
                                // 如果内容看起来像HTML（有标签），直接取纯文本
                                // 否则当作Markdown解析
                                if (strip_tags($originalContent) !== $originalContent) {
                                    // 已经是HTML，直接提取文本
                                    $previewText = mb_substr(strip_tags($originalContent), 0, 30);
                                } else {
                                    // 看起来是Markdown，解析后提取文本
                                    $parsedContent = $widget->markdown($originalContent);
                                    $previewText = mb_substr(strip_tags($parsedContent), 0, 30);
                                }
                                $preview = '<div class="secret-preview">' . $previewText . '...</div>';
                            }

                            // 根据配置决定是否显示登录链接
                            $loginTip = '';
                            if (!$user->hasLogin() && $options->guestComment == '0') {
                                $loginTip = ' <a href="' . Helper::options()->loginUrl . '">点击登录</a>';
                            }
                            
                            return '<div class="secret-content" data-cid="' . $widget->cid . '">
                                    <div class="secret-tip">' . $options->tipText . $loginTip . '</div>
                                    ' . $preview . '
                                    <div class="hidden-content" style="display:none" data-content="' . htmlspecialchars($originalContent, ENT_QUOTES) . '"></div>
                                </div>';
                        },
                        $content
                    );
                }
            } else {
                // 非单篇文章页面，将隐藏内容替换为提示
                $content = preg_replace_callback(
                    $pattern,
                    function ($matches) use ($options) {
                        return '<div class="secret-content"><div class="secret-tip">' . $options->tipText . '</div></div>';
                    },
                    $content
                );
            }

            // 恢复正常显示的[secret]文本
            $content = str_replace('{{NORMAL_SECRET_TEXT}}', 'secret', $content);

            // 处理可能存在的转义标签
            $content = str_replace('\[secret]', '[secret]', $content);
            $content = str_replace('\[/secret]', '[/secret]', $content);

            return $content;
        } catch (Exception $e) {
            return $content;
        }
    }

    /**
     * 添加侧边栏内容
     */
    public static function render()
    {
?>
        <section class="typecho-post-option" id="wuwei-secret-buttons">
            <label class="typecho-label">快捷插入</label>
            <p>
                <button type="button" id="wmd-secret-button" class="btn primary">插入隐藏内容</button>
            </p>
        </section>
        <script>
            // 使用原生 JavaScript
            document.addEventListener('DOMContentLoaded', function() {
                // 确保按钮显示在正确的位置
                var secretButtons = document.getElementById('wuwei-secret-buttons');
                var customField = document.getElementById('custom-field');
                if (customField) {
                    customField.parentNode.insertBefore(secretButtons, customField);
                }

                // 隐藏内容按钮点击事件
                document.getElementById('wmd-secret-button').addEventListener('click', function() {
                    var textarea = document.getElementById('text');
                    if (!textarea) return;

                    var start = textarea.selectionStart;
                    var end = textarea.selectionEnd;
                    var text = textarea.value;

                    var selectedText = text.substring(start, end);
                    var insertText = selectedText || '请输入要隐藏的内容';
                    var newText = '[secret]' + insertText + '[/secret]';

                    // 插入文本
                    textarea.value = text.substring(0, start) + newText + text.substring(end);

                    // 如果是默认文本，选中它
                    if (!selectedText) {
                        textarea.selectionStart = start + 8;
                        textarea.selectionEnd = start + 8 + insertText.length;
                    }

                    // 触发变更事件
                    textarea.focus();
                    var event = new Event('input', {
                        'bubbles': true,
                        'cancelable': true
                    });
                    textarea.dispatchEvent(event);
                });
            });
        </script>
<?php
    }
}

一个 Typecho 文章内容隐藏插件，支持隐藏文字、图片、附件等内容，访客评论后即可查看。

## 功能特点

- 支持隐藏任意内容（文字、图片、附件、链接等）
- 管理员和文章作者可直接查看隐藏内容
- 评论过的用户永久可见该文章的隐藏内容
- **支持游客无需登录**即可评论
- 自定义提示文本
- 支持设置所需评论次数
- 支持内容预览功能
- 响应式设计
- 编辑器快捷插入按钮
![][1]



## 使用方法
1. 下载插件，将插件上传到 `/usr/plugins` 目录下
2. 后台启用插件，注意文件名为`XuanSecret`
3. 在文章编辑时可以：
   - 使用编辑器下面的"插入隐藏内容"按钮
     ![][3]
   - 或手动输入短代码：
     ![][4]
### 使用示例
这是普通文本：
[secret]
这是隐藏的文字内容
[/secret]

这是一张图片：
[secret]
这是一个隐藏的图片：![][5]
[/secret]

这是一个超链接：
[secret]
[https://blog.ybyq.wang/archives/525.html][6]
[/secret]

## 最新更新

### 版本 1.2.5
1. **关键修复**
   - 改进Cookie设置逻辑，解决Cookie不生效的问题
   - 使用更简单的Cookie名称，提高兼容性
   - 同时支持新旧两种Cookie名称，确保平滑升级
   - 添加直接JavaScript设置localStorage的功能

### 版本 1.2.4
1. **重要修复**
   - 修复评论状态跨文章保持的问题，确保评论状态只对当前文章有效
   - 改进文章ID检测逻辑，支持多种方式获取当前文章ID
   - 移除全局Cookie标记，使用文章特定的Cookie和localStorage标记

### 版本 1.2.3
1. **重大修复**
   - 彻底重写JavaScript代码，解决游客评论后内容不显示的问题
   - 增强Cookie检测逻辑，支持多种方式检测评论状态
   - 添加调试模式，帮助排查问题

2. **功能改进**
   - 添加Alt+S快捷键和URL参数调试功能
   - 增强错误处理和降级显示机制
   - 优化非文章页面的内容显示

3. **兼容性增强**
   - 提高与Typecho 1.2.1和PHP 7.4+的兼容性
   - 修复可能的PHP错误和警告
   - 改进服务器端Markdown解析过程

## 配置说明

### 基础配置
1. **提示文本**
   - 设置隐藏内容的提示语
   - 默认：此内容需要评论后才能查看哦 (*^▽^*)

2. **评论要求**
   - 设置查看内容所需的评论次数
   - 默认：1次评论

3. **游客评论设置**
   - 允许游客评论：游客无需登录即可评论
   - 需要登录：游客必须登录后才能评论
   - 默认：允许游客评论

### 高级配置
1. **内容预览**
   - 开启后显示隐藏内容的前30个字符
   - 帮助用户判断内容价值

2. **调试模式**
   - 开启后显示更多调试信息，并记录日志
   - 可使用Alt+S快捷键或在URL中添加`xuansecret_debug=1`参数强制显示内容


## 设计理念

新版本的设计遵循以下原则：

- **简洁性**：去除复杂的选择，专注于核心功能
- **可用性**：清晰的视觉层次和良好的可读性
- **现代感**：使用现代CSS特性，如渐变和阴影
- **响应式**：在所有设备上都有良好的显示效果

## 技术支持与问题排查

如果插件无法正常工作，请检查：

1. **文件结构是否正确**
   - 确保插件放在 `/usr/plugins/XuanSecret/` 目录下
   - 目录结构应为：
     ```
     /usr/plugins/XuanSecret/
        ├── Plugin.php
        └── static/
            ├── style.css
            └── script.js
     ```

2. **权限设置**
   - 确保插件目录及文件有正确的读写权限

3. **浏览器兼容性**
   - 推荐使用现代浏览器访问，如Chrome、Firefox、Edge等
   - 如遇JS错误，请尝试清除浏览器缓存

4. **与其他插件冲突**
   - 如果安装了多个内容处理插件，可能会相互冲突
   - 尝试暂时禁用其他插件进行测试

5. **评论后内容仍然隐藏**
   - 确保浏览器允许Cookie和localStorage
   - 尝试重新评论或清除浏览器缓存
   - 检查是否有其他插件阻止了Cookie设置
   - 开启插件的调试模式，查看控制台输出

6. **调试功能**
   - 在后台开启调试模式
   - 在浏览器中按Alt+S快捷键尝试强制显示内容
   - 在URL末尾添加`?xuansecret_debug=1`参数

## 版权信息

- 作者：璇
- 博客：https://blog.ybyq.wang/
- 版本：1.2.5
- 开源协议：MIT License
- 原插件地址：https://8ww.fun/2024/11/18/184.html

  [1]: https://static.blog.ybyq.wang/usr/uploads/2025/05/31/2025-05-31T14:31:21.png?x-oss-process=style/shuiyin
  [2]: https://pan.xunlei.com/s/VORjW73qlPhdwvon6DJnx2wJA1?pwd=xjkw#
  [3]: https://static.blog.ybyq.wang/usr/uploads/2025/06/19/2025-06-18T16:09:26.png?x-oss-process=style/shuiyin
  [4]: https://static.blog.ybyq.wang/usr/uploads/2025/06/19/2025-06-18T16:10:16.png?x-oss-process=style/shuiyin
  [5]: https://static.blog.ybyq.wang/usr/uploads/2025/06/19/2025-06-18T16:20:14.png?x-oss-process=style/shuiyin
  [6]: https://blog.ybyq.wang/archives/525.html

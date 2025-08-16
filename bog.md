# XuanSecret - Typecho 文章内容隐藏插件

> 一个专业的 Typecho 文章内容隐藏插件，支持隐藏文字、图片、附件等内容，访客评论后即可查看。采用三重安全检测机制，确保内容安全。

## 🌟 功能特点

### 核心功能

- ✅ **多类型内容隐藏**：支持隐藏文字、图片、链接、附件、代码块、伸缩框等任意内容
- ✅ **权限管理**：管理员和文章作者可直接查看隐藏内容
- ✅ **持久化记忆**：评论过的用户永久可见该文章的隐藏内容
- ✅ **游客友好**：支持游客无需登录即可评论
- ✅ **编辑器集成**：提供快捷插入按钮，简化使用流程

### 安全特性

- 🛡️ **三重安全检测**：Cookie + localStorage + 数据库验证
- 🛡️ **防绕过设计**：无法通过清除浏览器数据绕过限制
- 🛡️ **跨设备同步**：基于数据库的权限验证，支持多设备访问
- 🛡️ **IP 级别追踪**：游客评论基于 IP 地址进行权限管理

### 用户体验

- 🎨 **响应式设计**：适配各种设备屏幕尺寸
- 🎨 **现代化界面**：使用渐变、阴影等现代 CSS 特性
- 🎨 **内容预览**：可选显示隐藏内容的前 30 个字符
- 🎨 **自定义提示**：支持自定义隐藏内容的提示文本

### 开发者功能

- 🔧 **调试模式**：支持测试和问题排查
- 🔧 **兼容性强**：支持 Typecho 1.2.1 和 PHP 7.4、8.0
- 🔧 **易于配置**：后台可视化配置界面

![插件效果图][1]

## 🏗️ 技术架构

### 三重安全检测机制

XuanSecret 采用多层次的安全验证体系，确保内容隐藏的可靠性：

| 检测层级    | 技术实现       | 检测方式                 | 安全级别 | 绕过难度    |
| ----------- | -------------- | ------------------------ | -------- | ----------- |
| **第 1 层** | Browser Cookie | 客户端快速识别           | 低       | 🔴 可清除   |
| **第 2 层** | localStorage   | 浏览器本地存储备份       | 低       | 🔴 可清除   |
| **第 3 层** | Database Query | 服务器端数据库真实性验证 | 高       | 🟢 无法绕过 |

### 工作流程

![2025-08-16T05:14:37.png](https://static.blog.ybyq.wang/usr/uploads/2025/08/16/2025-08-16T05:14:37.png?x-oss-process=style/shuiyin)

### 数据库查询逻辑

#### 已登录用户验证

```sql
SELECT COUNT(coid) as count
FROM table.comments
WHERE cid = ? AND status = 'approved' AND authorId = ?
```

#### 未登录用户验证

```sql
SELECT COUNT(coid) as count
FROM table.comments
WHERE cid = ? AND status = 'approved' AND ip = ?
```

## 📥 下载与安装

### 下载地址

[secret]
**最新版本下载**：[https://pan.xunlei.com/s/VOT34jvLRXhnUO7f2LuBcQUmA1?pwd=jgfp#][2]

**密码**：jgfp
[/secret]

### 安装步骤

1. **下载插件**

   - 下载插件压缩包并解压
   - 确保目录名为 `XuanSecret`

2. **上传文件**

   ```
   /usr/plugins/XuanSecret/
   ├── Plugin.php          # 主插件文件
   ├── static/
   │   ├── style.css       # 样式文件
   │   └── script.js       # 脚本文件
   └── README.md           # 说明文档
   ```

3. **启用插件**

   - 进入 Typecho 后台管理
   - 导航至「控制台」→「插件管理」
   - 找到 XuanSecret 插件并点击「启用」

4. **配置插件**
   - 点击「设置」进入配置页面
   - 根据需要调整各项参数

## 📝 使用方法

### 编辑器快捷操作

1. **使用快捷按钮**

   - 在文章编辑页面底部找到「插入隐藏内容」按钮
   - 选择要隐藏的文本后点击按钮
   - 自动生成对应的隐藏标签

   ![编辑器按钮][3]

2. **手动输入**

   - 直接在编辑器中输入 `secret` 和 `/secret` 标签
   - 在标签之间放置要隐藏的内容

   ![手动输入示例][4]

### 实际应用示例

#### 基础语法格式

[secret]
这里放置需要隐藏的内容
支持任意 Markdown 语法和 HTML 标签
[/secret]

**语法特点**：

- 🏷️ **开始标签**：`secret` - 区分大小写，必须是小写
- 🏷️ **结束标签**：`/secret` - 必须严格匹配，支持嵌套
- 📝 **内容类型**：支持文本、代码、图片、链接、表格等任意内容
- 🔧 **解析引擎**：服务器端处理，前端动态显示

---

#### 1. 隐藏普通文本内容

```markdown
这是在代码块中公开的内容，包括**粗体**，_斜体_，`重点`，表情 ::QQ:aini:: 。

[secret]
这是在代码块中隐藏的文本内容，**粗体**，_斜体_，`重点`，表情 ::QQ:aini:: 。
[/secret]

这里又是公开内容。
```

这是普通段落的公开内容，包括**粗体**，_斜体_，`重点`，表情 ::QQ:aini:: 。

[secret]
这是不在代码块中隐藏的文本内容，**粗体**，_斜体_，`重点`，表情 ::QQ:aini:: 。
[/secret]

这里又是公开内容。

#### 2. 隐藏代码片段

下面是一个简单的示例，完整代码需要评论后查看：

[secret]

```
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
            } catch(e) {}
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
```
[/secret]



#### 3. 隐藏图片和媒体资源

教程概述已经介绍完毕，详细的操作截图如下：

[secret]
![详细操作步骤截图][5]

**视频教程**：[完整操作演示视频](https://example.com/video.mp4)
[/secret]

#### 4. 隐藏下载链接和资源

软件介绍完毕，相关资源下载：

[secret]

### 📥 资源下载

**软件下载**：[https://blog.ybyq.wang/archives/525.html][6]

- 文件大小：125 MB
- 版本：v2.1.0
- 更新时间：2025-01-15

**提取码**：abc123

**安装说明**：

1. 解压后运行 setup.exe
2. 按照向导完成安装
3. 首次启动需要激活码：XYZ-789-DEF
   [/secret]

#### 5. 隐藏配置文件和参数

基础配置已经说明，高级配置参数如下：

[secret]

```json
{
  "database": {
    "host": "localhost",
    "username": "admin",
    "password": "secret_password_123",
    "database": "production_db"
  },
  "api_keys": {
    "payment": "pk_live_xxxxxxxxxxxxxxxxx",
    "email": "key-xxxxxxxxxxxxxxxx"
  },
  "debug_mode": false
}
```

⚠️ **重要提醒**：请妥善保管这些配置信息，不要泄露给他人。
[/secret]

#### 6. 隐藏表格数据

公开的统计数据已展示，详细的分析报告：

[secret]
| 项目名称 | 收入($)  | 成本($) | 利润率 | 备注 |
|-------------|----------|----------|---------|-------------------------|
| 项目 A | 150,000 | 90,000 | 40% | 主力产品，持续增长 |
| 项目 B | 80,000 | 65,000 | 18.75% | 新产品，市场培育期 |
| 项目 C | 200,000 | 120,000 | 40% | 企业服务，利润稳定 |
| **总计** | **430,000** | **275,000** | **36%** | **整体运营良好** |

📊 **关键指标分析**：

- Q1 增长率：+25%
- 客户满意度：94.5%
- 市场占有率：12.3%
  [/secret]

#### 7. 隐藏引用和参考资料

基础理论已经介绍，深入的学术资料：

[secret]

### 📚 核心参考文献

1. **Smith, J. et al.** (2024). _Advanced Algorithm Design_. MIT Press.

   - 第 3 章：优化策略详解
   - 第 7 章：实际应用案例

2. **内部技术文档**：`TechDoc-2024-v3.2.pdf`

   - 系统架构设计方案
   - 性能优化指南

3. **专利文献**：US Patent No. 11,234,567
   - 核心算法实现方法
   - 技术创新点分析

**获取方式**：以上资料可通过内部邮件系统申请获取。
[/secret]

#### 8. 隐藏多媒体内容组合

综合案例展示，完整的多媒体教程包：
[secret]

### 🎓 完整教程包

#### 📖 文档资料

- [操作手册 PDF](https://example.com/manual.pdf) (2.5MB)
- [快速参考卡片](https://example.com/reference.pdf) (500KB)

#### 🎥 视频教程

- [基础操作演示](https://example.com/basic.mp4) (15 分钟)
- [高级技巧讲解](https://example.com/advanced.mp4) (28 分钟)
- [常见问题答疑](https://example.com/faq.mp4) (12 分钟)

#### 💾 实用工具

- [配置生成器](https://example.com/config-tool.zip)
- [批处理脚本](https://example.com/scripts.zip)
- [模板文件包](https://example.com/templates.zip)

#### 🔑 授权信息

- **许可证密钥**：ABC-123-XYZ-789-DEF
- **有效期限**：2025-12-31
- **授权用户数**：最多 5 个用户
  [/secret]

#### 9. 隐藏嵌套内容结构

高级用法演示，支持复杂的内容嵌套：

[secret]

### 🏗️ 系统架构详解

#### 前端层

```javascript
//js代码
const SecretComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchSecretData().then(setData);
  }, []);

  return <div>{data?.content}</div>;
};
```

#### 后端层

```python
# Django视图处理逻辑
@login_required
def secret_view(request):
    if request.user.has_permission('view_secret'):
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'forbidden'})
```

#### 数据库层

```sql
//数据库段代码
CREATE TABLE secret_content (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

> **架构说明**：采用三层分离设计，确保安全性和可维护性。
> [/secret]

#### 10. 隐藏 handsome 主题的收缩框

[secret]
[collapse status="false" title="这是一个被隐藏的收缩框"]
这是收缩框的内容
[/collapse]
[/secret]

#### 11. 隐藏高亮文本

[secret]

[scode type="green"]这里编辑标签内容[/scode]
[scode type="share"]这里编辑标签内容[/scode]
[scode type="red"]这里编辑标签内容[/scode]
[scode type="blue"]这里编辑标签内容[/scode]

[/secret]

#### 📋 使用技巧和注意事项

**✅ 推荐做法**：

- 合理控制隐藏内容长度，避免过长影响阅读体验
- 在隐藏内容前提供适当的上下文说明
- 重要内容建议同时提供预览或概要描述
- 使用有吸引力的提示文本引导用户评论

**⚠️ 注意事项**：
- 尽量不使用代码块```来包裹隐藏内容，避免影响代码块的格式
- 解开隐藏内容后，将直接显示隐藏内容，不会显示任何样式
- 标签必须成对出现，缺少结束标签会导致内容丢失
- 避免在标题、链接描述等特殊位置使用隐藏标签
- 大量使用隐藏内容可能影响 SEO 效果
- 确保隐藏的内容确实有价值，避免用户反感

**🔧 高级技巧**：

- 可以嵌套使用多个隐藏块，适用于分层信息展示
- 结合内容预览功能，提高用户评论转化率
- 配合评论次数设置，创建阶梯式内容解锁体验

## ⚙️ 配置选项详解

### 基础配置

#### 1. 提示文本设置

- **配置项**：`tipText`
- **默认值**：此内容需要评论后才能查看哦 (_^▽^_)
- **说明**：当内容被隐藏时显示给用户的提示信息
- **支持 HTML**：可以包含简单的 HTML 标签

#### 2. 评论次数要求

- **配置项**：`commentCount`
- **默认值**：1
- **取值范围**：正整数
- **说明**：用户需要评论多少次才能查看隐藏内容
- **建议值**：1-3 次，过高会影响用户体验

#### 3. 游客评论设置

- **配置项**：`guestComment`
- **选项**：
  - `0`：需要登录 - 游客必须注册登录后才能评论
  - `1`：允许游客评论 - 游客可直接评论无需注册
- **默认值**：1（允许游客评论）

### 高级配置

#### 4. 内容预览功能

- **配置项**：`enablePreview`
- **选项**：
  - `0`：禁用预览
  - `1`：启用预览
- **默认值**：0（禁用）
- **效果**：启用后会显示隐藏内容的前 30 个字符
- **用途**：帮助用户判断隐藏内容的价值，提高评论积极性

### 故障排除指南

[tabs]
[tab name="插件无效果" active="true"]

#### Q1：插件启用后没有任何效果？

**可能原因**：
- 文件结构不正确或权限不足
- 插件未在后台正确启用
- 主题不兼容或存在冲突

**解决方案**：
1. 检查文件结构和权限设置
2. 重新启用插件
3. 临时更换默认主题测试
4. 检查浏览器开发者工具的错误信息

#### Q2：如何验证插件功能是否正常？

**解决方案**：
1. 使用调试参数 `?xuansecret_test_uncommented=1`
2. 应该能看到隐藏状态的提示界面
3. 如果看不到说明插件可能未正确加载
[/tab]

[tab name="评论后仍隐藏"]

#### Q3：为什么评论提交后内容仍然隐藏？

**可能原因**：
- 浏览器禁用了 Cookie 或 localStorage
- 评论未通过审核
- JavaScript 执行错误

**解决方案**：
1. 检查浏览器安全设置
2. 后台确认评论审核状态
3. 刷新页面或重新访问文章
4. 检查网络连接和 AJAX 请求

#### Q4：为什么清空 Cookie 后内容仍然显示？

**答案**：这是正常现象，体现了三重检测机制的安全性。

**技术原理**：
1. **Cookie 检测**：已被清空 ✅
2. **localStorage 检测**：已被清空 ✅
3. **数据库检测**：仍然生效 ⚠️

数据库检测会查询真实的评论记录，这是最终的权限验证。
[/tab]

[tab name="内容永久显示"]

#### Q5：为什么内容永久显示，无法隐藏？

**可能原因**：
- 以管理员身份登录
- 是文章作者本人
- 之前已评论过该文章

**解决方案**：
1. 退出登录后测试
2. 使用调试参数验证功能
3. 创建新文章进行测试
4. 更换访问 IP 地址
[/tab]

[tab name="IP 共享问题"]

#### Q6：同一 IP 下的多个游客是否都能看到隐藏内容？ ⚠️ 重要

**答案**：是的，这是游客用户模式下的预期行为。

**技术原理**：
```sql
SELECT COUNT(coid) as count
FROM table.comments
WHERE cid = ? AND status = 'approved' AND ip = ?
```

**实际场景**：
| 场景      | 结果                  |
| --------- | --------------------- |
| 家庭网络  | ✅ 一人评论，全家可见 |
| 公司网络  | ✅ 一人评论，同事可见 |
| 公共 WiFi | ⚠️ 可能"搭便车"       |

**解决方案**：
1. **启用用户注册**：将游客评论设置改为"需要登录"
2. **增加评论次数**：设置需要更多评论才能解锁
3. **结合其他验证**：如邮箱验证、验证码等
[/tab]

[tab name="插件冲突"]

#### Q7：如何解决插件冲突问题？

**可能原因**：
- 多个内容处理插件同时启用
- JavaScript 库版本冲突
- CSS 样式覆盖

**解决方案**：
1. 逐一禁用其他插件排查冲突源
2. 检查浏览器控制台的错误日志
3. 调整插件加载顺序
4. 联系技术支持获取兼容性补丁

#### Q8：数据库检测的性能影响如何？

**性能分析**：
- **查询复杂度**：O(log n)，基于索引查询
- **数据库负载**：单次简单 COUNT 查询
- **缓存机制**：结果会被 Cookie/localStorage 缓存
- **实际影响**：可忽略不计（< 1ms）
[/tab]
[/tabs]



## 🔄 版本更新记录

### Version 1.2.10 (2025-08-16) 🆕

#### 🐛 重要修复

- **智能内容识别**：自动判断内容是 HTML 还是 Markdown，避免对已解析的 HTML 进行二次 Markdown 解析
- **代码块格式保护**：移除 CSS 中对代码块的强制样式覆盖，保持主题原有的代码块格式
- **解析逻辑优化**：已评论用户直接移除标签保留内部 HTML，未评论用户智能处理预览内容
- **Ajax 处理改进**：根据内容类型智能选择输出方式，避免重复解析导致的格式错误

### Version 1.2.9 (2025-08-16)

#### 📋 技术改进

- **样式隔离**：插件样式不再影响原生 Markdown 代码块的显示效果
- **HTML 结构简化**：减少不必要的 HTML 包装，保持内容的原始结构
- **主题兼容性**：确保与各种主题的代码高亮插件完美配合

### Version 1.2.8 (2025-08-16)

#### 🔧 核心优化

- **钩子机制调整**：回到 contentEx 钩子，智能处理已解析的 HTML 内容
- **双重解析问题修复**：避免对代码块进行重复的 Markdown 解析
- **格式保护增强**：确保代码块在解锁后保持原始格式

### Version 1.2.7 (2025-08-16)

#### 🛠️ 重大修复

- **调试功能增强**：新增 URL 参数 `xuansecret_test_uncommented=1` 支持临时测试
- **兼容性改进**：优化 Cookie 设置机制，解决不同服务器环境的兼容性问题
- **错误处理**：增强异常捕获和错误处理逻辑，提高插件稳定性

### Version 1.2.6 (2025-08-16)

#### 🔒 安全机制完善

- **三重检测验证**：完善 Cookie、localStorage 和数据库三重检测机制
- **防绕过加强**：数据库检测确保评论状态的真实性和持久性
- **跨设备同步**：基于服务器端验证，已评论用户永不丢失权限

### Version 1.2.5 (2025-06-21)

#### 🔧 关键修复

- **Cookie 机制改进**：重写 Cookie 设置逻辑，解决在某些环境下不生效的问题
- **命名规范优化**：使用更简单直观的 Cookie 命名规则，提高系统兼容性
- **向后兼容支持**：同时支持新旧两种 Cookie 命名方式，确保平滑升级

### 历史版本

[tabs]
[tab name="Version 1.2.4" active="true"]

#### 🔍 重要修复

- **作用域隔离**：修复评论状态跨文章保持的问题，确保每篇文章独立判断
- **ID 检测增强**：改进文章 ID 获取逻辑，支持多种 URL 结构和参数格式
- **存储优化**：移除全局 Cookie 标记，改用文章特定的标识符
  [/tab]

[tab name="Version 1.2.3"]

#### 💡 重大重构

- **JavaScript 重写**：彻底重构前端 JavaScript 代码，解决游客评论后内容不显示的核心问题
- **检测逻辑优化**：增强 Cookie 检测机制，支持多种浏览器环境和安全设置
- **调试系统**：引入调试模式，支持 Alt+S 快捷键和 URL 参数调试
  [/tab]

[tab name="Version 1.2.1-1.2.2"]

#### Version 1.2.2 (2025-06-21)

- **兼容性修复**：解决部分主题下 CSS 样式冲突问题
- **代码优化**：精简 JavaScript 代码，提升执行效率

#### Version 1.2.1 (2025-06-21)

- **安全加固**：增强评论验证机制
- **错误处理**：改进异常捕获和错误提示
  [/tab]

[tab name="Version 1.0-1.2.0"]

#### Version 1.2.0 (2025-05-31)

- **编辑器集成**：新增快捷插入按钮功能
- **界面优化**：全新的现代化 UI 设计
- **响应式支持**：完美适配移动端设备

#### Version 1.1.0 (2025-04-15)

- **预览功能**：支持隐藏内容预览显示
- **配置扩展**：增加更多个性化配置选项
- **性能优化**：数据库查询优化，提升响应速度

#### Version 1.0.0 (2025-03-01)

- **核心功能**：基础的内容隐藏和评论解锁机制
- **安全机制**：三重检测验证体系
- **基础界面**：简洁的用户交互界面
  [/tab]
  [/tabs]

## 🏆 设计理念

[tabs]
[tab name="安全优先" active="true"]

- **多层防护**：不依赖单一检测机制，采用多重验证确保安全性
- **数据真实性**：基于数据库的最终验证，确保评论状态的真实可靠
- **防恶意绕过**：考虑各种技术手段的绕过可能，设计对应的防护机制
  [/tab]

[tab name="用户体验"]

- **简化操作**：一键插入隐藏内容，降低使用门槛
- **视觉友好**：现代化界面设计，提供良好的视觉反馈
- **响应式适配**：全设备兼容，确保各种屏幕下的最佳体验
  [/tab]

[tab name="开发者友好"]

- **调试支持**：提供完整的调试工具和测试方法
- **文档完整**：详细的技术文档和使用说明
- **扩展性强**：模块化设计，便于二次开发和功能扩展
  [/tab]

[tab name="性能考量"]

- **缓存机制**：充分利用浏览器缓存，减少服务器查询
- **查询优化**：数据库查询使用索引，确保高效执行
- **资源最小化**：CSS/JS 文件优化，减少加载时间
  [/tab]
  [/tabs]


### 功能自检清单

| 检查项目   | 预期结果                     | 验证方法           |
| ---------- | ---------------------------- | ------------------ |
| 插件启用   | 后台显示"已启用"状态         | 检查插件管理页面   |
| 编辑器集成 | 显示"插入隐藏内容"按钮       | 进入文章编辑页面   |
| 隐藏功能   | 未评论用户看到提示界面       | 使用调试参数测试   |
| 评论解锁   | 评论提交后内容自动显示       | 实际评论流程测试   |
| 数据库检测 | 清空浏览器数据仍正确显示内容 | 清空缓存后重新访问 |
| 跨设备同步 | 不同设备访问结果一致         | 多设备对比测试     |



### 获取帮助

- **官方博客**：[https://blog.ybyq.wang/][7]
- **技术交流**：文章评论区留言
- **问题反馈**：详细描述问题和环境信息
- **功能建议**：欢迎提出改进意见

## 📄 开源信息

- **作者**：璇
- **版本**：1.2.10
- **开源协议**：MIT License
- **项目地址**：[https://github.com/BXCQ/XuanSecret]
- **更新频率**：持续维护更新

---

_本插件遵循安全、稳定、易用的设计原则，致力于为 Typecho 用户提供专业可靠的内容隐藏解决方案。如有使用问题或建议，欢迎交流。_

[1]: https://static.blog.ybyq.wang/usr/uploads/2025/05/31/2025-05-31T14:31:21.png?x-oss-process=style/shuiyin
[2]: https://pan.xunlei.com/s/VOT34jvLRXhnUO7f2LuBcQUmA1?pwd=jgfp#
[3]: https://static.blog.ybyq.wang/usr/uploads/2025/06/19/2025-06-18T16:09:26.png?x-oss-process=style/shuiyin
[4]: https://static.blog.ybyq.wang/usr/uploads/2025/06/19/2025-06-18T16:10:16.png?x-oss-process=style/shuiyin
[5]: https://static.blog.ybyq.wang/usr/uploads/2025/06/19/2025-06-18T16:20:14.png?x-oss-process=style/shuiyin
[6]: https://blog.ybyq.wang/archives/525.html
[7]: https://blog.ybyq.wang/

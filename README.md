# XuanSecret - Typecho 文章内容隐藏插件

> 一个专业的 Typecho 文章内容隐藏插件，支持隐藏文字、图片、附件等内容，访客评论后即可查看。采用三重安全检测机制，确保内容安全。

[![GitHub stars](https://img.shields.io/github/stars/BXCQ/XuanSecret?style=flat-square)](https://github.com/BXCQ/XuanSecret/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/BXCQ/XuanSecret?style=flat-square)](https://github.com/BXCQ/XuanSecret/network)
[![GitHub license](https://img.shields.io/github/license/BXCQ/XuanSecret?style=flat-square)](https://github.com/BXCQ/XuanSecret/blob/master/LICENSE)
[![GitHub release](https://img.shields.io/github/release/BXCQ/XuanSecret?style=flat-square)](https://github.com/BXCQ/XuanSecret/releases)

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

## 📥 安装方法

### 方法一：GitHub 下载（推荐）

```bash
# 克隆仓库
git clone https://github.com/BXCQ/XuanSecret.git

# 或下载 ZIP 文件
wget https://github.com/BXCQ/XuanSecret/archive/master.zip
```

### 方法二：直接下载

1. 点击右侧 **Releases** 下载最新版本
2. 或点击 **Code** → **Download ZIP** 下载源码

### 安装步骤

1. **上传文件**
   ```
   /usr/plugins/XuanSecret/
   ├── Plugin.php          # 主插件文件
   ├── static/
   │   ├── style.css       # 样式文件
   │   └── script.js       # 脚本文件
   ├── README.md           # 说明文档
   └── LICENSE             # 开源协议
   ```

2. **启用插件**
   - 进入 Typecho 后台管理
   - 导航至「控制台」→「插件管理」
   - 找到 XuanSecret 插件并点击「启用」

3. **配置插件**
   - 点击「设置」进入配置页面
   - 根据需要调整各项参数

## 📝 使用方法

### 基础语法

```markdown
这是公开的内容，所有人都可以看到。

[secret]
这是隐藏的内容，需要评论后才能查看。
支持任意 Markdown 语法和 HTML 标签。
[/secret]

这里又是公开内容。
```

### 编辑器快捷操作

1. **使用快捷按钮**
   - 在文章编辑页面底部找到「插入隐藏内容」按钮
   - 选择要隐藏的文本后点击按钮
   - 自动生成对应的隐藏标签

2. **手动输入**
   - 直接在编辑器中输入 `[secret]` 和 `[/secret]` 标签
   - 在标签之间放置要隐藏的内容

## 🏗️ 技术架构

### 三重安全检测机制

| 检测层级    | 技术实现       | 检测方式                 | 安全级别 | 绕过难度    |
| ----------- | -------------- | ------------------------ | -------- | ----------- |
| **第 1 层** | Browser Cookie | 客户端快速识别           | 低       | 🔴 可清除   |
| **第 2 层** | localStorage   | 浏览器本地存储备份       | 低       | 🔴 可清除   |
| **第 3 层** | Database Query | 服务器端数据库真实性验证 | 高       | 🟢 无法绕过 |

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

## ⚙️ 配置选项

### 基础配置

- **提示文本**：自定义隐藏内容的提示信息
- **评论次数要求**：设置查看内容所需的评论次数
- **游客评论设置**：是否允许游客无需登录即可评论

### 高级配置

- **内容预览功能**：显示隐藏内容的前 30 个字符
- **调试模式**：支持 URL 参数调试和问题排查

## 🔄 更新日志

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

[查看完整更新日志](CHANGELOG.md)

## 🔧 环境要求

- **服务器**：支持 PHP 7.4+ 的 Web 服务器
- **框架**：Typecho 1.2.1 或更新版本
- **数据库**：MySQL 5.7+ 或 MariaDB 10.2+
- **浏览器**：支持现代浏览器（Chrome 60+、Firefox 55+、Safari 12+、Edge 79+）

## 🐛 故障排除

### 常见问题

1. **插件启用后没有任何效果？**
   - 检查文件结构和权限设置
   - 重新启用插件
   - 临时更换默认主题测试

2. **为什么评论提交后内容仍然隐藏？**
   - 检查浏览器安全设置
   - 后台确认评论审核状态
   - 刷新页面或重新访问文章

3. **如何验证插件功能是否正常？**
   - 使用调试参数 `?xuansecret_test_uncommented=1`
   - 应该能看到隐藏状态的提示界面

更多问题解决方案请查看 [详细文档](bog.md)


## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。


## 最后

- **博客**：[https://blog.ybyq.wang/](https://blog.ybyq.wang/)

---

⭐ 如果这个项目对您有帮助，请给我们一个 Star！

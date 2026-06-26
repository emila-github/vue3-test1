# Windows 下 NVM、Node.js 与 pnpm 完整安装及使用指南

本文档旨在为 Windows 开发者提供一套标准化的 Node.js 开发环境搭建流程。通过 NVM 管理 Node 版本，并使用 pnpm 作为包管理器，可以大幅提升开发效率与磁盘利用率。

## 一、 官方资源与推荐资料

在开始安装前，建议收藏以下官方文档与资源，以便随时查阅：

- **NVM for Windows**
  - GitHub 仓库：[https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows)
  - 简介：Windows 专用的 Node.js 版本管理器，通过符号链接实现多版本无缝切换。
- **Node.js 官方**
  - 官网：[https://nodejs.org/](https://nodejs.org/)
  - 简介：JavaScript 运行时环境，提供 LTS（长期支持）与 Current（最新特性）两个版本线。
- **pnpm 官方**
  - 官网：[https://pnpm.io/zh/](https://pnpm.io/zh/)
  - GitHub：[https://github.com/pnpm/pnpm](https://github.com/pnpm/pnpm)
  - 简介：新一代包管理器，通过内容可寻址存储和硬链接技术，节省磁盘空间并提升安装速度。
- **国内镜像加速（npmmirror）**
  - 官网：[https://npmmirror.com/](https://npmmirror.com/)
  - 简介：提供 Node.js、npm、pnpm 等国内高速镜像源，解决网络下载缓慢问题。

---

## 二、 NVM for Windows 安装与配置

### 1. 环境清理（重要）

如果你之前通过 `.msi` 安装包安装过 Node.js，**必须先彻底卸载**，以避免环境变量和路径冲突。

- 在“控制面板”中卸载 Node.js。
- 手动删除残留目录（如存在）：`C:\Program Files\nodejs`、`%APPDATA%\npm`。

### 2. 安装 NVM

1. 前往 [nvm-windows Releases](https://github.com/coreybutler/nvm-windows/releases) 下载最新的 `nvm-setup.exe`。
2. **右键以管理员身份运行**安装程序。
3. 设置安装路径（建议路径中**无空格、无中文**）：
   - NVM 安装目录：例如 `D:\nvm`
   - Node.js 符号链接目录：例如 `D:\nodejs`（此文件夹无需手动创建，NVM 会自动接管）

### 3. 配置国内镜像加速

打开 NVM 安装目录下的 `settings.txt` 文件，在末尾追加以下两行：

```ini
node_mirror: https://npmmirror.com/mirrors/node/
npm_mirror: https://npmmirror.com/mirrors/npm/
```

### 4. 验证安装

以管理员身份打开 CMD 或 PowerShell，输入：

```bash
nvm version
```

若正常输出版本号，则安装成功。

---

## 三、 通过 NVM 安装与管理 Node.js

### 1. 常用命令

- 查看可安装的 Node.js 版本：`nvm list available`
- 安装最新 LTS（长期支持）版本：`nvm install lts`
- 安装指定版本：`nvm install 18.20.8`
- 切换 Node.js 版本：**`nvm use 18.20.8`**（需管理员权限）
- 查看已安装版本：`nvm ls`

### 2. 验证 Node 与 npm

切换版本后，验证环境是否生效：

```bash
node -v
npm -v
```

_注：每个 Node.js 版本都会自带对应版本的 npm，无需单独管理 npm 版本。_

---

## 四、 pnpm 的安装与进阶配置

### 1. 全局安装 pnpm

在配置好 Node.js 后，直接使用 npm 全局安装：

```bash
npm install -g pnpm
```

验证：`pnpm -v`

### 2. 配置国内镜像

```bash
pnpm config set registry https://registry.npmmirror.com
```

### 3. 进阶：依赖与全局包路径隔离（强烈推荐）

为了避免多 Node 版本切换时产生全局包冲突或磁盘增量问题，**不建议**使用 `pnpm config set store-dir` 命令修改路径（这会产生用户级配置文件）。

**正确做法：** 编辑 Node.js 全局配置文件 `%NVM_SYMLINK%\etc\npmrc`（例如 `D:\nodejs\etc\npmrc`，若不存在请手动新建），写入以下内容：

```ini
store-dir=D:\cache\pnpm-store-v18
global-dir=D:\cache\pnpm-global-v18
```

_注：将路径中的 `v18` 替换为你当前使用的 Node 大版本号。这样不同 Node 版本的 pnpm 全局包和缓存将完全物理隔离。_

---

## 五、 pnpm 核心使用命令速查

pnpm 的命令与 npm 高度兼容，但更加严格和高效：

| 功能         | npm 命令                    | pnpm 命令                    |
| :----------- | :-------------------------- | :--------------------------- |
| 初始化项目   | `npm init`                  | `pnpm init`                  |
| 安装所有依赖 | `npm install`               | `pnpm install` (或 `pnpm i`) |
| 安装生产依赖 | `npm install lodash`        | `pnpm add lodash`            |
| 安装开发依赖 | `npm install eslint -D`     | `pnpm add eslint -D`         |
| 全局安装包   | `npm install -g typescript` | `pnpm add -g typescript`     |
| 卸载依赖     | `npm uninstall lodash`      | `pnpm remove lodash`         |
| 运行脚本     | `npm run dev`               | `pnpm run dev`               |

### pnpm 核心优势

1.  **节省磁盘空间**：同一版本的依赖包在电脑中只存储一份，通过硬链接供所有项目使用。
2.  **安装速度极快**：冷缓存安装速度约为 npm 的 2 倍，热缓存安装仅需数秒。
3.  **杜绝幽灵依赖**：采用非扁平的 `node_modules` 结构，未在项目 `package.json` 中声明的依赖无法被访问，避免线上隐患。
4.  **原生支持 Monorepo**：通过配置 `pnpm-workspace.yaml` 即可轻松管理多包项目。

---

## 六、 常见问题排查 (FAQ)

1.  **PowerShell 提示“无法加载文件...因为在此系统上禁止运行脚本”**
    - **解决**：以管理员身份打开 PowerShell，执行 `Set-ExecutionPolicy RemoteSigned -Scope Process`，然后重新运行命令。
2.  **`nvm use` 切换失败或提示权限不足**
    - **解决**：NVM 切换版本需要修改系统符号链接，必须**以管理员身份**运行终端。
3.  **安装依赖时网络超时**
    - **解决**：检查是否正确配置了 npmmirror 镜像；若使用了代理，尝试在终端关闭代理后重试。
4.  **`command not found: pnpm`**
    - **解决**：检查环境变量，确保 `%NVM_SYMLINK%`（如 `D:\nodejs`）已加入系统 `Path` 中。重启终端生效。

---

需要我帮你整理一份 pnpm-workspace.yaml 的配置示例吗？你的 vue-vben-admin 项目是多包结构，用上 monorepo 会很方便。

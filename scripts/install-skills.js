/**
 * Skill 安装脚本
 * 读取 skills-lock.json，从 GitHub 拉取对应的 SKILL.md 文件到 .agents/skills/ 目录
 *
 * 用法：
 *   node scripts/install-skills.js          # 安装/更新所有 skill
 *   node scripts/install-skills.js --check  # 仅检查，不安装
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const LOCK_FILE = join(ROOT, 'skills-lock.json')
const AGENTS_DIR = join(ROOT, '.agents', 'skills')

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com'

function hash(content) {
  return createHash('sha256').update(content).digest('hex')
}

async function fetchSkill(source, skillPath) {
  const url = `${GITHUB_RAW_BASE}/${source}/main/${skillPath}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
  }
  return response.text()
}

async function main() {
  const checkOnly = process.argv.includes('--check')

  if (!existsSync(LOCK_FILE)) {
    console.error('❌ skills-lock.json not found. Run "skill install" first.')
    process.exit(1)
  }

  const lock = JSON.parse(readFileSync(LOCK_FILE, 'utf-8'))
  const skills = lock.skills || {}

  if (Object.keys(skills).length === 0) {
    console.log('✅ No skills to install.')
    return
  }

  let installed = 0
  let skipped = 0
  let failed = 0

  for (const [name, info] of Object.entries(skills)) {
    const targetDir = join(AGENTS_DIR, name)
    const targetFile = join(targetDir, 'SKILL.md')

    try {
      // 检查本地文件是否已存在且 hash 匹配
      if (existsSync(targetFile)) {
        const existing = readFileSync(targetFile, 'utf-8')
        if (hash(existing) === info.computedHash) {
          skipped++
          continue
        }
      }

      if (checkOnly) {
        console.log(`  ⚠ ${name}: needs update (hash mismatch or missing)`)
        continue
      }

      // 拉取文件
      console.log(`  ⬇ ${name}: downloading from ${info.source}...`)
      const content = await fetchSkill(info.source, info.skillPath)

      // 校验 hash
      const actualHash = hash(content)
      if (actualHash !== info.computedHash) {
        console.warn(`  ⚠ ${name}: hash mismatch! Expected ${info.computedHash.slice(0, 8)}..., got ${actualHash.slice(0, 8)}...`)
      }

      // 写入文件
      mkdirSync(targetDir, { recursive: true })
      writeFileSync(targetFile, content, 'utf-8')
      console.log(`  ✅ ${name}: installed successfully`)
      installed++
    } catch (err) {
      console.error(`  ❌ ${name}: ${err.message}`)
      failed++
    }
  }

  console.log('')
  if (checkOnly) {
    console.log(`🔍 Check complete: ${Object.keys(skills).length} skills, ${skipped} up-to-date`)
  } else {
    console.log(`📦 Install complete: ${installed} installed, ${skipped} up-to-date, ${failed} failed`)
  }
}

main().catch((err) => {
  console.error('❌', err.message)
  process.exit(1)
})

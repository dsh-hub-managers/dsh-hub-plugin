import { describe, expect, it, vi } from 'vitest'
import { apply, createInstallPrompt } from '../src/client.tsx'

describe('DSH Hub client plugin', () => {
  it('registers a native settings section beside Plugins', () => {
    const register = vi.fn(() => vi.fn())
    const inject = vi.fn((_name: string, mount: () => void) => mount())
    apply({
      effect: vi.fn(),
      slots: { inject, register },
      sessions: {
        list: { getSnapshot: () => ({}) },
        binding: () => undefined,
      },
    })
    expect(inject).toHaveBeenCalledWith('settings.section', expect.any(Function))
    expect(register).toHaveBeenCalledWith(expect.objectContaining({
      name: 'settings.section',
      id: 'dsh-hub',
      order: 16,
      label: 'DSH HUB 市场',
    }), expect.any(Function))
  })

  it('creates a review-first install prompt', () => {
    const prompt = createInstallPrompt({
      id: 'owner/plugin',
      owner: 'owner',
      name: 'plugin',
      fullName: 'owner/plugin',
      description: null,
      repositoryUrl: 'https://github.com/owner/plugin',
      stars: 1,
      category: '其他',
      installability: 'verified',
      pushedAt: '2026-01-01T00:00:00Z',
    })
    expect(prompt).toContain('/install-plan')
    expect(prompt).toContain('精确 commit')
    expect(prompt).toContain('pnpm store')
    expect(prompt).toContain('两步修复序列')
    expect(prompt).toContain('不要对 add 使用 --force')
    expect(prompt).toContain('不要修改 DeepSeek Harness 源码')
    expect(prompt).toContain('回报')
  })
})

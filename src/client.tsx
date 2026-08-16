import { useEffect, useMemo, useState, type ReactNode } from 'react'

const HUB_URL = 'https://dsh-hub.cc'

type Locale = 'zh' | 'en'

interface PluginSummary {
  readonly id: string
  readonly owner: string
  readonly name: string
  readonly fullName: string
  readonly description: string | null
  readonly repositoryUrl: string
  readonly stars: number
  readonly category: string
  readonly installability: 'verified' | 'candidate' | 'unsupported'
  readonly pushedAt: string
}

interface PluginPage {
  readonly items: readonly PluginSummary[]
  readonly total: number
}

interface SessionBinding {
  readonly session: {
    prompt(
      content: readonly { readonly type: 'text'; readonly text: string }[],
      mode: 'queue',
    ): Promise<unknown>
  }
}

interface ClientContext {
  readonly effect: (mount: () => (() => void), description?: string) => void
  readonly slots: {
    inject(name: string, mount: () => (() => void)): void
    register(options: {
      readonly name: string
      readonly id: string
      readonly order: number
      readonly label: string
    }, component: () => ReactNode): () => void
  }
  readonly sessions: {
    readonly list: {
      getSnapshot(): { readonly current?: string }
    }
    binding(id: string): SessionBinding | undefined
  }
}

/** Services required by the native marketplace tab. */
export const inject = ['slots', 'sessions']

const marketplaceStyles = `
.dsh-hub-market {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  max-width: 760px;
  padding-bottom: 24px;
  color: var(--dsw-alias-label-primary, #17191c);
  font-family: var(--dsw-font-family, inherit);
}
.dsh-hub-market * { box-sizing: border-box; }
.dsh-hub-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}
.dsh-hub-heading { min-width: 0; }
.dsh-hub-brand {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 5px;
  color: var(--dsw-alias-label-tertiary, #7b8088);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .08em;
}
.dsh-hub-brand-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--dsw-alias-state-business-primary, #4d6bfe);
}
.dsh-hub-title {
  margin: 0;
  font-size: 20px;
  line-height: 28px;
  font-weight: 600;
  letter-spacing: -.01em;
}
.dsh-hub-copy {
  max-width: 600px;
  margin: 5px 0 0;
  color: var(--dsw-alias-label-tertiary, #7b8088);
  font-size: 13px;
  line-height: 20px;
}
.dsh-hub-locale {
  flex: none;
  width: 36px;
  height: 36px;
  border: 1px solid var(--dsw-alias-border-l2, #e2e4e8);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-3, #fff);
  color: var(--dsw-alias-label-primary, #17191c);
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.dsh-hub-locale:hover { background: var(--dsw-alias-interactive-bg-hover, #f3f4f6); }
.dsh-hub-scope {
  display: flex;
  align-items: center;
  gap: 4px;
  width: fit-content;
  max-width: 100%;
  padding: 3px;
  overflow-x: auto;
  border-radius: 10px;
  background: var(--dsw-alias-bg-layer-1, #f5f6f8);
}
.dsh-hub-scope-button,
.dsh-hub-filter {
  flex: none;
  border: 0;
  background: transparent;
  color: var(--dsw-alias-label-tertiary, #7b8088);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
}
.dsh-hub-scope-button {
  height: 30px;
  padding: 0 12px;
  border-radius: 8px;
}
.dsh-hub-scope-button:hover,
.dsh-hub-scope-button[data-active='true'] {
  color: var(--dsw-alias-label-primary, #17191c);
}
.dsh-hub-scope-button[data-active='true'] {
  background: var(--dsw-alias-bg-layer-3, #fff);
  box-shadow: var(--dsw-shadow-lv1, 0 1px 3px rgb(20 24 32 / 10%));
}
.dsh-hub-search {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dsh-hub-search-field {
  position: relative;
  flex: 1;
  min-width: 0;
  color: var(--dsw-alias-label-tertiary, #7b8088);
}
.dsh-hub-search-field svg {
  position: absolute;
  top: 10px;
  left: 12px;
  width: 16px;
  height: 16px;
  pointer-events: none;
}
.dsh-hub-search input {
  width: 100%;
  height: 36px;
  border: 1px solid var(--dsw-alias-border-l2, #e2e4e8);
  border-radius: 8px;
  padding: 0 12px 0 36px;
  outline: none;
  background: var(--dsw-alias-bg-layer-1, #f5f6f8);
  color: var(--dsw-alias-label-primary, #17191c);
  font: inherit;
  font-size: 13px;
}
.dsh-hub-search input::placeholder { color: var(--dsw-alias-label-tertiary, #7b8088); }
.dsh-hub-search input:focus-visible {
  border-color: var(--dsw-alias-state-business-primary, #4d6bfe);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--dsw-alias-state-business-primary, #4d6bfe) 18%, transparent);
}
.dsh-hub-search-button,
.dsh-hub-install {
  border: 1px solid transparent;
  border-radius: 8px;
  background: var(--dsw-alias-label-primary, #17191c);
  color: var(--dsw-alias-bg-layer-3, #fff);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}
.dsh-hub-search-button {
  flex: none;
  height: 36px;
  padding: 0 16px;
  font-size: 13px;
}
.dsh-hub-search-button:hover,
.dsh-hub-install:hover:not(:disabled) { opacity: .82; }
.dsh-hub-filters {
  display: flex;
  align-items: center;
  gap: 5px;
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-width: none;
}
.dsh-hub-filters::-webkit-scrollbar { display: none; }
.dsh-hub-filter {
  height: 30px;
  padding: 0 10px;
  border-radius: 8px;
}
.dsh-hub-filter:hover { background: var(--dsw-alias-interactive-bg-hover, #f3f4f6); }
.dsh-hub-filter[data-active='true'] {
  background: var(--dsw-specific-sidebar-nav-item-active, #ebeef2);
  color: var(--dsw-alias-label-primary, #17191c);
  font-weight: 500;
}
.dsh-hub-results {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 0 2px;
}
.dsh-hub-results strong { font-size: 13px; line-height: 20px; font-weight: 600; }
.dsh-hub-summary {
  margin: 0;
  color: var(--dsw-alias-label-tertiary, #7b8088);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.dsh-hub-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: stretch;
  gap: 10px;
}
.dsh-hub-card {
  position: relative;
  min-width: 0;
  min-height: 188px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l2, #e2e4e8);
  border-radius: 10px;
  padding: 14px;
  background: var(--dsw-alias-bg-layer-3, #fff);
}
.dsh-hub-card:hover {
  border-color: var(--dsw-alias-border-l1, #cfd2d8);
  box-shadow: var(--dsw-shadow-lv1, 0 2px 8px rgb(20 24 32 / 8%));
}
.dsh-hub-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.dsh-hub-owner {
  min-width: 0;
  overflow: hidden;
  margin: 0;
  color: var(--dsw-alias-label-tertiary, #7b8088);
  font-family: var(--ds-font-family-code, ui-monospace, monospace);
  font-size: 11px;
  line-height: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-hub-badge {
  flex: none;
  min-height: 20px;
  display: inline-flex;
  align-items: center;
  border-radius: 5px;
  padding: 1px 6px;
  background: var(--dsw-alias-bg-layer-1, #f5f6f8);
  color: var(--dsw-alias-label-tertiary, #7b8088);
  font-size: 11px;
  line-height: 16px;
}
.dsh-hub-badge[data-verified='true'] {
  background: color-mix(in srgb, var(--dsw-alias-state-success-primary, #279c62) 10%, transparent);
  color: var(--dsw-alias-state-success-primary, #279c62);
}
.dsh-hub-name {
  margin: 10px 0 5px;
  overflow-wrap: anywhere;
  font-size: 15px;
  line-height: 21px;
  font-weight: 600;
}
.dsh-hub-description {
  display: -webkit-box;
  overflow: hidden;
  margin: 0;
  color: var(--dsw-alias-label-tertiary, #7b8088);
  font-size: 12px;
  line-height: 18px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
.dsh-hub-meta {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: auto;
  padding-top: 13px;
  color: var(--dsw-alias-label-tertiary, #7b8088);
  font-size: 11px;
  line-height: 17px;
}
.dsh-hub-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--dsw-alias-border-l2, #e2e4e8);
}
.dsh-hub-details {
  flex: 1;
  color: var(--dsw-alias-label-secondary, #4b5058);
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
}
.dsh-hub-link-target { position: absolute; inset: 0; }
.dsh-hub-install {
  position: relative;
  z-index: 1;
  min-height: 30px;
  padding: 0 10px;
  font-size: 12px;
}
.dsh-hub-install:disabled { opacity: .4; cursor: default; }
.dsh-hub-status {
  margin: 0;
  padding: 32px 12px;
  color: var(--dsw-alias-label-tertiary, #7b8088);
  font-size: 13px;
  line-height: 20px;
  text-align: center;
}
.dsh-hub-locale:focus-visible,
.dsh-hub-scope-button:focus-visible,
.dsh-hub-filter:focus-visible,
.dsh-hub-search-button:focus-visible,
.dsh-hub-install:focus-visible,
.dsh-hub-details:focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary, #4d6bfe);
  outline-offset: 2px;
}
@media (max-width: 680px) {
  .dsh-hub-grid { grid-template-columns: minmax(0, 1fr); }
  .dsh-hub-search { align-items: stretch; flex-direction: column; }
  .dsh-hub-search-button { width: 100%; }
}
`

const categories = ['全部', '通信', '开发工具', '智能体', '搜索与知识', '界面', '记忆', '数据分析', '安全', '其他']

const englishCategories: Readonly<Record<string, string>> = {
  全部: 'All',
  通信: 'Communication',
  开发工具: 'Developer tools',
  智能体: 'Agents',
  搜索与知识: 'Search and knowledge',
  界面: 'Interface',
  记忆: 'Memory',
  数据分析: 'Data and analytics',
  安全: 'Security',
  其他: 'Other',
}

const messages = {
  zh: {
    title: '插件市场',
    copy: '浏览经过清单验证的社区插件，并把安装请求交给当前 DSH 任务审核执行。',
    language: 'Switch to English',
    searchPlaceholder: '搜索插件、作者或标签',
    search: '搜索',
    verifiedScope: 'DSH 插件',
    allScope: 'Topic 仓库',
    results: '推荐插件',
    repositories: (count: number) => `${count} 个仓库`,
    loading: '正在读取 DSH Hub',
    error: (message: string) => `连接失败：${message}`,
    empty: '没有匹配的插件。',
    noDescription: '这个仓库还没有填写简介。',
    details: '详情',
    verified: '已验证',
    candidate: '验证中',
    topicOnly: '仅 Topic',
    unsupported: '不可直接安装',
    sending: '正在发送',
    install: '交给 DSH 安装',
    sent: (name: string) => `已把 ${name} 的审核安装请求发送给当前 DSH 任务。`,
    noTask: '请先打开一个 DSH 任务',
    unavailableTask: '当前 DSH 任务不可用',
  },
  en: {
    title: 'Plugin Market',
    copy: 'Browse manifest-verified community plugins and send install requests to your current DSH task for review.',
    language: '切换到中文',
    searchPlaceholder: 'Search plugins, authors, or tags',
    search: 'Search',
    verifiedScope: 'DSH plugins',
    allScope: 'Topic repositories',
    results: 'Recommended plugins',
    repositories: (count: number) => `${count} repositories`,
    loading: 'Loading DSH Hub',
    error: (message: string) => `Connection failed: ${message}`,
    empty: 'No plugins match your filters.',
    noDescription: 'This repository has no description yet.',
    details: 'Details',
    verified: 'Verified',
    candidate: 'Checking',
    topicOnly: 'Topic only',
    unsupported: 'Direct install unavailable',
    sending: 'Sending',
    install: 'Install with DSH',
    sent: (name: string) => `Sent the review-first install request for ${name} to the current DSH task.`,
    noTask: 'Open a DSH task before installing',
    unavailableTask: 'The current DSH task is unavailable',
  },
} as const

/** Build the review-first prompt sent to the active DSH task. */
export function createInstallPrompt(plugin: PluginSummary, locale: Locale = 'zh'): string {
  if (locale === 'en') {
    return [
      `Install the DSH plugin ${plugin.fullName}. `,
      `First read ${HUB_URL}/api/v1/plugins/${plugin.owner}/${plugin.name}/install-plan. `,
      'Before execution, verify the repository, exact commit, DSH bundle manifest, lifecycle scripts, and permissions. Stop and explain why if the plugin is not verified as installable. ',
      'Resolve the current profile directory before execution. If it is outside the writable sandbox, request one host permission scoped to dsh plugin for that profile before the compatibility preflight. ',
      'Follow the install plan\'s pnpm-store compatibility preflight and run only its normal install command or its two-step incompatible-store recovery sequence. Do not trial-and-error or pass --force to add. Do not modify DeepSeek Harness source or run pnpm install/add directly in the profile. Run a minimal startup check, then report success or failure to the receipt URL.',
    ].join('')
  }
  return [
    `请安装 DSH 插件 ${plugin.fullName}。`,
    `先读取 ${HUB_URL}/api/v1/plugins/${plugin.owner}/${plugin.name}/install-plan 获取安装计划。`,
    '在执行前核对仓库、精确 commit、DSH bundle 清单、生命周期脚本和权限；若插件未通过可安装性验证，请停止并说明原因。',
    '执行前确认当前 profile 目录；若目录不在沙箱可写范围，在兼容预检前一次性申请仅覆盖该 profile 的 dsh plugin 命令及目录的主机权限。',
    '先执行安装计划中的 pnpm store 兼容预检，再只执行普通安装命令，或 store 不兼容时的两步修复序列；不要先试错，也不要对 add 使用 --force。不要修改 DeepSeek Harness 源码，也不要在 profile 中直接运行 pnpm install/add。完成后运行最小启动验证，并把成功或失败结果回报给 receipt URL。',
  ].join('')
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" strokeLinecap="round" />
    </svg>
  )
}

function Marketplace({ install }: { readonly install: (plugin: PluginSummary, locale: Locale) => Promise<void> }) {
  const [locale, setLocale] = useState<Locale>(() => (
    typeof navigator !== 'undefined' && !navigator.language.toLocaleLowerCase().startsWith('zh') ? 'en' : 'zh'
  ))
  const dictionary = messages[locale]
  const [query, setQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [category, setCategory] = useState('全部')
  const [scope, setScope] = useState<'verified' | 'all'>('verified')
  const [state, setState] = useState<
    | { readonly status: 'loading' }
    | { readonly status: 'error'; readonly message: string }
    | { readonly status: 'ready'; readonly page: PluginPage }
  >({ status: 'loading' })
  const [sending, setSending] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  const endpoint = useMemo(() => {
    const params = new URLSearchParams({ limit: '24', sort: 'trending', scope })
    if (submittedQuery) params.set('q', submittedQuery)
    if (category !== '全部') params.set('category', category)
    return `${HUB_URL}/api/v1/plugins?${params}`
  }, [category, scope, submittedQuery])

  useEffect(() => {
    const controller = new AbortController()
    setState({ status: 'loading' })
    void fetch(endpoint, { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return response.json() as Promise<PluginPage>
    }).then(
      page => setState({ status: 'ready', page }),
      error => {
        if (!controller.signal.aborted) {
          setState({ status: 'error', message: error instanceof Error ? error.message : String(error) })
        }
      },
    )
    return () => controller.abort()
  }, [endpoint])

  return (
    <div className="dsh-hub-market">
      <style>{marketplaceStyles}</style>
      <header className="dsh-hub-header">
        <div className="dsh-hub-heading">
          <div className="dsh-hub-brand"><span className="dsh-hub-brand-dot" aria-hidden="true" />DSH HUB</div>
          <h2 className="dsh-hub-title">{dictionary.title}</h2>
          <p className="dsh-hub-copy">{dictionary.copy}</p>
        </div>
        <button className="dsh-hub-locale" type="button" aria-label={dictionary.language} onClick={() => setLocale(current => current === 'zh' ? 'en' : 'zh')}>
          {locale === 'zh' ? 'EN' : '中'}
        </button>
      </header>
      <div className="dsh-hub-scope">
        {(['verified', 'all'] as const).map(item => (
          <button
            key={item}
            type="button"
            className="dsh-hub-scope-button"
            data-active={scope === item}
            aria-pressed={scope === item}
            onClick={() => setScope(item)}
          >
            {item === 'verified' ? dictionary.verifiedScope : dictionary.allScope}
          </button>
        ))}
      </div>
      <form
        className="dsh-hub-search"
        onSubmit={event => {
          event.preventDefault()
          setSubmittedQuery(query.trim())
        }}
      >
        <div className="dsh-hub-search-field">
          <SearchIcon />
          <input
            type="search"
            value={query}
            placeholder={dictionary.searchPlaceholder}
            aria-label={dictionary.searchPlaceholder}
            onChange={event => setQuery(event.currentTarget.value)}
          />
        </div>
        <button className="dsh-hub-search-button" type="submit">{dictionary.search}</button>
      </form>
      <div className="dsh-hub-filters">
        {categories.map(item => (
          <button
            key={item}
            type="button"
            className="dsh-hub-filter"
            data-active={category === item}
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >
            {locale === 'en' ? englishCategories[item] : item}
          </button>
        ))}
      </div>
      {state.status === 'ready' ? (
        <div className="dsh-hub-results">
          <strong>{dictionary.results}</strong>
          <p className="dsh-hub-summary">{dictionary.repositories(state.page.total)}</p>
        </div>
      ) : null}
      {feedback !== null ? <p className="dsh-hub-status" role="status">{feedback}</p> : null}
      {state.status === 'loading' ? <p className="dsh-hub-status">{dictionary.loading}</p> : null}
      {state.status === 'error' ? <p className="dsh-hub-status" role="alert">{dictionary.error(state.message)}</p> : null}
      {state.status === 'ready' && state.page.items.length === 0 ? <p className="dsh-hub-status">{dictionary.empty}</p> : null}
      {state.status === 'ready' ? (
        <div className="dsh-hub-grid">
          {state.page.items.map(plugin => (
            <article className="dsh-hub-card" key={plugin.id}>
              <div className="dsh-hub-card-top">
                <p className="dsh-hub-owner">{plugin.owner}</p>
                <span className="dsh-hub-badge" data-verified={plugin.installability === 'verified'}>
                  {plugin.installability === 'verified' ? dictionary.verified : plugin.installability === 'candidate' ? dictionary.candidate : dictionary.topicOnly}
                </span>
              </div>
              <h3 className="dsh-hub-name">{plugin.name}</h3>
              <p className="dsh-hub-description">{plugin.description ?? dictionary.noDescription}</p>
              <div className="dsh-hub-meta">
                <span>{locale === 'en' ? englishCategories[plugin.category] ?? plugin.category : plugin.category}</span>
                <span>★ {plugin.stars}</span>
              </div>
              <div className="dsh-hub-actions">
                <a className="dsh-hub-details" href={`${HUB_URL}/plugins/${plugin.owner}/${plugin.name}?lang=${locale}`} target="_blank" rel="noreferrer">
                  {dictionary.details}<span className="dsh-hub-link-target" aria-hidden="true" />
                </a>
                <button
                  className="dsh-hub-install"
                  type="button"
                  disabled={sending === plugin.id || plugin.installability === 'unsupported'}
                  onClick={() => {
                    setSending(plugin.id)
                    setFeedback(null)
                    void install(plugin, locale).then(
                      () => setFeedback(dictionary.sent(plugin.fullName)),
                      error => setFeedback(error instanceof Error ? error.message : String(error)),
                    ).finally(() => setSending(null))
                  }}
                >
                  {plugin.installability === 'unsupported' ? dictionary.unsupported : sending === plugin.id ? dictionary.sending : dictionary.install}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  )
}

/** Register the DSH Hub marketplace as its own settings section. */
export function apply(ctx: ClientContext): void {
  const install = async (plugin: PluginSummary, locale: Locale): Promise<void> => {
    const current = ctx.sessions.list.getSnapshot().current
    if (current === undefined) throw new Error(messages[locale].noTask)
    const binding = ctx.sessions.binding(current)
    if (binding === undefined) throw new Error(messages[locale].unavailableTask)
    await binding.session.prompt([{ type: 'text', text: createInstallPrompt(plugin, locale) }], 'queue')
  }

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'dsh-hub',
    order: 16,
    label: 'DSH HUB 市场',
  }, () => <Marketplace install={install} />))
}

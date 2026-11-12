window.__ModuleLoader__.load({
	id: "dsh-hub",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/client.tsx
		const HUB_URL = "https://dsh-hub.cc";
		/** Services required by the native marketplace tab. */
		const inject = ["slots", "sessions"];
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
`;
		const categories = [
			"全部",
			"通信",
			"开发工具",
			"智能体",
			"搜索与知识",
			"界面",
			"记忆",
			"数据分析",
			"安全",
			"其他"
		];
		const englishCategories = {
			全部: "All",
			通信: "Communication",
			开发工具: "Developer tools",
			智能体: "Agents",
			搜索与知识: "Search and knowledge",
			界面: "Interface",
			记忆: "Memory",
			数据分析: "Data and analytics",
			安全: "Security",
			其他: "Other"
		};
		const messages = {
			zh: {
				title: "插件市场",
				copy: "浏览经过清单验证的社区插件，并把安装请求交给当前 DSH 任务执行。",
				language: "Switch to English",
				searchPlaceholder: "搜索插件、作者或标签",
				search: "搜索",
				verifiedScope: "DSH 插件",
				allScope: "Topic 仓库",
				results: "推荐插件",
				repositories: (count) => `${count} 个仓库`,
				loading: "正在读取 DSH Hub",
				error: (message) => `连接失败：${message}`,
				empty: "没有匹配的插件。",
				noDescription: "这个仓库还没有填写简介。",
				details: "详情",
				verified: "已验证",
				candidate: "验证中",
				topicOnly: "仅 Topic",
				unsupported: "不可直接安装",
				sending: "正在发送",
				install: "交给 DSH 安装",
				sent: (name) => `已把 ${name} 的安装请求发送给当前 DSH 任务。`,
				noTask: "请先打开一个 DSH 任务",
				unavailableTask: "当前 DSH 任务不可用"
			},
			en: {
				title: "Plugin Market",
				copy: "Browse manifest-verified community plugins and send install requests to your current DSH task.",
				language: "切换到中文",
				searchPlaceholder: "Search plugins, authors, or tags",
				search: "Search",
				verifiedScope: "DSH plugins",
				allScope: "Topic repositories",
				results: "Recommended plugins",
				repositories: (count) => `${count} repositories`,
				loading: "Loading DSH Hub",
				error: (message) => `Connection failed: ${message}`,
				empty: "No plugins match your filters.",
				noDescription: "This repository has no description yet.",
				details: "Details",
				verified: "Verified",
				candidate: "Checking",
				topicOnly: "Topic only",
				unsupported: "Direct install unavailable",
				sending: "Sending",
				install: "Install with DSH",
				sent: (name) => `Sent the install request for ${name} to the current DSH task.`,
				noTask: "Open a DSH task before installing",
				unavailableTask: "The current DSH task is unavailable"
			}
		};
		/** Build the direct install prompt sent to the active DSH task. */
		function createInstallPrompt(plugin, locale = "zh") {
			if (locale === "en") return `Install the DSH plugin ${plugin.fullName} by following ${HUB_URL}/install/${plugin.owner}/${plugin.name}.md?lang=en.`;
			return `请按照 ${HUB_URL}/install/${plugin.owner}/${plugin.name}.md 安装 DSH 插件 ${plugin.fullName}。`;
		}
		function SearchIcon() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				"aria-hidden": "true",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.8",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
					cx: "11",
					cy: "11",
					r: "6.5"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: "m16 16 4 4",
					strokeLinecap: "round"
				})]
			});
		}
		function Marketplace({ install }) {
			const [locale, setLocale] = (0, react.useState)(() => typeof navigator !== "undefined" && !navigator.language.toLocaleLowerCase().startsWith("zh") ? "en" : "zh");
			const dictionary = messages[locale];
			const [query, setQuery] = (0, react.useState)("");
			const [submittedQuery, setSubmittedQuery] = (0, react.useState)("");
			const [category, setCategory] = (0, react.useState)("全部");
			const [scope, setScope] = (0, react.useState)("verified");
			const [state, setState] = (0, react.useState)({ status: "loading" });
			const [sending, setSending] = (0, react.useState)(null);
			const [feedback, setFeedback] = (0, react.useState)(null);
			const endpoint = (0, react.useMemo)(() => {
				const params = new URLSearchParams({
					limit: "24",
					sort: "trending",
					scope
				});
				if (submittedQuery) params.set("q", submittedQuery);
				else params.set("recommendation", "true");
				if (category !== "全部") params.set("category", category);
				return `${HUB_URL}/api/v1/plugins?${params}`;
			}, [
				category,
				scope,
				submittedQuery
			]);
			(0, react.useEffect)(() => {
				const controller = new AbortController();
				setState({ status: "loading" });
				fetch(endpoint, { signal: controller.signal }).then(async (response) => {
					if (!response.ok) throw new Error(`HTTP ${response.status}`);
					return response.json();
				}).then((page) => setState({
					status: "ready",
					page
				}), (error) => {
					if (!controller.signal.aborted) setState({
						status: "error",
						message: error instanceof Error ? error.message : String(error)
					});
				});
				return () => controller.abort();
			}, [endpoint]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-hub-market",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("style", { children: marketplaceStyles }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
						className: "dsh-hub-header",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-hub-heading",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-hub-brand",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "dsh-hub-brand-dot",
										"aria-hidden": "true"
									}), "DSH HUB"]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
									className: "dsh-hub-title",
									children: dictionary.title
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: "dsh-hub-copy",
									children: dictionary.copy
								})
							]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							className: "dsh-hub-locale",
							type: "button",
							"aria-label": dictionary.language,
							onClick: () => setLocale((current) => current === "zh" ? "en" : "zh"),
							children: locale === "zh" ? "EN" : "中"
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-hub-scope",
						children: ["verified", "all"].map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "dsh-hub-scope-button",
							"data-active": scope === item,
							"aria-pressed": scope === item,
							onClick: () => setScope(item),
							children: item === "verified" ? dictionary.verifiedScope : dictionary.allScope
						}, item))
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("form", {
						className: "dsh-hub-search",
						onSubmit: (event) => {
							event.preventDefault();
							setSubmittedQuery(query.trim());
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-hub-search-field",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SearchIcon, {}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "search",
								value: query,
								placeholder: dictionary.searchPlaceholder,
								"aria-label": dictionary.searchPlaceholder,
								onChange: (event) => setQuery(event.currentTarget.value)
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							className: "dsh-hub-search-button",
							type: "submit",
							children: dictionary.search
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-hub-filters",
						children: categories.map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "dsh-hub-filter",
							"data-active": category === item,
							"aria-pressed": category === item,
							onClick: () => setCategory(item),
							children: locale === "en" ? englishCategories[item] : item
						}, item))
					}),
					state.status === "ready" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dsh-hub-results",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: dictionary.results }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "dsh-hub-summary",
							children: dictionary.repositories(state.page.total)
						})]
					}) : null,
					feedback !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dsh-hub-status",
						role: "status",
						children: feedback
					}) : null,
					state.status === "loading" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dsh-hub-status",
						children: dictionary.loading
					}) : null,
					state.status === "error" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dsh-hub-status",
						role: "alert",
						children: dictionary.error(state.message)
					}) : null,
					state.status === "ready" && state.page.items.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dsh-hub-status",
						children: dictionary.empty
					}) : null,
					state.status === "ready" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-hub-grid",
						children: state.page.items.map((plugin) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("article", {
							className: "dsh-hub-card",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-hub-card-top",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
										className: "dsh-hub-owner",
										children: plugin.owner
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "dsh-hub-badge",
										"data-verified": plugin.installability === "verified",
										children: plugin.installability === "verified" ? dictionary.verified : plugin.installability === "candidate" ? dictionary.candidate : dictionary.topicOnly
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
									className: "dsh-hub-name",
									children: plugin.name
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: "dsh-hub-description",
									children: plugin.description ?? dictionary.noDescription
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-hub-meta",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: locale === "en" ? englishCategories[plugin.category] ?? plugin.category : plugin.category }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: ["★ ", plugin.stars] })]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-hub-actions",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("a", {
										className: "dsh-hub-details",
										href: `${HUB_URL}/plugins/${plugin.owner}/${plugin.name}?lang=${locale}`,
										target: "_blank",
										rel: "noreferrer",
										children: [dictionary.details, /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "dsh-hub-link-target",
											"aria-hidden": "true"
										})]
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										className: "dsh-hub-install",
										type: "button",
										disabled: sending === plugin.id || plugin.installability === "unsupported",
										onClick: () => {
											setSending(plugin.id);
											setFeedback(null);
											install(plugin, locale).then(() => setFeedback(dictionary.sent(plugin.fullName)), (error) => setFeedback(error instanceof Error ? error.message : String(error))).finally(() => setSending(null));
										},
										children: plugin.installability === "unsupported" ? dictionary.unsupported : sending === plugin.id ? dictionary.sending : dictionary.install
									})]
								})
							]
						}, plugin.id))
					}) : null
				]
			});
		}
		/** Register the DSH Hub marketplace as its own settings section. */
		function apply(ctx) {
			const install = async (plugin, locale) => {
				const current = ctx.sessions.list.getSnapshot().current;
				if (current === void 0) throw new Error(messages[locale].noTask);
				const binding = ctx.sessions.binding(current);
				if (binding === void 0) throw new Error(messages[locale].unavailableTask);
				await binding.session.prompt([{
					type: "text",
					text: createInstallPrompt(plugin, locale)
				}], "queue");
			};
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "dsh-hub",
				order: 16,
				label: "DSH HUB 市场"
			}, () => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Marketplace, { install })));
		}
		//#endregion
		exports.apply = apply;
		exports.createInstallPrompt = createInstallPrompt;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map
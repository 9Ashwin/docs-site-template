"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { BrandLogo } from "./brand-logo";
import { Icon } from "./ui";
import { getThemeSnapshot, subscribeToTheme, toggleTheme } from "./theme";
import { siteNavigation, repositoryUrl, headerIcons } from "../../shared/header";
import siteConfig from "../../site.config.json";
import { siteBase, siteHref } from "./site";
import s from "./home.module.css";

/** Shared with the documentation header: same icon paths, same 24×24 grid. */
function HeaderIcon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={headerIcons[name]} />
    </svg>
  );
}

function ThemeToggle() {
  const dark = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => false);
  const label = dark ? "切换到浅色" : "切换到深色";
  return (
    <button className="mh-theme-toggle" type="button" role="switch" aria-checked={dark} aria-label={label} title={label} onClick={toggleTheme}>
      <HeaderIcon name={dark ? "moon" : "sun"} />
    </button>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLButtonElement>(null);
  return (
    <header
      className="mh-header"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          menu.current?.focus();
        }
      }}
    >
      <div className="mh-header-inner">
        <a className="mh-brand" href={`${siteBase}/`} target="_self" aria-label="回到首页">
          <BrandLogo priority />
          <span className="mh-brand-name">{siteConfig.name}</span>
        </a>
        <nav id="main-navigation" className={`mh-navigation ${open ? "is-open" : ""}`} aria-label="主导航" onClick={() => setOpen(false)}>
          {siteNavigation.map((item) => {
            if (item.children?.length) {
              return (
                <div key={item.href} className="mh-nav-menu">
                  <a href={siteHref(item.href)}>
                    {item.label}
                    {item.badge && <span className="mh-new-label">{item.badge}</span>}
                  </a>
                  <button type="button" className="mh-nav-caret" aria-label={`${item.label}栏目`}>
                    <HeaderIcon name="chevron" />
                  </button>
                  <div className="mh-nav-dropdown">
                    {item.children.map((child) => (
                      <a key={child.href} href={siteHref(child.href)}>
                        {child.label}
                      </a>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <a key={item.href} href={siteHref(item.href)}>
                {item.label}
                {item.badge && <span className="mh-new-label">{item.badge}</span>}
              </a>
            );
          })}
          <a className="mh-mobile-github" href={repositoryUrl} target="_blank" rel="noreferrer">
            GitHub <HeaderIcon name="external" />
          </a>
        </nav>
        <ThemeToggle />
        <a className="mh-header-github" href={repositoryUrl} target="_blank" rel="noreferrer">
          <HeaderIcon name="github" />
          <span>GitHub</span>
        </a>
        <button ref={menu} type="button" className="mh-menu-toggle" aria-label={open ? "关闭导航" : "打开导航"} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>
          <HeaderIcon name={open ? "close" : "menu"} />
        </button>
      </div>
    </header>
  );
}

/** Self-hosted install command with a copy control; the command is the README's. */
export function InstallCommand({ command, label = "自托管安装" }: { command: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be denied (insecure origin); the command stays selectable.
    }
  }
  return (
    <div className={s.install}>
      <div className={s.installBar}>
        <span>{label}</span>
        <button type="button" className={s.copyButton} onClick={copy} aria-label={copied ? "已复制安装命令" : "复制安装命令"}>
          <Icon name={copied ? "check" : "copy"} size={15} />
          {copied ? "已复制" : "复制"}
        </button>
      </div>
      <pre className={s.installCode}>
        <code>{command}</code>
      </pre>
    </div>
  );
}

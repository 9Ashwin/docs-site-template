import Image from "next/image";
import { BrandLogo } from "./brand-logo";
import { Icon } from "./ui";
import { siteBase, siteHref } from "./site";
import { repositoryUrl } from "../../shared/header";
import { WorkspaceGallery } from "./product-gallery";
import { Header } from "./interactive";
import { hero, trustItems, capabilities, gallerySlides, highlights, highlightList, install, docCards, footer } from "./content";
import s from "./home.module.css";

export default function Home() {
  return (
    <div className={s.site}>
      <a className={s.skipLink} href="#main">
        跳至正文
      </a>
      <Header />
      <main id="main">
        <section className={`${s.shell} ${s.hero}`} aria-labelledby="hero-title">
          <div className={s.heroGrid}>
            <h1 id="hero-title">
              {hero.title[0]}
              <br />
              <em>{hero.title[1]}</em>
            </h1>
            <div className={s.heroAside}>
              <p className={s.eyebrow}>{hero.eyebrow}</p>
              <p className={s.heroDescription}>{hero.description}</p>
              <div className={s.actions}>
                <a className={s.primary} href={hero.primary.href}>
                  {hero.primary.label} <Icon name="arrow" size={18} />
                </a>
                <a className={s.secondary} href={hero.secondary.href}>
                  {hero.secondary.label} <Icon name="arrow" size={18} />
                </a>
                <a className={s.githubButton} href={repositoryUrl} target="_blank" rel="noreferrer">
                  <Icon name="github" size={18} /> GitHub
                </a>
              </div>
              <p className={s.heroNote}>{hero.note}</p>
            </div>
          </div>
          <figure className={s.heroFigure}>
            <Image
              src={`${siteHref("/docs")}/_home/product/hero.png`}
              alt={hero.heroImage.alt}
              width={1600}
              height={900}
              priority
              sizes="(min-width: 1600px) 1520px, 100vw"
            />
            <figcaption className={s.heroCaption}>
              <span>{hero.heroImage.caption}</span>
              <span>Homepage · Docs</span>
            </figcaption>
          </figure>
          <div className={s.trustBar}>
            {trustItems.map((item) => (
              <span key={item.label}>
                <Icon name={item.icon} size={18} /> {item.label}
              </span>
            ))}
          </div>
        </section>

        <section id="capabilities" className={s.chapter} aria-labelledby="capabilities-title">
          <div className={s.shell}>
            <div className={s.sectionHeading}>
              <div>
                <p className={s.eyebrow}>01 / CAPABILITIES</p>
                <h2 id="capabilities-title">
                  写文档，
                  <br />
                  也管住质量。
                </h2>
              </div>
              <p>
                目录即导航，检查脚本兜底；
                <br />
                品牌样式两端共用。
              </p>
            </div>
            <div className={s.capGrid}>
              {capabilities.map((card) => (
                <article className={s.capCard} key={card.title}>
                  <div className={s.capTop}>
                    <span className={s.capIcon}>
                      <Icon name={card.icon} size={22} />
                    </span>
                    <span className={s.capIndex}>{card.index}</span>
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <ul className={s.tags}>
                    {card.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <a className={s.textLink} href={card.href}>
                    了解细节 <Icon name="arrow" size={17} />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="screenshots" className={`${s.chapter} ${s.chapterTint}`} aria-labelledby="screenshots-title">
          <div className={s.shell}>
            <div className={s.sectionHeading}>
              <div>
                <p className={s.eyebrow}>02 / SCREENSHOTS</p>
                <h2 id="screenshots-title">
                  截图跟着文档，
                  <br />
                  一起维护。
                </h2>
              </div>
              <p>
                首页与文档共用同一套图片；
                <br />
                点左侧条目切换。
              </p>
            </div>
            <WorkspaceGallery slides={gallerySlides} />
          </div>
        </section>

        <section id="highlights" className={s.chapter} aria-labelledby="highlights-title">
          <div className={s.shell}>
            <div className={s.sectionHeading}>
              <div>
                <p className={s.eyebrow}>03 / WHAT YOU GET</p>
                <h2 id="highlights-title">
                  两个应用，
                  <br />
                  一份部署产物。
                </h2>
              </div>
              <p>
                官网与文档共用一个域名、一次构建；
                <br />
                根路径或子路径都能部署。
              </p>
            </div>
            <div className={s.channelGrid}>
              <div className={s.channelCopy}>
                {highlights.map((item) => (
                  <div key={item.title}>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <a className={s.textLink} href={item.link.href} target={item.link.href.startsWith("http") ? "_blank" : undefined} rel={item.link.href.startsWith("http") ? "noreferrer" : undefined}>
                      {item.link.label} <Icon name="arrow" size={17} />
                    </a>
                  </div>
                ))}
              </div>
              <div className={s.channelPanel}>
                <div className={s.channelHeader}>
                  <div>
                    <strong>2</strong>
                    <span>个可独立开发的应用</span>
                  </div>
                  <span className={s.channelHeaderNote}>homepage/ + docs</span>
                </div>
                <div className={s.channelGroup}>
                  <h3>构建与检查</h3>
                  <ul className={s.channelList}>
                    {highlightList.map((item) => (
                      <li key={item.label}>
                        <span className={s.channelDot} aria-hidden="true" />
                        {item.label}：{item.value}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="deploy" className={s.chapter} aria-labelledby="deploy-title">
          <div className={s.shell}>
            <div className={s.sectionHeading}>
              <div>
                <p className={s.eyebrow}>04 / DEPLOY</p>
                <h2 id="deploy-title">{install.title}</h2>
              </div>
              <p>{install.description}</p>
            </div>
            <div className={s.hostGrid}>
              <div>
                <div className={s.install}>
                  <div className={s.installBar}>
                    <span>terminal</span>
                  </div>
                  <pre className={s.installCode}>
                    <code>{install.command}</code>
                  </pre>
                </div>
                <div className={s.linkRows}>
                  {install.links.map((link) => (
                    <a className={s.textLink} key={link.label} href={link.href} target="_blank" rel="noreferrer">
                      {link.label} <Icon name="external" size={17} />
                    </a>
                  ))}
                </div>
              </div>
              <dl className={s.deployList}>
                {install.facts.map((fact) => (
                  <div className={s.deployItem} key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section id="docs" className={`${s.chapter} ${s.chapterTint}`} aria-labelledby="docs-title">
          <div className={s.shell}>
            <div className={s.sectionHeading}>
              <div>
                <p className={s.eyebrow}>05 / DOCUMENTATION</p>
                <h2 id="docs-title">从这几页开始。</h2>
              </div>
              <p>
                快速开始、写作指南、开发说明与版本记录，
                <br />
                其余页面按自己的项目补。
              </p>
            </div>
            <div className={s.docGrid}>
              {docCards.map((card) => (
                <a className={s.docCard} href={card.href} key={card.title}>
                  <span className={s.docIcon}>
                    <Icon name={card.icon} size={21} />
                  </span>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                  <span className={s.docAction}>
                    打开 <Icon name="arrow" size={16} />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className={s.footer}>
        <div className={`${s.shell} ${s.footerInner}`}>
          <div className={s.footerBrand}>
            <a className="mh-brand" href={`${siteBase}/`} target="_self" aria-label="回到首页">
              <BrandLogo />
            </a>
            <p className={s.footerTagline}>{footer.tagline}</p>
          </div>
          <nav className={s.footerNav} aria-label="页脚导航">
            {footer.nav.map((item) => (
              <a key={item.label} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noreferrer" : undefined}>
                {item.label}
                {item.href.startsWith("http") && <Icon name="external" size={15} />}
              </a>
            ))}
          </nav>
        </div>
        <div className={`${s.shell} ${s.footerMeta}`}>
          <p>{footer.meta}</p>
          <p>
            <a href={`${siteHref("/docs")}/`}>文档</a> · <a href={repositoryUrl} target="_blank" rel="noreferrer">GitHub</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

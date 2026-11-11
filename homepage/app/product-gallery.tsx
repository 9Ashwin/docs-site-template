"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./ui";
import { homeAssets } from "./site";
import s from "./home.module.css";

export type GallerySlide = {
  /** Short label shown in the sidebar list. */
  name: string;
  icon: string;
  title: string;
  description: string;
  /** File name (without extension) under /docs/_home/product/. */
  image: string;
  alt: string;
  href: string;
  linkLabel?: string;
};

/** One screenshot per capability, switched from the list on the left. */
const STEP_MS = 5200;
const AUTO_ROUNDS = 2;

export function WorkspaceGallery({ slides }: { slides: GallerySlide[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [item, setItem] = useState(0);
  const [auto, setAuto] = useState(true);
  const [visible, setVisible] = useState(false);
  const [rounds, setRounds] = useState(0);
  const active = slides[item];
  const running = auto && visible;

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!running || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => {
      setItem((item + 1) % slides.length);
      setRounds((value) => value + 1);
    }, STEP_MS);
    return () => window.clearTimeout(timer);
  }, [running, item, rounds, slides.length]);

  useEffect(() => {
    if (rounds >= slides.length * AUTO_ROUNDS) setAuto(false);
  }, [rounds, slides.length]);

  function select(index: number) {
    setAuto(false);
    setItem(index);
  }

  return (
    <div ref={root} className={s.gallery}>
      <div className={s.galleryList} role="tablist" aria-label="产品界面截图" aria-orientation="vertical">
        {slides.map((slide, index) => (
          <button
            key={slide.name}
            type="button"
            role="tab"
            id={`gallery-tab-${index}`}
            aria-selected={index === item}
            aria-controls="gallery-panel"
            tabIndex={index === item ? 0 : -1}
            className={s.galleryItem}
            data-active={index === item}
            onClick={() => select(index)}
            onKeyDown={(event) => {
              if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
              event.preventDefault();
              const next = (index + (event.key === "ArrowDown" ? 1 : slides.length - 1)) % slides.length;
              select(next);
              document.getElementById(`gallery-tab-${next}`)?.focus();
            }}
          >
            <span className={s.galleryName}>
              <Icon name={slide.icon} size={16} />
              {slide.name}
            </span>
            <span className={s.galleryTitle}>{slide.title}</span>
            {auto && running && index === item && <span key={`${item}-${rounds}`} className={s.galleryProgress} aria-hidden="true" />}
          </button>
        ))}
      </div>
      <figure className={s.galleryFigure}>
        <div className={s.figureBar}>
          <span className={s.figureName}>
            <Icon name={active.icon} size={17} />
            {active.name}
          </span>
          <span className={s.figureMeta}>
            {String(item + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>
        </div>
        <div id="gallery-panel" className={s.galleryStage} role="tabpanel" aria-labelledby={`gallery-tab-${item}`}>
          {slides.map((slide, index) => (
            <div key={slide.image} className={s.galleryLayer} data-active={index === item} aria-hidden={index !== item}>
              <Image
                src={`${homeAssets}/product/${slide.image}.png`}
                alt={slide.alt}
                width={2780}
                height={1836}
                sizes="(min-width: 1100px) 62vw, 100vw"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
        <figcaption className={s.galleryCaption}>
          <p className={s.galleryDescription}>{active.description}</p>
          <a className={s.textLink} href={active.href}>
            {active.linkLabel ?? "查看文档"} <Icon name="arrow" size={17} />
          </a>
        </figcaption>
      </figure>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleHelp,
  Copy,
  Cpu,
  Code2,
  HardDrive,
  Menu,
  Search,
  Send,
  ShieldCheck,
  TerminalSquare,
  X,
  Zap,
} from "lucide-react";

const REPOSITORY_URL = "https://github.com/k00552684-spec/Project-ExyROMs-Restored";
const TELEGRAM_URL = "https://t.me/ExyROMs";
const SAMPLE_HASH = "e".repeat(64);

type Build = {
  id: string;
  name: string;
  android: 15 | 16 | 17 | null;
  category: "rom" | "tool";
  variant: "Vanilla" | "GApps" | "Utility";
  subtitle: string;
};

const seedBuilds: Build[] = [
  { id: "voltageos-42", name: "VoltageOS 4.2", android: 15, category: "rom", variant: "GApps", subtitle: "Featured sample" },
  { id: "lineageos-22", name: "LineageOS 22", android: 15, category: "rom", variant: "Vanilla", subtitle: "Featured sample" },
  { id: "matrixx-16", name: "Project Matrixx", android: 16, category: "rom", variant: "GApps", subtitle: "Featured sample" },
  { id: "evolution-x-106", name: "Evolution X 10.6", android: 15, category: "rom", variant: "GApps", subtitle: "Featured sample" },
  { id: "crdroid-11", name: "crDroid 11.x", android: 17, category: "rom", variant: "Vanilla", subtitle: "Featured sample" },
  { id: "pixelos-15", name: "PixelOS", android: 15, category: "rom", variant: "GApps", subtitle: "Featured sample" },
  { id: "everline-kernel", name: "Everline Kernel", android: null, category: "tool", variant: "Utility", subtitle: "Kernel · sample" },
  { id: "twrp-recovery", name: "TWRP Recovery", android: null, category: "tool", variant: "Utility", subtitle: "Recovery · sample" },
];

const builds: Build[] = [
  ...seedBuilds,
  ...Array.from({ length: 19 }, (_, index): Build => {
    const seed = seedBuilds[index % seedBuilds.length];
    const recordNumber = String(index + 9).padStart(2, "0");
    return {
      ...seed,
      id: `${seed.id}-demo-${recordNumber}`,
      subtitle: `Demo record ${recordNumber}`,
    };
  }),
];

const filters = ["All", "Android 17", "Android 16", "Android 15", "Tools"] as const;
type Filter = (typeof filters)[number];

const devices = [
  { name: "Galaxy M31", model: "SM-M315F", code: "m31" },
  { name: "Galaxy M21", model: "SM-M215F", code: "m21" },
  { name: "Galaxy F41", model: "SM-F415F", code: "f41" },
  { name: "Galaxy A51", model: "SM-A515F", code: "a51" },
];

const guideSteps = [
  {
    title: "Enter Download Mode",
    detail: "Connect the device with USB debugging enabled, then enter Download Mode.",
    lines: ["adb reboot download"],
  },
  {
    title: "Flash Recovery",
    detail: "Use the recovery and vbmeta files matched to your exact device and build.",
    lines: ["heimdall flash --RECOVERY recovery.img \\", "  --VBMETA vbmeta_disabled.img --no-reboot"],
  },
  {
    title: "Key Combo",
    detail: "Exit Download Mode with Vol Down + Power. As the screen goes black, switch to Vol Up + Power to enter recovery.",
    lines: ["# Vol Down + Power to exit Download Mode", "# Immediately switch to Vol Up + Power"],
  },
  {
    title: "Format & Sideload",
    detail: "Formatting data erases internal storage. Only sideload packages verified for your device.",
    lines: ["adb sideload rom.zip", "adb sideload gapps.zip"],
  },
];

const entrance = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [selectedId, setSelectedId] = useState(builds[0].id);
  const [activeStep, setActiveStep] = useState(0);
  const [copied, setCopied] = useState<"hash" | "guide" | null>(null);
  const [copyError, setCopyError] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleSearchShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleSearchShortcut);
    return () => window.removeEventListener("keydown", handleSearchShortcut);
  }, []);

  const filteredBuilds = useMemo(() => {
    const term = query.trim().toLowerCase();
    return builds.filter((build) => {
      const matchesFilter =
        filter === "All" ||
        (filter === "Tools" && build.category === "tool") ||
        (filter.startsWith("Android ") && build.android === Number(filter.slice(-2)));
      const matchesQuery =
        term.length === 0 ||
        `${build.name} ${build.subtitle} ${build.android ? `Android ${build.android}` : "tool utility"} ${build.variant}`
          .toLowerCase()
          .includes(term);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  const selectedBuild = builds.find((build) => build.id === selectedId) ?? builds[0];
  const visibleBuild = filteredBuilds.some((build) => build.id === selectedBuild.id)
    ? selectedBuild
    : filteredBuilds[0];
  const activeGuideStep = guideSteps[activeStep];

  async function copyToClipboard(value: string, target: "hash" | "guide") {
    setCopyError(false);
    try {
      await navigator.clipboard.writeText(value);
      setCopied(target);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopyError(true);
      window.setTimeout(() => setCopyError(false), 2400);
    }
  }

  function chooseFilter(nextFilter: Filter) {
    setFilter(nextFilter);
    const term = query.trim().toLowerCase();
    const firstMatch = builds.find((build) => {
      const matchesFilter =
        nextFilter === "All" ||
        (nextFilter === "Tools" && build.category === "tool") ||
        (nextFilter.startsWith("Android ") && build.android === Number(nextFilter.slice(-2)));
      const matchesQuery =
        term.length === 0 ||
        `${build.name} ${build.subtitle} ${build.android ? `Android ${build.android}` : "tool utility"} ${build.variant}`
          .toLowerCase()
          .includes(term);
      return matchesFilter && matchesQuery;
    });
    if (firstMatch) setSelectedId(firstMatch.id);
  }

  function updateQuery(nextQuery: string) {
    setQuery(nextQuery);
    const term = nextQuery.trim().toLowerCase();
    const firstMatch = builds.find((build) => {
      const matchesFilter =
        filter === "All" ||
        (filter === "Tools" && build.category === "tool") ||
        (filter.startsWith("Android ") && build.android === Number(filter.slice(-2)));
      const matchesQuery =
        term.length === 0 ||
        `${build.name} ${build.subtitle} ${build.android ? `Android ${build.android}` : "tool utility"} ${build.variant}`
          .toLowerCase()
          .includes(term);
      return matchesFilter && matchesQuery;
    });
    if (firstMatch) setSelectedId(firstMatch.id);
  }

  return (
    <>
      <header className="site-header">
        <div className="topbar mx-auto w-full max-w-7xl px-5 md:px-8">
          <a className="wordmark" href="#top" aria-label="Project ExyROMs home">
            <span className="wordmark-bracket">[</span>
            <span>ExyROMs</span>
            <span className="wordmark-bracket">]</span>
            <span className="wordmark-divider">//</span>
            <span className="wordmark-device">9611</span>
          </a>

          <button
            aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileNavOpen}
            className="mobile-menu-button"
            onClick={() => setMobileNavOpen((open) => !open)}
            type="button"
          >
            {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <nav className={`main-nav${mobileNavOpen ? " is-open" : ""}`} aria-label="Main navigation">
            <a href="#firmware" onClick={() => setMobileNavOpen(false)}>Firmware</a>
            <a href="#devices" onClick={() => setMobileNavOpen(false)}>Devices</a>
            <a href="#guide" onClick={() => setMobileNavOpen(false)}>Flashing Guide</a>
          </nav>

          <div className="header-actions">
            <a className="header-link" href={REPOSITORY_URL} rel="noreferrer" target="_blank">
              <Code2 size={15} strokeWidth={1.8} /> <span>GitHub</span> <ArrowUpRight size={13} />
            </a>
            <a className="header-link telegram-link" href={TELEGRAM_URL} rel="noreferrer" target="_blank">
              <Send size={14} strokeWidth={1.8} /> <span>Telegram</span> <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-grid" aria-hidden="true" />
          <motion.div
            className="hero-content mx-auto w-full max-w-7xl px-5 md:px-8"
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.55, ease: "easeOut" }}
            variants={entrance}
          >
            <div className="hero-copy">
              <div className="status-pill"><span className="status-dot" /> EVERLINE KERNEL: ACTIVE</div>
              <h1>Unleash Exynos.<span>Compile. Flash. Dominate.</span></h1>
              <p className="hero-lede">
                The definitive aftermarket firmware database for the Samsung Galaxy Exynos 9611 family.
                Passing Play Integrity, KSU-Next ready, and optimized for peak performance.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#firmware">Browse Firmware <ArrowRight size={16} /></a>
                <a className="button button-secondary" href="#guide">View Flashing Guide <ArrowDownToLine size={15} /></a>
              </div>
              <div className="hero-meta" aria-label="Project details">
                <span><Cpu size={14} /> EXYNOS 9611</span>
                <span><Activity size={14} /> ANDROID 13–17</span>
                <span><ShieldCheck size={14} /> COMMUNITY BUILDS</span>
              </div>
            </div>
            <div className="hero-readout" aria-label="Platform status readout">
              <div className="readout-top"><span>PLATFORM / 9611</span><span className="readout-live"><i /> LIVE</span></div>
              <div className="chip-illustration" aria-hidden="true">
                <div className="chip-lines" />
                <div className="chip-core"><Cpu size={54} strokeWidth={1.1} /><span>EXYNOS<br />9611</span></div>
                <div className="chip-orbit orbit-one" /><div className="chip-orbit orbit-two" />
              </div>
              <div className="readout-bottom"><span>4 × CORTEX-A73</span><span>10 NM FINFET</span></div>
              <div className="readout-footer"><span>BUILD CHANNEL</span><strong>UNIVERSAL9611</strong></div>
            </div>
          </motion.div>
          <div className="hero-edge-label">EXYNOS / AFTERMARKET ARCHITECTURE <span>01—04</span></div>
        </section>

        <section className="section-shell firmware-section mx-auto w-full max-w-7xl px-5 md:px-8" id="firmware">
          <motion.div className="section-heading" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={entrance} transition={{ duration: 0.4 }}>
            <div className="eyebrow"><span>01</span> COMMAND CENTER</div>
            <div className="section-heading-row">
              <div><h2>Firmware <span>database.</span></h2><p>Search the Exynos 9611 catalog and inspect a build profile.</p></div>
              <div className="build-count"><strong>27</strong><span>CATALOG RECORDS<br />SAMPLE DATA</span></div>
            </div>
          </motion.div>

          <div className="catalog-notice" role="note">
            <CircleHelp size={17} />
            <p><strong>Demo catalog.</strong> These records and the displayed sample checksum are illustrative, not verified firmware artifacts. The download link opens the project Telegram channel; confirm the exact model, package and checksum with the maintainer before flashing.</p>
          </div>

          <div className="command-center">
            <div className="catalog-panel panel-surface">
              <div className="catalog-tools">
                <label className="search-box">
                  <Search size={17} />
                  <input ref={searchInputRef} aria-label="Search firmware builds" onChange={(event) => updateQuery(event.target.value)} placeholder="Search 27+ builds..." type="search" value={query} />
                  <kbd>⌘ K</kbd>
                </label>
                <div className="filter-row" aria-label="Filter firmware builds">
                  {filters.map((option) => (
                    <button
                      aria-pressed={filter === option}
                      className={`filter-chip${filter === option ? " is-active" : ""}`}
                      key={option}
                      onClick={() => chooseFilter(option)}
                      type="button"
                    >{option}</button>
                  ))}
                </div>
              </div>
              <div className="list-heading"><span>BUILD NAME</span><span>CHANNEL / VERSION</span></div>
              <div className="build-list" role="listbox" aria-label="Firmware catalog">
                {filteredBuilds.map((build, index) => {
                  const isSelected = visibleBuild?.id === build.id;
                  return (
                    <button
                      aria-selected={isSelected}
                      className={`build-row${isSelected ? " is-selected" : ""}`}
                      key={build.id}
                      onClick={() => setSelectedId(build.id)}
                      role="option"
                      type="button"
                    >
                      <span className="build-index">{String(index + 1).padStart(2, "0")}</span>
                      <span className="build-copy"><strong>{build.name}</strong><small>{build.subtitle}</small></span>
                      <span className="build-version">{build.android ? `Android ${build.android}` : "Tool"}</span>
                      <ChevronRight className="build-chevron" size={15} />
                    </button>
                  );
                })}
                {filteredBuilds.length === 0 && <div className="empty-state"><Search size={20} /><strong>No builds found</strong><span>Try another name or filter.</span></div>}
              </div>
              <div className="catalog-footer"><span><span className="footer-live-dot" /> INDEX READY</span><span>{filteredBuilds.length} RESULTS</span></div>
            </div>

            <div className="inspector-panel panel-surface">
              {visibleBuild ? (
                <AnimatePresence mode="wait">
                  <motion.div key={visibleBuild.id} className="inspector-content" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
                    <div className="inspector-topline"><span className="eyebrow-inline"><Zap size={13} /> ACTIVE BUILD INSPECTOR</span><span className="demo-badge">DEMO / UNVERIFIED</span></div>
                    <div className="inspector-title-row">
                      <div><span className="build-kicker">UNIVERSAL9611 / {visibleBuild.category === "tool" ? "UTILITY" : `ANDROID ${visibleBuild.android}`}</span><h3>{visibleBuild.name}</h3></div>
                      <span className="variant-tag">{visibleBuild.variant}</span>
                    </div>
                    <p className="inspector-subtitle">{visibleBuild.subtitle} <span>·</span> Samsung Exynos 9611 family</p>
                    <div className="spec-grid">
                      <div className="spec-cell"><span><Cpu size={13} /> KERNEL</span><strong>4.14-Everline+</strong></div>
                      <div className="spec-cell"><span><ShieldCheck size={13} /> ROOT</span><strong>KSU-Next</strong></div>
                      <div className="spec-cell"><span><Activity size={13} /> MAINTAINER</span><strong>PARBINDAR7</strong></div>
                      <div className="spec-cell"><span><HardDrive size={13} /> SIZE</span><strong>~1.8 GB</strong></div>
                    </div>
                    <a className="download-button" href={TELEGRAM_URL} rel="noreferrer" target="_blank">
                      <ArrowDownToLine size={17} /> Download Package <ArrowUpRight className="download-external" size={15} />
                    </a>
                    <div className="hash-card">
                      <div className="hash-heading"><span><TerminalSquare size={14} /> SHA-256 / SAMPLE PLACEHOLDER</span><button aria-label="Copy illustrative sample checksum" className="icon-button" onClick={() => copyToClipboard(SAMPLE_HASH, "hash")} type="button">{copied === "hash" ? <Check size={15} /> : <Copy size={15} />}</button></div>
                      <code>{SAMPLE_HASH}</code>
                      <small>{copyError ? "Clipboard unavailable — select and copy the value." : copied === "hash" ? "Copied sample placeholder — not a package checksum." : "Illustrative only · not for package verification"}</small>
                    </div>
                    <div className="inspector-footnote"><ShieldCheck size={14} /> Verify model number and package integrity with the maintainer.</div>
                  </motion.div>
                </AnimatePresence>
              ) : <div className="empty-state"><Search size={20} /><strong>No selected build</strong></div>}
            </div>
          </div>
        </section>

        <section className="section-shell devices-section mx-auto w-full max-w-7xl px-5 md:px-8" id="devices">
          <div className="section-heading">
            <div className="eyebrow"><span>02</span> SUPPORTED HARDWARE</div>
            <div className="section-heading-row">
              <div><h2>One platform. <span>Four devices.</span></h2><p>Built around the Samsung Galaxy Exynos 9611 family.</p></div>
              <span className="supported-summary"><span className="status-dot" /> 4 DEVICE TARGETS</span>
            </div>
          </div>
          <div className="device-grid">
            {devices.map((device, index) => (
              <motion.article className="device-card panel-surface" key={device.code} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={entrance} transition={{ duration: 0.35, delay: index * 0.06 }}>
                <div className="device-card-top"><span className="device-number">0{index + 1} / {device.code.toUpperCase()}</span><span className="supported-badge"><i /> Supported</span></div>
                <div className="device-graphic" aria-hidden="true"><div className="device-outline"><div className="device-screen"><div className="screen-mark">EXY<br /><b>9611</b></div></div><span className="device-side-button" /></div><span className="device-graphic-label">MOB / {device.model}</span></div>
                <div className="device-name">{device.name}</div>
                <div className="device-model">{device.model}</div>
                <div className="device-rule" />
                <div className="device-maintainer"><span>Maintainer: PARBINDAR7</span><span>Android 13–17</span></div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="section-shell guide-section mx-auto w-full max-w-7xl px-5 md:px-8" id="guide">
          <div className="section-heading">
            <div className="eyebrow"><span>03</span> FIELD MANUAL</div>
            <div className="section-heading-row">
              <div><h2>Deployment <span>protocol.</span></h2><p>A four-step overview. Always follow build-specific instructions from its maintainer.</p></div>
              <div className="guide-label"><TerminalSquare size={15} /> INTERACTIVE GUIDE</div>
            </div>
          </div>
          <div className="guide-grid">
            <div className="stepper-panel">
              <div className="stepper-line" aria-hidden="true" />
              {guideSteps.map((step, index) => (
                <button aria-current={activeStep === index ? "step" : undefined} className={`step-button${activeStep === index ? " is-active" : ""}`} key={step.title} onClick={() => setActiveStep(index)} type="button">
                  <span className="step-number">0{index + 1}</span>
                  <span className="step-copy"><strong>{step.title}</strong><small>{step.detail}</small></span>
                  <ChevronRight className="step-chevron" size={16} />
                </button>
              ))}
            </div>
            <div className="terminal-panel panel-surface">
              <div className="terminal-topbar"><div className="terminal-dots"><i /><i /><i /></div><span>EXYROM / TERMINAL — STEP 0{activeStep + 1}</span><span className="terminal-shell">BASH</span></div>
              <div className="terminal-code" aria-live="polite">
                <div className="terminal-comment"># {activeGuideStep.title.toUpperCase()}</div>
                {activeGuideStep.lines.map((line, index) => <div className="terminal-line" key={`${line}-${index}`}><span className="terminal-prompt">{line.startsWith("#") ? "" : "$"}</span><code className={line.startsWith("#") ? "code-comment" : ""}>{line.replace(/^#\s?/, "")}</code></div>)}
                <p className="terminal-note">{activeGuideStep.detail}</p>
              </div>
              <div className="terminal-actions"><span>USE COMMANDS ONLY FOR A VERIFIED BUILD</span><button className="copy-button" onClick={() => copyToClipboard(activeGuideStep.lines.join("\n"), "guide")} type="button">{copied === "guide" ? <Check size={14} /> : <Copy size={14} />}{copyError ? "Clipboard unavailable" : copied === "guide" ? "Copied" : "Copy"}</button></div>
            </div>
          </div>
          <div className="safety-note"><ShieldCheck size={17} /><p><strong>Before flashing:</strong> Back up your data and verify the device model, bootloader state, package and recovery instructions. Formatting data erases internal storage; incorrect images or steps may permanently damage your device.</p></div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner mx-auto w-full max-w-7xl px-5 md:px-8">
          <a className="wordmark footer-wordmark" href="#top"><span className="wordmark-bracket">[</span><span>ExyROMs</span><span className="wordmark-bracket">]</span><span className="wordmark-divider">//</span><span className="wordmark-device">9611</span></a>
          <p>Community-built firmware index <span>·</span> Verify every package before flashing.</p>
          <div className="footer-links"><a href={REPOSITORY_URL} rel="noreferrer" target="_blank"><Code2 size={15} /> GitHub</a><a href={TELEGRAM_URL} rel="noreferrer" target="_blank"><Send size={14} /> Telegram</a></div>
          <span className="footer-copy">© {new Date().getFullYear()} PROJECT EXYROMS</span>
        </div>
      </footer>
    </>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import AISearchInput from "@/components/home/AISearchInput";
import { useChatSession } from "@/context/ChatSessionContext";

import VeselaLogoWhite from "../../../public/vesela_white_lottie.json";

function HeroBackgroundVideo() {
  const vid1Ref = useRef(null);
  const vid2Ref = useRef(null);
  const heroMediaRef = useRef(null);

  useEffect(() => {
    const v1 = vid1Ref.current;
    const v2 = vid2Ref.current;
    const heroMedia = heroMediaRef.current;
    if (!v1 || !v2) return;

    let fading = false;
    let active = 0;
    const videos = [v1, v2];
    const fadeSeconds = 3.2;

    videos.forEach((video) => {
      video.muted = true;
      video.playsInline = true;
      video.preload = "auto";
    });

    let animationFrameId;

    const watch = () => {
      const current = videos[active];
      if (!fading && Number.isFinite(current.duration) && current.duration - current.currentTime <= fadeSeconds) {
        fading = true;
        const nextIndex = active === 0 ? 1 : 0;
        const next = videos[nextIndex];
        next.currentTime = 0;
        next.play().catch(() => {});
        heroMedia?.classList.add("is-crossfading");
        next.classList.remove("is-hidden");
        current.classList.add("is-hidden");

        setTimeout(() => {
          current.pause();
          current.currentTime = 0;
          active = nextIndex;
          heroMedia?.classList.remove("is-crossfading");
          setTimeout(() => {
            fading = false;
          }, 900);
        }, fadeSeconds * 1000);
      }
      animationFrameId = requestAnimationFrame(watch);
    };

    videos[0].play().catch(() => {});
    animationFrameId = requestAnimationFrame(watch);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={heroMediaRef} className="hero-media" aria-hidden="true">
      <video ref={vid1Ref} className="hero-video" src="/hero-video-2.mp4" muted playsInline preload="auto"></video>
      <video ref={vid2Ref} className="hero-video is-hidden" src="/hero-video-2.mp4" muted playsInline preload="auto"></video>
      <div className="hero-loop-veil"></div>
      <div className="hero-overlay"></div>
      <div className="hero-grain"></div>
    </div>
  );
}

function HeroLogoLottie() {
  const lottieRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (lottieRef.current) {
        lottieRef.current.play();
      }
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="hero-logo" aria-label="Vesela">
      <Lottie
        lottieRef={lottieRef}
        animationData={VeselaLogoWhite}
        loop={false}
        autoplay={false}
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      />
    </div>
  );
}

export default function HomePageContent() {
  const router = useRouter();
  const { setPendingHeroMessage } = useChatSession();

  const handleSearch = (message) => {
    if (message) {
      setPendingHeroMessage(message);
    }
    router.push("/chat");
  };

  useEffect(() => {
    // Reveal animation intersection observer
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

    // Monologue/word wrapping observer
    const wrapHeadingWords = (heading) => {
      let index = 0;
      const visit = (node) => {
        [...node.childNodes].forEach((child) => {
          if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
            const fragment = document.createDocumentFragment();
            child.textContent.split(/(\s+)/).forEach((part) => {
              if (!part.trim()) return fragment.appendChild(document.createTextNode(part));
              const span = document.createElement("span");
              span.className = "heading-word";
              span.style.setProperty("--word-index", index++);
              span.textContent = part;
              fragment.appendChild(span);
            });
            child.replaceWith(fragment);
          } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== "BR") {
            visit(child);
          }
        });
      };
      visit(heading);
    };

    const animatedHeadings = [...document.querySelectorAll("h1, h2, h3")];
    animatedHeadings.forEach(wrapHeadingWords);

    const headingObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("heading-words-visible", entry.isIntersecting);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -12% 0px" }
    );
    animatedHeadings.forEach((heading) => headingObserver.observe(heading));

    return () => {
      revealObserver.disconnect();
      headingObserver.disconnect();
    };
  }, []);

  return (
    <main id="main">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {/* Hero Section */}
      <section className="hero" aria-labelledby="hero-title">
        <HeroBackgroundVideo />
        <div className="hero-content">
          <HeroLogoLottie />
          <h1 id="hero-title">
            Everyone's building AI that knows everything. We're interested in AI that <em>knows you.</em>
          </h1>
          <p className="hero-sub">
            A human connection expert designed to deepen your thinking—not replace it.
          </p>
          <AISearchInput onSearch={handleSearch} />
        </div>
        <div className="hero-meta">
          <span>Human alignment AI / 2026</span>
          <span>Made by Gray Sky AI</span>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section" id="philosophy">
        <div className="section-inner intro-grid">
          <div className="reveal">
            <p className="eyebrow">01 / A different objective</p>
            <h2 className="display">
              Built around <span className="serif">who you are,</span>
              <br />
              not just what you ask.
            </h2>
          </div>
          <div className="intro-copy reveal">
            <p className="lead">
              Most AI is optimized for output. Vesela is optimized for what happens to you after the
              conversation: more clarity, more agency, and a stronger sense of your own voice.
            </p>
            <div className="rule"></div>
            <p style={{ color: "var(--muted)", lineHeight: 1.65 }}>
              This is human alignment AI—a shift from delivering answers to drawing forward the
              insight already taking shape within you.
            </p>
            <a className="text-link" href="https://humanalignmentai.com" target="_blank" rel="noopener noreferrer">
              Explore the framework <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* Experience / Principles Section */}
      <section className="section principles" id="experience">
        <div className="section-inner">
          <div className="section-heading-row reveal">
            <div>
              <p className="eyebrow">02 / The experience</p>
              <h2 className="display sm">
                Less monologue.
                <br />
                More <span className="serif">momentum.</span>
              </h2>
            </div>
            <p className="section-note">
              A conversation should leave you more capable than when it began. These principles
              shape every interaction.
            </p>
          </div>
          <div className="principle-grid reveal">
            <article className="principle">
              <span className="principle-num">01 / LOCATE</span>
              <h3>It meets you where you actually are.</h3>
              <p>
                Before rushing to an answer, Vesela pays attention to the shape of the question—and
                the person asking it.
              </p>
            </article>
            <article className="principle">
              <span className="principle-num">02 / REMEMBER</span>
              <h3>Continuity, without starting over.</h3>
              <p>
                With Pro memory, your context carries forward so each conversation can begin deeper
                than the last.
              </p>
            </article>
            <article className="principle">
              <span className="principle-num">03 / STRENGTHEN</span>
              <h3>Your judgment remains the point.</h3>
              <p>
                Vesela offers the right amount of challenge and support while keeping authorship
                where it belongs—with you.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Conversation Section */}
      <section className="section conversation">
        <div className="section-inner conversation-grid">
          <div className="reveal">
            <p className="eyebrow">03 / A better mirror</p>
            <h2 className="display sm">
              Answers are useful.
              <br />
              The right <span className="serif">question</span>
              <br />
              can change you.
            </h2>
          </div>
          <div className="chat reveal" aria-label="Example conversation">
            <div className="bubble user">
              <span className="bubble-label">You</span>I know what the sensible decision is. I just
              can't make myself choose it.
            </div>
            <div className="bubble ai">
              <span className="bubble-label">Vesela</span>When you call it "sensible," whose standard
              are you using?
            </div>
            <div className="bubble user">
              <span className="bubble-label">You</span>That's… probably the real question.
            </div>
            <div className="bubble ai" aria-label="Vesela is listening">
              <span className="bubble-label">Listening</span>
              <span className="typing">
                <i></i>
                <i></i>
                <i></i>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Proof Section */}
      <section className="section" id="proof">
        <div className="section-inner">
          <div className="section-heading-row reveal">
            <div>
              <p className="eyebrow">04 / Measured differently</p>
              <h2 className="display sm">
                Humanity is the <span className="serif">benchmark.</span>
              </h2>
            </div>
            <p className="section-note">Capability matters. So does what that capability is for.</p>
          </div>
          <div className="proof-grid reveal">
            <div className="proof-copy">
              <p className="lead">
                Vesela 3 leads the Sovereign Human Benchmark—a test of whether an AI strengthens human
                agency rather than absorbing it.
              </p>
              <div className="score">
                <strong>69</strong>
                <span>
                  Vesela 3
                  <br />
                  Sovereign Human Benchmark leader
                </span>
              </div>
            </div>
            <figure className="benchmark-frame">
              <img
                src="/assets/shb-image.jpg"
                alt="Updated Sovereign Human Benchmark chart with Vesela 3 ranked first at 69"
              />
            </figure>
          </div>
          <div className="proof-foot">
            <span>Vesela 3 / 69 &nbsp;·&nbsp; Ranked #1</span>
            <a className="text-link" href="https://humanitybench.org" target="_blank" rel="noopener noreferrer">
              View Humanity Bench <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="section download" id="download">
        <div className="section-inner download-grid">
          <div className="download-copy reveal">
            <p className="eyebrow">05 / Take it with you</p>
            <h2 className="display sm">
              A thoughtful conversation, <span className="serif">wherever life happens.</span>
            </h2>
            <div className="store-buttons">
              <a
                className="store-button"
                href="https://apps.apple.com/us/app/vesela/id6738156659"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download Vesela on the App Store"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.05 12.54c-.03-3.1 2.54-4.61 2.66-4.68a5.73 5.73 0 0 0-4.5-2.43c-1.89-.2-3.73 1.13-4.69 1.13-.98 0-2.46-1.11-4.06-1.08A5.97 5.97 0 0 0 1.43 8.55c-2.18 3.78-.55 9.33 1.53 12.39 1.04 1.5 2.25 3.17 3.84 3.11 1.56-.06 2.15-1 4.03-1s2.42 1 4.05.96c1.67-.03 2.72-1.5 3.72-3.01a12.3 12.3 0 0 0 1.7-3.47 5.36 5.36 0 0 1-3.25-4.99ZM13.97 3.42A5.46 5.46 0 0 0 15.22-.5a5.58 5.58 0 0 0-3.61 1.86 5.2 5.2 0 0 0-1.28 3.78 4.6 4.6 0 0 0 3.64-1.72Z" />
                </svg>
                <span>
                  <small>Download on the</small>
                  <b>App Store</b>
                </span>
              </a>
              <a
                className="store-button"
                href="https://play.google.com/store/apps/details?id=com.grayskyai.graceai&amp;hl=en_US"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get Vesela on Google Play"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3.18 1.18a2 2 0 0 0-.68 1.5v18.64a2 2 0 0 0 .68 1.5l10.27-10.82L3.18 1.18Zm11.63 12.25-2.16-2.27L4.4 2.48l12.23 7.02-1.82 3.93Zm-10.4 8.09 8.24-8.68 2.16-2.27 1.82 3.93L4.41 21.52Zm13.47-11.3 2.86 1.64c.69.39.69 1.11 0 1.5L17.88 15l-2.06-2.17 2.06-2.61Z" />
                </svg>
                <span>
                  <small>Get it on</small>
                  <b>Google Play</b>
                </span>
              </a>
            </div>
          </div>
          <aside className="download-aside reveal">
            <strong>Start free.</strong>
            Twenty messages each day with Vesela Mini. Upgrade when you want unlimited
            conversations, lasting memory, and our state-of-the-art model.
            <br />
            <br />
            <Link className="text-link" href="/pricing">
              Compare plans <span>→</span>
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}

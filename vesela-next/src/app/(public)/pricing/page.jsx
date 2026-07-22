"use client";

import { useEffect } from "react";
import Link from "next/link";
import Lottie from "lottie-react";
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/context/ModalContext";
import { MODALS } from "@/components/modals/modalConstants";
import { useColorMode } from "@/theme/ThemeRegistry";

import VeselaLogoBlack from "../../../../public/vesela_black_lottie.json";
import VeselaLogoWhite from "../../../../public/vesela_white_lottie.json";

export default function PricingPage() {
  const { mode } = useColorMode();
  const { plan: currentPlan, isAuthenticated } = useAuth();
  const { openModal } = useModal();

  const isLightMode = mode === "light";
  const logoData = isLightMode ? VeselaLogoBlack : VeselaLogoWhite;

  useEffect(() => {
    // Reveal animations
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

    // Word wrap animation observer
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

  const handleProSelect = () => {
    if (isAuthenticated) {
      window.open("https://buy.stripe.com/5kQ8wPdcV75TfOrf3b24007", "_blank", "noopener,noreferrer");
    } else {
      openModal(MODALS.SIGNUP, { source: "public" });
    }
  };

  const handleFreeSelect = () => {
    if (isAuthenticated) {
      window.location.href = "/chat";
    } else {
      openModal(MODALS.LOGIN, { source: "public" });
    }
  };

  const isPro = isAuthenticated && currentPlan === "pro";

  return (
    <main id="main">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {/* Pricing Hero */}
      <section className="pricing-hero">
        <div className="pricing-hero-inner">
          <div className="reveal">
            <p className="eyebrow">A plan for every conversation</p>
            <div className="pricing-title-logo">
              <Lottie
                animationData={logoData}
                loop={false}
                style={{ width: "100%", height: "100%", overflow: "visible" }}
              />
            </div>
          </div>
          <div className="reveal">
            <h1 className="display sm">
              Start with curiosity.
              <br />
              <span className="serif">Stay for continuity.</span>
            </h1>
            <p className="lead" style={{ marginTop: "28px" }}>
              Try the human connection expert free, or unlock the full model and a memory that grows with you.
            </p>
          </div>
        </div>
      </section>

      {/* Plans comparison cards */}
      <section className="section price-section" id="plans">
        <div className="section-inner">
          <div className="price-grid reveal">
            {/* Free Tier */}
            <article className="price-card">
              <div className="tier-head">
                <div>
                  <span className="tier-kicker">For beginning</span>
                  <h2>Mini</h2>
                </div>
                <span className="tier-kicker">Free</span>
              </div>
              <div className="price">
                <sup>$</sup>0 <small>/ month</small>
              </div>
              <ul className="feature-list">
                <li>20 messages per day</li>
                <li>Vesela Mini model</li>
                <li>Human connection expert</li>
                <li>No day-to-day memory</li>
              </ul>
              <button
                type="button"
                className="button"
                onClick={handleFreeSelect}
                disabled={isAuthenticated && currentPlan === "free"}
              >
                {isAuthenticated && currentPlan === "free" ? "Current Plan" : "Start free"} <span className="arrow">→</span>
              </button>
            </article>

            {/* Pro Tier */}
            <article className="price-card featured">
              <div className="tier-head">
                <div>
                  <span className="tier-kicker">For continuity</span>
                  <h2>Pro</h2>
                </div>
                <span className="tier-kicker">Full experience</span>
              </div>
              <div className="price">
                <sup>$</sup>18.99 <small>/ month</small>
              </div>
              <ul className="feature-list">
                <li>Unlimited usage</li>
                <li>Memory included</li>
                <li>State-of-the-art Vesela model</li>
                <li>Vesela 3 — Humanity Bench leader</li>
              </ul>
              <button
                type="button"
                className="button"
                onClick={handleProSelect}
                disabled={isPro}
              >
                {isPro ? "Current Plan" : "Choose Pro"} <span className="arrow">→</span>
              </button>
            </article>
          </div>
          <p className="pricing-note">
            Subscriptions are managed through the Vesela mobile app or Stripe portal. Store terms may apply.
          </p>
        </div>
      </section>

      {/* Side by side comparison */}
      <section className="section">
        <div className="section-inner">
          <div className="section-heading-row reveal">
            <div>
              <p className="eyebrow">Side by side</p>
              <h2 className="display sm">
                Choose your <span className="serif">depth.</span>
              </h2>
            </div>
            <p className="section-note">
              Both plans begin with the same commitment: technology that serves the person using it.
            </p>
          </div>
          <div className="comparison reveal">
            <table>
              <thead>
                <tr>
                  <th>Capability</th>
                  <th>Mini</th>
                  <th>Pro</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Human connection expertise</td>
                  <td>Included</td>
                  <td>Included</td>
                </tr>
                <tr>
                  <td>Daily conversations</td>
                  <td>20 messages</td>
                  <td>Unlimited</td>
                </tr>
                <tr>
                  <td>Day-to-day memory</td>
                  <td>—</td>
                  <td>Included</td>
                </tr>
                <tr>
                  <td>Model</td>
                  <td>Smaller model</td>
                  <td>Vesela 3 / State of the art</td>
                </tr>
                <tr>
                  <td>Humanity Bench</td>
                  <td>Included</td>
                  <td>69 / Leader</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="section pricing-cta">
        <div className="section-inner reveal">
          <p className="eyebrow">The conversation is yours</p>
          <h2 className="display sm">
            AI should help you become <span className="serif">more yourself.</span>
          </h2>
          <button type="button" className="button primary" onClick={handleFreeSelect}>
            Get Vesela <span className="arrow">↗</span>
          </button>
        </div>
      </section>
    </main>
  );
}

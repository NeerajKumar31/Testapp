"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function LandingPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className={`landing ${ready ? "ready" : ""}`}>
      <div className="landing-atmosphere" aria-hidden>
        <div className="grain" />
        <div className="wash" />
        <div className="plan-lines" />
      </div>

      <header className="landing-nav">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden />
          <span>
            <strong>Hearth</strong>
            <em>Dream Home Agent</em>
          </span>
        </div>
        <Link href="/studio" className="btn-primary nav-cta">
          Open studio
        </Link>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="hero-brand">Hearth</p>
          <h1>Design the home you keep imagining.</h1>
          <p className="hero-lede">
            Sketch rooms by hand, or describe them in plain language. When the
            model feels right, step inside and shape the interiors.
          </p>
          <div className="hero-actions">
            <Link href="/studio" className="btn-primary">
              Start designing
            </Link>
            <a href="#how" className="btn-ghost light">
              How it works
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-hidden>
          <div className="house-stage">
            <div className="floorplate" />
            <div className="room r1" />
            <div className="room r2" />
            <div className="room r3" />
            <div className="room r4" />
            <div className="glow" />
          </div>
        </div>
      </section>

      <section id="how" className="how">
        <h2>Three ways to build</h2>
        <p className="section-lede">
          One studio. Structure first, then atmosphere.
        </p>
        <ol className="steps">
          <li>
            <span>01</span>
            <h3>Prompt</h3>
            <p>
              Tell Hearth the bedrooms, baths, and style you want. It lays out a
              3D floor plan you can keep refining.
            </p>
          </li>
          <li>
            <span>02</span>
            <h3>Manual</h3>
            <p>
              Place living rooms, kitchens, and bedrooms yourself — size them,
              slide them, tint walls and floors.
            </p>
          </li>
          <li>
            <span>03</span>
            <h3>Interior</h3>
            <p>
              After the model is complete, furnish rooms by hand or ask for a
              Scandinavian, coastal, or industrial mood.
            </p>
          </li>
        </ol>
      </section>

      <footer className="landing-footer">
        <p>Hearth — AI agent for dream home models & interiors</p>
        <Link href="/studio">Enter studio →</Link>
      </footer>
    </div>
  );
}

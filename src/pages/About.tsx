import React from 'react';
import Footer from '../components/Footer';
import { ABOUT_PILLARS } from '../site-content';

const About: React.FC = () => {
  return (
    <div className="relative">
      <section className="page-shell pt-36 md:pt-44">
        <div
          className="enter-after-nav mx-auto max-w-3xl text-center"
          style={{ ['--enter-delay' as string]: '0.42s' }}
        >
          <span className="eyebrow mx-auto">About</span>
          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-[color:var(--color-text)] md:text-6xl">
            About Olvara Labs
          </h1>
          <p className="mt-5 text-lg leading-8 text-[color:var(--color-text-muted)]">
            Building modern cybersecurity tools with a cleaner and more deliberate public presence.
          </p>
        </div>
      </section>

      <section className="page-shell grid gap-6 py-14 md:grid-cols-3">
        {ABOUT_PILLARS.map((pillar, index) => (
          <article
            key={pillar.title}
            className="enter-after-nav panel px-6 py-6"
            style={{ ['--enter-delay' as string]: `${0.54 + index * 0.08}s` }}
          >
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[color:var(--color-text)]">{pillar.title}</h2>
            <p className="mt-4 text-base leading-8 text-[color:var(--color-text-muted)]">{pillar.description}</p>
          </article>
        ))}
      </section>

      <Footer />
    </div>
  );
};

export default About;

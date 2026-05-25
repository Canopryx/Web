import React from 'react';
import Footer from '../components/Footer';
import { PRODUCT_CARDS } from '../site-content';

interface ProductCardProps {
  title: string;
  status: string;
  description: string;
  accent: string;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, status, description, accent, index }) => (
  <article
    className="enter-after-nav panel relative flex h-full flex-col overflow-hidden px-7 py-7 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(16,82,51,0.1)]"
    style={{
      ['--enter-delay' as string]: `${0.54 + index * 0.08}s`,
    }}
  >
    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} />
    <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[color:var(--color-text)]">{title}</h2>
    <p className="mt-4 flex-1 text-base leading-8 text-[color:var(--color-text-muted)]">{description}</p>
    <div className="mt-8 inline-flex w-max items-center rounded-full border border-[color:var(--color-primary)]/15 bg-[color:var(--color-primary)]/8 px-4 py-2 text-sm font-semibold text-[color:var(--color-primary)]">
      <span className="mr-2 h-2 w-2 rounded-full bg-[color:var(--color-primary)]" />
      {status}
    </div>
  </article>
);

const Products: React.FC = () => {
  return (
    <div className="relative">
      <section className="page-shell pt-36 md:pt-44">
        <div
          className="enter-after-nav mx-auto max-w-3xl text-center"
          style={{ ['--enter-delay' as string]: '0.42s' }}
        >
          <span className="eyebrow mx-auto">Product Lineup</span>
          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-[color:var(--color-text)] md:text-6xl">
            Our Products
          </h1>
          <p className="mt-5 text-lg leading-8 text-[color:var(--color-text-muted)]">
            A focused set of security tools, with more to come.
          </p>
        </div>
      </section>

      <section className="page-shell grid gap-6 py-14 md:grid-cols-3">
        {PRODUCT_CARDS.map((card, idx) => (
          <ProductCard
            key={card.title}
            index={idx}
            title={card.title}
            status={card.status}
            description={card.description}
            accent={card.accent}
          />
        ))}
      </section>

      <Footer />
    </div>
  );
};

export default Products;

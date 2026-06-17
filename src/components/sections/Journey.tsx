import { SectionWrapper, SectionHeading } from '../layout/SectionWrapper';
import { usePortfolio } from '../../context/PortfolioContext';

export function Journey() {
  const { data } = usePortfolio();
  const journey = data.journey;

  return (
    <SectionWrapper id="journey" className="bg-cream" label="My journey">
      <SectionHeading
        eyebrow="How I got here"
        title="My journey."
        description="From algorithms on a whiteboard to shipping real products — deliberate learning, one year at a time."
      />

      {journey.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-ash text-sm italic">
            No journey items yet. Add them in the{' '}
            <a href="/dashboard" className="text-rose hover:text-roseDeep underline">
              Dashboard
            </a>.
          </p>
        </div>
      ) : (
        <div className="relative max-w-2xl">
          {/* Vertical spine */}
          <div
            className="absolute left-[27px] top-4 bottom-4 w-px bg-gradient-to-b from-petal via-roseMist to-petal"
            aria-hidden="true"
          />

          <ol className="space-y-0">
            {journey.map((item, idx) => (
              <li key={item.year} className="relative flex gap-8 pb-12 last:pb-0">
                {/* Year badge + dot */}
                <div className="relative flex flex-col items-center w-14 shrink-0">
                  <div className="w-[54px] h-[54px] rounded-full bg-petal border-2 border-roseMist flex items-center justify-center z-10 relative">
                    <span className="font-mono text-xs font-semibold text-roseDeep">{item.year}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="pt-3 pb-2">
                  <h3 className="font-display text-xl text-charcoal mb-2">{item.title}</h3>
                  <p className="text-slate text-sm leading-relaxed">{item.description}</p>
                  {idx === journey.length - 1 && (
                    <span className="inline-block mt-3 text-xs font-mono text-rose tracking-widest uppercase">
                      Currently here
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </SectionWrapper>
  );
}


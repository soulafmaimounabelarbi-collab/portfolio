import { SectionWrapper, SectionHeading } from '../layout/SectionWrapper';
import { usePortfolio } from '../../context/PortfolioContext';

export function Stack() {
  const { data } = usePortfolio();
  const stack = data.stack;

  return (
    <SectionWrapper id="stack" className="bg-cream" label="Tech stack">
      <SectionHeading
        eyebrow="The tools I use"
        title="My stack."
        description="Technologies I reach for when building production software."
      />

      {stack.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-ash text-sm italic">
            No skills added yet. Add them in the{' '}
            <a href="/dashboard" className="text-rose hover:text-roseDeep underline">
              Dashboard
            </a>.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stack.map((group) => (
            <div
              key={group.category}
              className="bg-blush rounded-2xl p-6 border border-petal"
            >
              <h3 className="font-mono text-xs text-rose uppercase tracking-widest mb-5">
                {group.category}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="px-3 py-1.5 bg-white rounded-full text-xs text-charcoal border border-petal hover:border-roseMist transition-colors"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}


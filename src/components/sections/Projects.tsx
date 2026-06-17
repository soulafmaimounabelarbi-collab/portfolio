import { useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { SectionWrapper, SectionHeading } from '../layout/SectionWrapper';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { ProjectThumbnail } from '../ui/ProjectThumbnail';
import { usePortfolio } from '../../context/PortfolioContext';
import { cn } from '../../lib/utils';

export function Projects() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expanded, setExpanded] = useState<string | null>(null);
  const { data } = usePortfolio();
  const projects = data.projects;

  const CATEGORIES = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filtered =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <SectionWrapper id="projects" className="bg-blush" label="Projects">
      <SectionHeading
        eyebrow="What I've built"
        title="Projects."
        description={
          projects.length === 0
            ? 'No projects yet — add yours in the Dashboard.'
            : `${projects.length} project${projects.length === 1 ? '' : 's'} across full-stack web, SaaS, and real-time systems.`
        }
      />

      {projects.length === 0 ? (
        <div className="text-center py-20 text-ash">
          <p className="text-lg mb-4">No projects added yet.</p>
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium rounded-full bg-roseDeep text-white hover:bg-rose transition-colors"
          >
            Go to Dashboard →
          </a>
        </div>
      ) : (
        <>
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filter projects by category">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-4 py-2 text-xs font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose focus:ring-offset-1',
                  activeCategory === cat
                    ? 'bg-roseDeep text-white'
                    : 'bg-white border border-roseMist text-slate hover:border-rose hover:text-roseDeep'
                )}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-ash">
              <p className="text-lg mb-2">No projects in this category yet.</p>
              <Button variant="ghost" onClick={() => setActiveCategory('All')}>
                Show all projects
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((project) => (
                <Card key={project.id} hover className="overflow-hidden">
                  {/* Thumbnail */}
                  <div className="h-44 overflow-hidden">
                    <ProjectThumbnail name={project.id} category={project.category} />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-display text-xl text-charcoal mb-1">{project.title}</h3>
                        <Badge variant="outline">{project.category}</Badge>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {project.githubUrl && project.githubUrl !== '#' && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-ash hover:text-roseDeep transition-colors focus:outline-none focus:ring-2 focus:ring-rose rounded-md"
                            aria-label={`GitHub repo for ${project.title}`}
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {project.liveUrl && project.liveUrl !== '#' && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-ash hover:text-roseDeep transition-colors focus:outline-none focus:ring-2 focus:ring-rose rounded-md"
                            aria-label={`Live site for ${project.title}`}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-slate text-sm leading-relaxed mb-4">{project.description}</p>

                    {/* Tech stack */}
                    {project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.techStack.slice(0, 5).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded-md bg-petal text-roseDeep text-xs font-mono"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 5 && (
                          <span className="px-2 py-0.5 rounded-md bg-petal text-ash text-xs font-mono">
                            +{project.techStack.length - 5}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Expandable highlights */}
                    {project.highlights.length > 0 && (
                      <>
                        <button
                          onClick={() => setExpanded(expanded === project.id ? null : project.id)}
                          className="text-xs text-rose hover:text-roseDeep font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-rose rounded-md px-1"
                          aria-expanded={expanded === project.id}
                          aria-controls={`highlights-${project.id}`}
                        >
                          {expanded === project.id ? 'Hide details ↑' : 'View highlights ↓'}
                        </button>

                        {expanded === project.id && (
                          <ul
                            id={`highlights-${project.id}`}
                            className="mt-4 space-y-2"
                            aria-label={`${project.title} highlights`}
                          >
                            {project.highlights.map((h, i) => (
                              <li key={i} className="flex gap-2 text-xs text-slate">
                                <span className="text-rose mt-0.5 shrink-0" aria-hidden="true">→</span>
                                {h}
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </SectionWrapper>
  );
}

import { useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import type { Project } from '../../types';
import {
  PanelHeader,
  Field,
  TextInput,
  TextAreaInput,
  DashButton,
  DashCard,
  EmptyState,
  Divider,
} from './DashUI';

const EMPTY_FORM: Omit<Project, 'id'> = {
  title: '',
  category: '',
  description: '',
  techStack: [],
  thumbnail: '',
  liveUrl: '',
  githubUrl: '',
  highlights: [],
  featured: false,
};

interface FormErrors {
  title?: string;
  category?: string;
  description?: string;
}

function validate(f: typeof EMPTY_FORM): FormErrors {
  const e: FormErrors = {};
  if (!f.title.trim()) e.title = 'Title is required';
  if (!f.category.trim()) e.category = 'Category is required';
  if (!f.description.trim()) e.description = 'Description is required';
  return e;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

interface ProjectFormProps {
  initial?: Project;
  onSave: (p: Project) => void;
  onCancel: () => void;
}

function ProjectForm({ initial, onSave, onCancel }: ProjectFormProps) {
  const [form, setForm] = useState<typeof EMPTY_FORM>(
    initial ? { ...initial } : { ...EMPTY_FORM }
  );
  const [techInput, setTechInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const set = (key: keyof typeof EMPTY_FORM, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof FormErrors]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const addTech = () => {
    const v = techInput.trim();
    if (v && !form.techStack.includes(v)) {
      set('techStack', [...form.techStack, v]);
    }
    setTechInput('');
  };

  const removeTech = (t: string) => set('techStack', form.techStack.filter((x) => x !== t));

  const addHighlight = () => {
    const v = highlightInput.trim();
    if (v) {
      set('highlights', [...form.highlights, v]);
    }
    setHighlightInput('');
  };

  const removeHighlight = (i: number) => set('highlights', form.highlights.filter((_, idx) => idx !== i));

  const handleSave = () => {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const id = (initial?.id ?? slugify(form.title)) || Date.now().toString();
    onSave({ ...form, id });
  };

  return (
    <DashCard className="mt-6">
      <h3 className="font-display text-lg text-charcoal mb-6">
        {initial ? 'Edit Project' : 'Add New Project'}
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Title" htmlFor="p-title" required>
            <TextInput
              id="p-title"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Project name"
              error={errors.title}
            />
          </Field>
          <Field label="Category" htmlFor="p-cat" required>
            <TextInput
              id="p-cat"
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              placeholder="e.g. SaaS, Full-Stack, Web App"
              error={errors.category}
            />
          </Field>
        </div>

        <Field label="Description" htmlFor="p-desc" required>
          <TextAreaInput
            id="p-desc"
            rows={3}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Short project description"
            error={errors.description}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Live URL" htmlFor="p-live">
            <TextInput
              id="p-live"
              value={form.liveUrl}
              onChange={(e) => set('liveUrl', e.target.value)}
              placeholder="https://..."
            />
          </Field>
          <Field label="GitHub URL" htmlFor="p-gh">
            <TextInput
              id="p-gh"
              value={form.githubUrl}
              onChange={(e) => set('githubUrl', e.target.value)}
              placeholder="https://github.com/..."
            />
          </Field>
        </div>

        <Field label="Project Image / Thumbnail" hint="Provide an image URL or upload a local image file.">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {form.thumbnail && (
              <div className="w-24 h-16 rounded-xl border border-petal overflow-hidden bg-cream shrink-0 flex items-center justify-center">
                <img src={form.thumbnail} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 w-full space-y-2">
              <TextInput
                value={form.thumbnail}
                onChange={(e) => set('thumbnail', e.target.value)}
                placeholder="https://example.com/image.png or upload a file"
              />
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-petal text-roseDeep hover:bg-roseMist transition-colors text-xs font-medium">
                  Upload Local File
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            set('thumbnail', event.target.result as string);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                {form.thumbnail && (
                  <button
                    type="button"
                    onClick={() => set('thumbnail', '')}
                    className="text-xs text-red-500 hover:text-red-700 transition-colors font-medium"
                  >
                    Clear Image
                  </button>
                )}
              </div>
            </div>
          </div>
        </Field>

        {/* Tech stack */}
        <Field label="Tech Stack" hint="Press Enter or click Add to add each technology">
          <div className="flex gap-2">
            <TextInput
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
              placeholder="e.g. React, Node.js..."
            />
            <DashButton variant="ghost" size="sm" onClick={addTech} type="button">
              Add
            </DashButton>
          </div>
          {form.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {form.techStack.map((t) => (
                <span key={t} className="flex items-center gap-1 px-2 py-1 bg-petal rounded-lg text-xs text-roseDeep">
                  {t}
                  <button onClick={() => removeTech(t)} className="hover:text-rose focus:outline-none">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </Field>

        {/* Highlights */}
        <Field label="Highlights" hint="Key bullet points about this project. Press Enter or click Add.">
          <div className="flex gap-2">
            <TextInput
              value={highlightInput}
              onChange={(e) => setHighlightInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addHighlight(); } }}
              placeholder="Describe a key highlight..."
            />
            <DashButton variant="ghost" size="sm" onClick={addHighlight} type="button">
              Add
            </DashButton>
          </div>
          {form.highlights.length > 0 && (
            <ul className="mt-2 space-y-1">
              {form.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate">
                  <span className="text-rose mt-0.5 shrink-0">→</span>
                  <span className="flex-1">{h}</span>
                  <button onClick={() => removeHighlight(i)} className="text-ash hover:text-red-500 focus:outline-none shrink-0">
                    <X className="w-3 h-3" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Field>

        <div className="flex items-center gap-2">
          <input
            id="p-featured"
            type="checkbox"
            checked={form.featured ?? false}
            onChange={(e) => set('featured', e.target.checked)}
            className="accent-roseDeep w-4 h-4"
          />
          <label htmlFor="p-featured" className="text-sm text-slate">Mark as featured project</label>
        </div>
      </div>

      <Divider />
      <div className="flex items-center gap-3 justify-end">
        <DashButton variant="ghost" onClick={onCancel} type="button">
          <X className="w-4 h-4" /> Cancel
        </DashButton>
        <DashButton onClick={handleSave} type="button">
          <Check className="w-4 h-4" /> {initial ? 'Save changes' : 'Add project'}
        </DashButton>
      </div>
    </DashCard>
  );
}

export function DashboardProjects() {
  const { data, addProject, updateProject, deleteProject } = usePortfolio();
  const projects = data.projects;
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSave = (project: Project) => {
    if (editingId) {
      updateProject(editingId, project);
      setEditingId(null);
    } else {
      addProject(project);
      setShowForm(false);
    }
  };

  return (
    <div>
      <PanelHeader
        title="Projects"
        description={`${projects.length} project${projects.length !== 1 ? 's' : ''} in your portfolio`}
        action={
          !showForm && !editingId ? (
            <DashButton onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4" /> Add project
            </DashButton>
          ) : undefined
        }
      />

      {showForm && !editingId && (
        <ProjectForm
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}

      {projects.length === 0 && !showForm ? (
        <EmptyState
          message="No projects yet. Click 'Add project' to get started."
          cta={
            <DashButton onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4" /> Add your first project
            </DashButton>
          }
        />
      ) : (
        <div className="space-y-4 mt-4">
          {projects.map((project) => (
            <div key={project.id}>
              {editingId === project.id ? (
                <ProjectForm
                  initial={project}
                  onSave={handleSave}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <DashCard className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display text-lg text-charcoal">{project.title}</h3>
                      <span className="px-2 py-0.5 bg-petal rounded-full text-2xs font-mono text-roseDeep">{project.category}</span>
                      {project.featured && (
                        <span className="px-2 py-0.5 bg-rose/10 rounded-full text-2xs font-mono text-rose">Featured</span>
                      )}
                    </div>
                    <p className="text-slate text-sm truncate">{project.description}</p>
                    {project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.techStack.slice(0, 4).map((t) => (
                          <span key={t} className="px-1.5 py-0.5 bg-blush rounded text-2xs text-ash font-mono">{t}</span>
                        ))}
                        {project.techStack.length > 4 && (
                          <span className="text-2xs text-ash font-mono">+{project.techStack.length - 4}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <DashButton size="sm" variant="ghost" onClick={() => setEditingId(project.id)}>
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </DashButton>
                    <DashButton size="sm" variant="danger" onClick={() => deleteProject(project.id)}>
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </DashButton>
                  </div>
                </DashCard>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

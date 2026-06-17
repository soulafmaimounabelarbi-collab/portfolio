import { useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import type { SkillGroup } from '../../data/stack';
import {
  PanelHeader,
  Field,
  TextInput,
  DashButton,
  DashCard,
  EmptyState,
  Divider,
} from './DashUI';

interface SkillGroupFormProps {
  initial?: SkillGroup;
  existingCategories: string[];
  onSave: (group: SkillGroup) => void;
  onCancel: () => void;
}

function SkillGroupForm({ initial, existingCategories, onSave, onCancel }: SkillGroupFormProps) {
  const [category, setCategory] = useState(initial?.category ?? '');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(initial?.skills ?? []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addSkill = () => {
    const v = skillInput.trim();
    if (v && !skills.includes(v)) setSkills((prev) => [...prev, v]);
    setSkillInput('');
  };

  const removeSkill = (s: string) => setSkills((prev) => prev.filter((x) => x !== s));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!category.trim()) e.category = 'Category name is required';
    else if (!initial && existingCategories.includes(category.trim())) e.category = 'This category already exists';
    if (skills.length === 0) e.skills = 'Add at least one skill';
    return e;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave({ category: category.trim(), skills });
  };

  return (
    <DashCard className="mt-4">
      <h3 className="font-display text-lg text-charcoal mb-5">
        {initial ? 'Edit Skill Group' : 'Add Skill Group'}
      </h3>
      <div className="space-y-4">
        <Field label="Category Name" htmlFor="sg-cat" required>
          <TextInput
            id="sg-cat"
            value={category}
            onChange={(e) => { setCategory(e.target.value); setErrors((p) => ({ ...p, category: '' })); }}
            placeholder="e.g. Frontend, Backend, DevOps"
            disabled={!!initial}
            error={errors.category}
          />
        </Field>

        <Field label="Skills" hint="Press Enter or click Add. Skills appear as tags on your portfolio." required>
          <div className="flex gap-2">
            <TextInput
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
              placeholder="e.g. React, TypeScript..."
            />
            <DashButton variant="ghost" size="sm" onClick={addSkill} type="button">
              Add
            </DashButton>
          </div>
          {errors.skills && <p className="text-xs text-red-500 mt-1">{errors.skills}</p>}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {skills.map((s) => (
                <span key={s} className="flex items-center gap-1 px-2.5 py-1 bg-petal rounded-full text-xs text-roseDeep">
                  {s}
                  <button onClick={() => removeSkill(s)} className="hover:text-rose focus:outline-none ml-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </Field>
      </div>
      <Divider />
      <div className="flex gap-3 justify-end">
        <DashButton variant="ghost" onClick={onCancel}>
          <X className="w-4 h-4" /> Cancel
        </DashButton>
        <DashButton onClick={handleSave}>
          <Check className="w-4 h-4" /> {initial ? 'Save changes' : 'Add group'}
        </DashButton>
      </div>
    </DashCard>
  );
}

export function DashboardStack() {
  const { data, addSkillGroup, updateSkillGroup, deleteSkillGroup } = usePortfolio();
  const stack = data.stack;
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const handleSave = (group: SkillGroup) => {
    if (editingCategory) {
      updateSkillGroup(editingCategory, group);
      setEditingCategory(null);
    } else {
      addSkillGroup(group);
      setShowForm(false);
    }
  };

  return (
    <div>
      <PanelHeader
        title="Tech Stack"
        description="Group your skills by category. Each group shows as a card on your portfolio."
        action={
          !showForm && !editingCategory ? (
            <DashButton onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4" /> Add group
            </DashButton>
          ) : undefined
        }
      />

      {showForm && !editingCategory && (
        <SkillGroupForm
          existingCategories={stack.map((s) => s.category)}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}

      {stack.length === 0 && !showForm ? (
        <EmptyState
          message="No skill groups yet. Add your first technology category."
          cta={
            <DashButton onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4" /> Add skill group
            </DashButton>
          }
        />
      ) : (
        <div className="space-y-3 mt-4">
          {stack.map((group) => (
            <div key={group.category}>
              {editingCategory === group.category ? (
                <SkillGroupForm
                  initial={group}
                  existingCategories={stack.map((s) => s.category)}
                  onSave={handleSave}
                  onCancel={() => setEditingCategory(null)}
                />
              ) : (
                <DashCard className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-mono text-xs text-rose uppercase tracking-widest mb-2">{group.category}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {group.skills.map((s) => (
                        <span key={s} className="px-2.5 py-1 bg-blush rounded-full text-xs text-charcoal border border-petal">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <DashButton size="sm" variant="ghost" onClick={() => setEditingCategory(group.category)}>
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </DashButton>
                    <DashButton size="sm" variant="danger" onClick={() => deleteSkillGroup(group.category)}>
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

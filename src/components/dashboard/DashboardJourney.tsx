import { useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import type { JourneyItem } from '../../types';
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

interface JourneyFormProps {
  initial?: JourneyItem;
  existingYears: string[];
  onSave: (item: JourneyItem) => void;
  onCancel: () => void;
}

function JourneyForm({ initial, existingYears, onSave, onCancel }: JourneyFormProps) {
  const [year, setYear] = useState(initial?.year ?? '');
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!year.trim()) e.year = 'Year is required';
    else if (!initial && existingYears.includes(year.trim())) e.year = 'This year already exists';
    if (!title.trim()) e.title = 'Title is required';
    if (!description.trim()) e.description = 'Description is required';
    return e;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave({ year: year.trim(), title: title.trim(), description: description.trim() });
  };

  return (
    <DashCard className="mt-4">
      <h3 className="font-display text-lg text-charcoal mb-5">
        {initial ? 'Edit Journey Item' : 'Add Journey Item'}
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <Field label="Year" htmlFor="j-year" required>
            <TextInput
              id="j-year"
              value={year}
              onChange={(e) => { setYear(e.target.value); setErrors((p) => ({ ...p, year: '' })); }}
              placeholder="2024"
              disabled={!!initial}
              error={errors.year}
            />
          </Field>
          <div className="col-span-2">
            <Field label="Title" htmlFor="j-title" required>
              <TextInput
                id="j-title"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: '' })); }}
                placeholder="e.g. Into the Web"
                error={errors.title}
              />
            </Field>
          </div>
        </div>
        <Field label="Description" htmlFor="j-desc" required>
          <TextAreaInput
            id="j-desc"
            rows={3}
            value={description}
            onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: '' })); }}
            placeholder="What happened this year in your journey?"
            error={errors.description}
          />
        </Field>
      </div>
      <Divider />
      <div className="flex gap-3 justify-end">
        <DashButton variant="ghost" onClick={onCancel}>
          <X className="w-4 h-4" /> Cancel
        </DashButton>
        <DashButton onClick={handleSave}>
          <Check className="w-4 h-4" /> {initial ? 'Save changes' : 'Add item'}
        </DashButton>
      </div>
    </DashCard>
  );
}

export function DashboardJourney() {
  const { data, addJourneyItem, updateJourneyItem, deleteJourneyItem } = usePortfolio();
  const journey = data.journey;
  const [showForm, setShowForm] = useState(false);
  const [editingYear, setEditingYear] = useState<string | null>(null);

  const handleSave = (item: JourneyItem) => {
    if (editingYear) {
      updateJourneyItem(editingYear, item);
      setEditingYear(null);
    } else {
      addJourneyItem(item);
      setShowForm(false);
    }
  };

  return (
    <div>
      <PanelHeader
        title="Journey"
        description="Add milestones that tell your story — they'll appear in order on the timeline."
        action={
          !showForm && !editingYear ? (
            <DashButton onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4" /> Add milestone
            </DashButton>
          ) : undefined
        }
      />

      {showForm && !editingYear && (
        <JourneyForm
          existingYears={journey.map((j) => j.year)}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}

      {journey.length === 0 && !showForm ? (
        <EmptyState
          message="No journey items yet. Add your first milestone."
          cta={
            <DashButton onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4" /> Add milestone
            </DashButton>
          }
        />
      ) : (
        <div className="space-y-3 mt-4">
          {journey.map((item) => (
            <div key={item.year}>
              {editingYear === item.year ? (
                <JourneyForm
                  initial={item}
                  existingYears={journey.map((j) => j.year)}
                  onSave={handleSave}
                  onCancel={() => setEditingYear(null)}
                />
              ) : (
                <DashCard className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-petal border-2 border-roseMist flex items-center justify-center shrink-0">
                    <span className="font-mono text-xs font-semibold text-roseDeep">{item.year}</span>
                  </div>
                  <div className="flex-1 min-w-0 pt-2">
                    <h3 className="font-display text-base text-charcoal mb-1">{item.title}</h3>
                    <p className="text-slate text-sm leading-relaxed line-clamp-2">{item.description}</p>
                  </div>
                  <div className="flex gap-2 shrink-0 pt-1">
                    <DashButton size="sm" variant="ghost" onClick={() => setEditingYear(item.year)}>
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </DashButton>
                    <DashButton size="sm" variant="danger" onClick={() => deleteJourneyItem(item.year)}>
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

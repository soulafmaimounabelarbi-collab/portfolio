import { useState } from 'react';
import { Save, Check } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import type { AboutInfo, HeroInfo } from '../../hooks/usePortfolioStore';
import {
  PanelHeader,
  Field,
  TextInput,
  TextAreaInput,
  DashButton,
  DashCard,
  Divider,
} from './DashUI';

export function DashboardAbout() {
  const { data, updateAbout, updateHero } = usePortfolio();

  const [hero, setHero] = useState<HeroInfo>({ ...data.hero });
  const [about, setAbout] = useState<AboutInfo>({ ...data.about });
  const [savedHero, setSavedHero] = useState(false);
  const [savedAbout, setSavedAbout] = useState(false);

  const setH = (key: keyof HeroInfo, value: string) =>
    setHero((prev) => ({ ...prev, [key]: value }));

  const setA = (key: keyof AboutInfo, value: string) =>
    setAbout((prev) => ({ ...prev, [key]: value }));

  const saveHero = () => {
    updateHero(hero);
    setSavedHero(true);
    setTimeout(() => setSavedHero(false), 2000);
  };

  const saveAbout = () => {
    updateAbout(about);
    setSavedAbout(true);
    setTimeout(() => setSavedAbout(false), 2000);
  };

  return (
    <div className="space-y-8">
      <PanelHeader
        title="About & Hero"
        description="Edit the content shown in your Hero intro and About sections."
      />

      {/* ─── Hero Section ────────────────────────────────────── */}
      <DashCard>
        <h3 className="font-display text-xl text-charcoal mb-6">Hero Section</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name" htmlFor="h-fn">
              <TextInput
                id="h-fn"
                value={hero.firstName}
                onChange={(e) => setH('firstName', e.target.value)}
                placeholder="e.g. Belarbi"
              />
            </Field>
            <Field label="Last Name" htmlFor="h-ln">
              <TextInput
                id="h-ln"
                value={hero.lastName}
                onChange={(e) => setH('lastName', e.target.value)}
                placeholder="e.g. Soulef"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Role / Title" htmlFor="h-role">
              <TextInput
                id="h-role"
                value={hero.role}
                onChange={(e) => setH('role', e.target.value)}
                placeholder="e.g. Full-Stack Developer"
              />
            </Field>
            <Field label="Location" htmlFor="h-loc">
              <TextInput
                id="h-loc"
                value={hero.location}
                onChange={(e) => setH('location', e.target.value)}
                placeholder="e.g. Algeria"
              />
            </Field>
          </div>
          <Field label="Tagline" htmlFor="h-tag" hint="The one-liner shown under your name">
            <TextAreaInput
              id="h-tag"
              rows={2}
              value={hero.tagline}
              onChange={(e) => setH('tagline', e.target.value)}
              placeholder="I build real-time web applications..."
            />
          </Field>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Stat: Projects" htmlFor="h-sp">
              <TextInput
                id="h-sp"
                value={hero.statProjects}
                onChange={(e) => setH('statProjects', e.target.value)}
                placeholder="5"
              />
            </Field>
            <Field label="Stat: Years" htmlFor="h-sy">
              <TextInput
                id="h-sy"
                value={hero.statYears}
                onChange={(e) => setH('statYears', e.target.value)}
                placeholder="3+"
              />
            </Field>
            <Field label="Stat: Extra" htmlFor="h-se">
              <TextInput
                id="h-se"
                value={hero.statExtra}
                onChange={(e) => setH('statExtra', e.target.value)}
                placeholder="∞"
              />
            </Field>
          </div>

          <div className="border-t border-petal pt-6 mt-6">
            <h4 className="font-mono text-xs font-semibold text-roseDeep uppercase tracking-wider mb-4">Profile Image & Border</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Left Column: Inputs */}
              <div className="space-y-4">
                <Field label="Profile Image URL" hint="Enter image URL or upload a file below">
                  <TextInput
                    value={hero.avatarUrl || ''}
                    onChange={(e) => setH('avatarUrl', e.target.value)}
                    placeholder="/profile.jpg"
                  />
                </Field>

                <Field label="Upload Profile Photo">
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-petal text-roseDeep hover:bg-roseMist transition-colors text-xs font-medium">
                      Select Photo
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
                                setH('avatarUrl', event.target.result as string);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {hero.avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setH('avatarUrl', '')}
                        className="text-xs text-red-500 hover:text-red-700 transition-colors font-medium"
                      >
                        Clear Image
                      </button>
                    )}
                  </div>
                </Field>

                <div className="grid grid-cols-3 gap-3">
                  <Field label="Border Shape" htmlFor="h-bshape">
                    <select
                      id="h-bshape"
                      value={hero.avatarBorderShape || 'blob'}
                      onChange={(e) => setH('avatarBorderShape', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-roseMist bg-white text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-rose"
                    >
                      <option value="blob">Organic Blob</option>
                      <option value="circle">Circle</option>
                      <option value="rounded">Soft Rounded</option>
                      <option value="square">Square</option>
                    </select>
                  </Field>

                  <Field label="Border Width" htmlFor="h-bwidth">
                    <select
                      id="h-bwidth"
                      value={hero.avatarBorderWidth || 'medium'}
                      onChange={(e) => setH('avatarBorderWidth', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-roseMist bg-white text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-rose"
                    >
                      <option value="none">None</option>
                      <option value="thin">Thin (3px)</option>
                      <option value="medium">Medium (6px)</option>
                      <option value="thick">Thick (12px)</option>
                    </select>
                  </Field>

                  <Field label="Border Style" htmlFor="h-bcolor">
                    <select
                      id="h-bcolor"
                      value={hero.avatarBorderColor || 'gradient'}
                      onChange={(e) => setH('avatarBorderColor', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-roseMist bg-white text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-rose"
                    >
                      <option value="gradient">Rose Gradient</option>
                      <option value="charcoal">Charcoal</option>
                      <option value="rose">Rose Pink</option>
                      <option value="white">Solid White</option>
                      <option value="gold">Gold Gradient</option>
                    </select>
                  </Field>
                </div>
              </div>

              {/* Right Column: Live Preview */}
              <div className="flex flex-col items-center justify-center p-6 border border-dashed border-roseMist rounded-2xl bg-cream/50 min-h-[220px]">
                <p className="text-2xs font-mono text-rose uppercase tracking-widest mb-4">Border Live Preview</p>
                <div
                  style={{
                    width: 140,
                    height: 180,
                    aspectRatio: '3/4',
                    borderRadius:
                      hero.avatarBorderShape === 'circle' ? '50%' :
                        hero.avatarBorderShape === 'rounded' ? '24px' :
                          hero.avatarBorderShape === 'square' ? '0px' :
                            '40% 60% 55% 45% / 45% 40% 60% 55%',
                    padding:
                      hero.avatarBorderWidth === 'none' ? 0 :
                        hero.avatarBorderWidth === 'thin' ? 3 :
                          hero.avatarBorderWidth === 'thick' ? 12 :
                            6, // medium
                    background:
                      hero.avatarBorderColor === 'charcoal' ? '#2D2D2D' :
                        hero.avatarBorderColor === 'rose' ? '#D4789A' :
                          hero.avatarBorderColor === 'white' ? '#FFFFFF' :
                            hero.avatarBorderColor === 'gold' ? 'linear-gradient(145deg, #FFE082, #FFB300)' :
                              'linear-gradient(140deg, #FFE4EC, #F5C6D6, #E8A0BA)', // gradient (petal, roseMist, roseSoft)
                    boxShadow: '0 10px 25px rgba(184,90,122,0.15)',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <img
                    src={hero.avatarUrl || '/profile.jpg'}
                    alt="Preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius:
                        hero.avatarBorderShape === 'circle' ? '50%' :
                          hero.avatarBorderShape === 'rounded' ? '20px' :
                            hero.avatarBorderShape === 'square' ? '0px' :
                              '38% 58% 53% 43% / 43% 38% 58% 53%',
                      display: 'block',
                      transition: 'all 0.3s ease',
                    }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&fit=crop';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Divider />
        <div className="flex justify-end">
          <DashButton onClick={saveHero}>
            {savedHero ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Hero</>}
          </DashButton>
        </div>
      </DashCard>

      {/* ─── About Section ───────────────────────────────────── */}
      <DashCard>
        <h3 className="font-display text-xl text-charcoal mb-6">About Section</h3>
        <div className="space-y-4">
          <Field label="Bio Paragraph 1" htmlFor="a-b1">
            <TextAreaInput
              id="a-b1"
              rows={3}
              value={about.bio1}
              onChange={(e) => setA('bio1', e.target.value)}
              placeholder="Introduce yourself — who you are and what you do..."
            />
          </Field>
          <Field label="Bio Paragraph 2" htmlFor="a-b2">
            <TextAreaInput
              id="a-b2"
              rows={3}
              value={about.bio2}
              onChange={(e) => setA('bio2', e.target.value)}
              placeholder="Your background and journey..."
            />
          </Field>
          <Field label="Bio Paragraph 3" htmlFor="a-b3">
            <TextAreaInput
              id="a-b3"
              rows={2}
              value={about.bio3}
              onChange={(e) => setA('bio3', e.target.value)}
              placeholder="Hobbies, interests, what you do outside of code..."
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Location" htmlFor="a-loc">
              <TextInput
                id="a-loc"
                value={about.location}
                onChange={(e) => setA('location', e.target.value)}
                placeholder="Algeria 🇩🇿"
              />
            </Field>
            <Field label="Availability" htmlFor="a-avail">
              <TextInput
                id="a-avail"
                value={about.availability}
                onChange={(e) => setA('availability', e.target.value)}
                placeholder="Open to full-time & freelance"
              />
            </Field>
            <Field label="Focus / Role" htmlFor="a-focus">
              <TextInput
                id="a-focus"
                value={about.focus}
                onChange={(e) => setA('focus', e.target.value)}
                placeholder="Full-Stack · SaaS · Real-time"
              />
            </Field>
            <Field label="Languages" htmlFor="a-langs">
              <TextInput
                id="a-langs"
                value={about.languages}
                onChange={(e) => setA('languages', e.target.value)}
                placeholder="Arabic · French · English"
              />
            </Field>
            <Field label="Email" htmlFor="a-email">
              <TextInput
                id="a-email"
                type="email"
                value={about.email}
                onChange={(e) => setA('email', e.target.value)}
                placeholder="you@example.com"
              />
            </Field>
          </div>

          {/* Social Links */}
          <div>
            <p className="text-xs font-mono text-rose uppercase tracking-widest mb-3">Social Links</p>
            <div className="grid grid-cols-1 gap-3">
              <Field label="GitHub URL" htmlFor="a-gh">
                <TextInput
                  id="a-gh"
                  value={about.github}
                  onChange={(e) => setA('github', e.target.value)}
                  placeholder="https://github.com/yourusername"
                />
              </Field>
              <Field label="LinkedIn URL" htmlFor="a-li">
                <TextInput
                  id="a-li"
                  value={about.linkedin}
                  onChange={(e) => setA('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </Field>
              <Field label="Instagram URL" htmlFor="a-ig">
                <TextInput
                  id="a-ig"
                  value={about.instagram}
                  onChange={(e) => setA('instagram', e.target.value)}
                  placeholder="https://instagram.com/yourhandle"
                />
              </Field>
            </div>
          </div>
        </div>
        <Divider />
        <div className="flex justify-end">
          <DashButton onClick={saveAbout}>
            {savedAbout ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save About</>}
          </DashButton>
        </div>
      </DashCard>
    </div>
  );
}

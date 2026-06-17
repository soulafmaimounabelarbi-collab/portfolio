interface ThumbnailProps {
  name: string;
  category: string;
}

const gradients: Record<string, string> = {
  dirassa: 'from-rose-300 to-pink-500',
  taskflow: 'from-violet-300 to-purple-500',
  shopwave: 'from-amber-300 to-orange-500',
  devlog: 'from-emerald-300 to-teal-500',
  weathermap: 'from-sky-300 to-blue-500',
};

export function ProjectThumbnail({ name, category }: ThumbnailProps) {
  const initials = name
    .split(/(?=[A-Z])/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const gradient = gradients[name.toLowerCase()] || 'from-roseSoft to-roseDeep';

  return (
    <div className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center gap-2`}>
      <span className="text-white/90 text-3xl font-bold font-mono tracking-tight">{initials}</span>
      <span className="text-white/60 text-xs uppercase tracking-widest">{category}</span>
    </div>
  );
}

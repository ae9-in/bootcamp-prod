import { getAvatarColors } from '@/lib/avatarColors';

export default function AvatarCircle({ initials, name, className }: { initials: string; name: string; className?: string }) {
  const { bg, text } = getAvatarColors(name);
  return (
    <div
      className={`flex items-center justify-center rounded-full font-semibold text-sm ${className || 'h-10 w-10'}`}
      style={{ backgroundColor: bg, color: text }}
    >
      {initials}
    </div>
  );
}

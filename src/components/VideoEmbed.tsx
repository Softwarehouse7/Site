import React from 'react';

interface VideoEmbedProps {
  url?: string;
  title?: string;
}

export function getEmbeddableUrl(rawUrl: string): { type: 'iframe' | 'video'; src: string } | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  // YouTube watch URL: https://www.youtube.com/watch?v=VIDEO_ID
  const ytWatchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{6,})/);
  if (ytWatchMatch && ytWatchMatch[1]) {
    return {
      type: 'iframe',
      src: `https://www.youtube.com/embed/${ytWatchMatch[1]}`
    };
  }

  // Vimeo URL: https://vimeo.com/12345678
  const vimeoMatch = trimmed.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'iframe',
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}`
    };
  }

  // Direct video file or other URL
  return {
    type: 'video',
    src: trimmed
  };
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({ url, title = 'Vídeo House Software' }) => {
  if (!url || !url.trim()) return null;

  const parsed = getEmbeddableUrl(url);
  if (!parsed) return null;

  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-950 shadow-sm">
      {parsed.type === 'iframe' ? (
        <iframe
          src={parsed.src}
          title={title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video
          src={parsed.src}
          controls
          className="w-full h-full object-contain bg-black"
        >
          Seu navegador não suporta a reprodução de vídeo.
        </video>
      )}
    </div>
  );
};

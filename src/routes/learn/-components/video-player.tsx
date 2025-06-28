interface VideoPlayerProps {
  url: string;
}

export function VideoPlayer({ url }: VideoPlayerProps) {
  return (
    <div className="mb-6">
      <video src={url} controls className="w-full mx-auto">
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

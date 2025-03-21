import ReactMarkdown from "react-markdown";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose max-w-none mb-6">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

const HtmlRenderer = ({ content, className }: { content: string; className?: string }) => (
  <div className={className} dangerouslySetInnerHTML={{ __html: content }} />
);

export default HtmlRenderer;
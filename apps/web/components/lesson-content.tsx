import Markdown from "react-markdown";

/** Explicit Markdown extension; raw HTML and remote images remain disabled. */
export default function LessonContent({ body }: { body: string }) {
  const blocks: React.ReactNode[] = [];
  const pattern = /^:::details ([^\n]+)\r?\n([\s\S]*?)^:::\s*$/gm;
  const render = (text: string) => (
    <Markdown skipHtml components={{ img: () => null }}>
      {text}
    </Markdown>
  );
  let start = 0;
  for (const match of body.matchAll(pattern)) {
    if (match.index! > start)
      blocks.push(
        <div key={`text-${start}`}>
          {render(body.slice(start, match.index))}
        </div>,
      );
    blocks.push(
      <details className="lesson-explanation" key={`answer-${match.index}`}>
        <summary>{match[1]}</summary>
        {render(match[2])}
      </details>,
    );
    start = match.index! + match[0].length;
  }
  if (start < body.length)
    blocks.push(<div key={`text-${start}`}>{render(body.slice(start))}</div>);
  return <>{blocks}</>;
}

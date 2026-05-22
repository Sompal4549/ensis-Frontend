// components/blog/SectionTitle.tsx

interface Props {
  title: string;
}

export default function SectionTitle({ title }: Props) {
  return (
    <div className="mb-3">
      <h2 className="font-serif text-2xl text-[#2b241f] font-semibold">{title}</h2>

      <div className="mt-3 flex items-center gap-2">
        <div className="h-px w-14 bg-[#c49b67]" />

        <div className="flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#c49b67]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#c49b67]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#c49b67]" />
        </div>

        <div className="h-px w-14 bg-[#c49b67]" />
      </div>
    </div>
  );
}
type Props = {
  selected: string;
  onSelect: (category: string) => void;
};

const categories = [
  "All", "Panchakarma", "Spa Design", "Ayurveda",
  "Wellness", "Equipment", "Ingredients", "Business", "Trends",
];

export default function CategoryFilters({ selected, onSelect }: Props) {
  return (
    <div className="mb-3 flex flex-wrap gap-3">
      {categories.map((item, index) => (
        <button
          key={index}
          onClick={() => onSelect(item)}
          className={`rounded-lg border ${item === "All" ? "px-1 py-1" : "px-2 py-2"} text-sm transition ${
            selected === item
              ? "border-[#274217] bg-[#274217] text-white"
              : "border-[#dcc9b5] text-[#5b4a3f] hover:bg-[#ede1d3]"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
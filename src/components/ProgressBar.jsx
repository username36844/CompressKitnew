export default function ProgressBar({ value }) {
  return (
    <div className="w-full h-2 bg-neutral-800 rounded overflow-hidden">
      <div
        className="h-full bg-white transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
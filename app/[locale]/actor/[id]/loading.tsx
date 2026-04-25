export default function Loading() {
  return (
    <div className="p-10 text-white animate-pulse">
      <div className="h-[300px] bg-gray-800 rounded-xl mb-6" />
      <div className="h-6 bg-gray-700 w-1/3 mb-4" />
      <div className="h-4 bg-gray-700 w-1/2 mb-2" />
      <div className="h-4 bg-gray-700 w-2/3" />
    </div>
  );
}
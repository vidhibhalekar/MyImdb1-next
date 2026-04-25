export default function Awards({ awards }: any) {
    if (!awards || awards.length === 0) {
      return <p className="text-gray-400">No awards data available</p>;
    }
  
    return (
      <div className="space-y-4">
        {awards.map((award: any, i: number) => (
          <div key={i} className="border border-gray-700 p-4 rounded-xl">
            <p className="font-semibold">
              {award.name ?? award}
            </p>
  
            {(award.category || award.year) && (
              <p className="text-sm text-gray-400">
                {award.category ?? "Award"} {award.year ? `• ${award.year}` : ""}
              </p>
            )}
  
            {award.film && (
              <p className="text-sm">{award.film}</p>
            )}
          </div>
        ))}
      </div>
    );
  }
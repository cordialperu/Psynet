import { useQuery } from "@tanstack/react-query";
import type { Therapy } from "@shared/schema";

export default function HomeSimple() {
  const { data: therapies = [], isLoading, isError } = useQuery<Therapy[]>({
    queryKey: ["/api/therapies/published"],
  });

  if (isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Error loading content</h1>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Psynet - Simple Version</h1>
      <p>Total listings: {therapies.length}</p>
      
      <div style={{ marginTop: '20px' }}>
        {therapies.slice(0, 5).map((therapy) => (
          <div 
            key={therapy.id} 
            style={{ 
              border: '1px solid #ccc', 
              padding: '15px', 
              marginBottom: '10px',
              borderRadius: '8px'
            }}
          >
            <h3>{therapy.title}</h3>
            <p>{therapy.description?.substring(0, 100)}...</p>
            <p><strong>Price:</strong> ${therapy.price} {therapy.currency}</p>
            <a href={`/therapy/${therapy.slug}`}>View Details</a>
          </div>
        ))}
      </div>
    </div>
  );
}

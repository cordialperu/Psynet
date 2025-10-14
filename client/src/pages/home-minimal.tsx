export default function HomeMinimal() {
  return (
    <div style={{ 
      padding: '40px 20px', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>
        Psynet
      </h1>
      
      <p style={{ fontSize: '18px', marginBottom: '30px', color: '#666' }}>
        Authentic Healing Experiences in Peru
      </p>

      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f0f0f0', 
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>
          ✅ App is Working!
        </h2>
        <p style={{ fontSize: '16px', color: '#333' }}>
          If you can see this, the server connection is working.
        </p>
      </div>

      <div style={{ 
        padding: '20px', 
        backgroundColor: '#e3f2fd', 
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>
          📱 iPhone Test
        </h3>
        <p style={{ fontSize: '14px', color: '#1976d2' }}>
          This is a minimal version without React Query or complex features.
        </p>
      </div>

      <a 
        href="/full" 
        style={{
          display: 'block',
          padding: '15px 30px',
          backgroundColor: '#000',
          color: '#fff',
          textAlign: 'center',
          borderRadius: '25px',
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: '600'
        }}
      >
        Try Full Version →
      </a>

      <div style={{ marginTop: '40px', fontSize: '14px', color: '#999' }}>
        <p>Server: Connected ✅</p>
        <p>React: Rendering ✅</p>
        <p>Router: Working ✅</p>
      </div>
    </div>
  );
}

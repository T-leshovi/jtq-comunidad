import { dogSvgInline, catSvgInline } from "@/components/PetIllustrations"

export default function FlyerPost() {
  return (
    <div
      style={{
        width: 1080,
        height: 1080,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif",
        background: 'linear-gradient(150deg, #070b14 0%, #0f172a 12%, #1e3a5f 28%, #1e40af 45%, #0891b2 60%, #059669 78%, #10b981 92%, #34d399 100%)',
      }}
    >
      {/* Paw pattern overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='70' height='70' viewBox='0 0 70 70'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cellipse cx='35' cy='44' rx='7' ry='10'/%3E%3Cellipse cx='24' cy='30' rx='5' ry='6'/%3E%3Cellipse cx='46' cy='30' rx='5' ry='6'/%3E%3Cellipse cx='19' cy='39' rx='3.5' ry='4.5'/%3E%3Cellipse cx='51' cy='39' rx='3.5' ry='4.5'/%3E%3C/g%3E%3C/svg%3E")`,
          zIndex: 0,
        }}
      />

      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: -40, left: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.02)', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '40%', right: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.02)', zIndex: 0 }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', padding: '36px 50px' }}>

        {/* Top row: Logos */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, width: '100%' }}>
          <img src="/logo-ctm08.png" alt="CTM 08" style={{ width: 110, height: 110, objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }} />
          <div style={{ color: 'white', fontSize: 28, fontWeight: 300, opacity: 0.4 }}>×</div>
          <img src="/logo-jtq.png" alt="JEQUIMA" style={{ width: 110, height: 110, objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }} />
        </div>

        {/* Headline */}
        <div style={{ textAlign: 'center', margin: '18px 0 6px' }}>
          <div style={{ color: '#fbbf24', fontSize: 28, fontWeight: 800, letterSpacing: 5, textTransform: 'uppercase', textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>
            Campaña de
          </div>
          <div style={{ color: 'white', fontSize: 56, fontWeight: 900, lineHeight: 1.05, textShadow: '0 3px 12px rgba(0,0,0,0.4)', margin: '4px 0' }}>
            Esterilización
          </div>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            color: '#0f172a',
            fontSize: 40,
            fontWeight: 900,
            padding: '6px 32px',
            borderRadius: 12,
            boxShadow: '0 4px 16px rgba(245,158,11,0.4)',
          }}>
            100% GRATUITA
          </div>
        </div>

        {/* Middle row: Pets + Benefits */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 30, margin: '16px 0 10px', width: '100%' }}>
          {/* Left - Dog illustration */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: '0 0 auto' }}>
            {dogSvgInline(120)}
            <span style={{ color: 'white', fontSize: 20, fontWeight: 700 }}>Perros</span>
          </div>

          {/* Center - Benefits */}
          <div style={{
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(10px)',
            borderRadius: 20,
            padding: '18px 24px',
            flex: 1,
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            {/* Checkmark */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span style={{ color: 'white', fontSize: 22, fontWeight: 500 }}>Sin costo alguno</span>
            </div>
            {/* Medical */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                <path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4" />
                <circle cx="20" cy="10" r="2" />
              </svg>
              <span style={{ color: 'white', fontSize: 22, fontWeight: 500 }}>Atención veterinaria profesional</span>
            </div>
            {/* Heart */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#f87171" stroke="#f87171" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span style={{ color: 'white', fontSize: 22, fontWeight: 500 }}>Cuida a tu mascota y comunidad</span>
            </div>
            {/* Community */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span style={{ color: 'white', fontSize: 22, fontWeight: 500 }}>Bienestar animal para Cananea</span>
            </div>
          </div>

          {/* Right - Cat illustration */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: '0 0 auto' }}>
            {catSvgInline(120)}
            <span style={{ color: 'white', fontSize: 20, fontWeight: 700 }}>Gatos</span>
          </div>
        </div>

        {/* Motivational text */}
        <div style={{ textAlign: 'center', margin: '8px 0', padding: '0 20px' }}>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 22, fontWeight: 600, fontStyle: 'italic', lineHeight: 1.4 }}>
            &ldquo;Juntos por una Cananea más responsable con sus mascotas&rdquo;
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Bottom: QR + Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 30, width: '100%' }}>
          {/* QR Card */}
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 20,
            padding: '20px 24px',
            textAlign: 'center',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            flex: '0 0 auto',
          }}>
            <div style={{ color: '#0f172a', fontSize: 18, fontWeight: 800, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>
              Regístrate Aquí
            </div>
            <img src="/qr-registro.png" alt="QR" style={{ width: 170, height: 170 }} />
            <div style={{ color: '#059669', fontSize: 18, fontWeight: 700, marginTop: 6 }}>
              jtqcomunidad.org
            </div>
          </div>

          {/* Right side info */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span style={{ color: 'white', fontSize: 30, fontWeight: 700 }}>Cananea, Sonora</span>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 20, lineHeight: 1.5 }}>
              Escanea el código QR<br />con tu celular para<br />
              <span style={{ fontWeight: 700, color: '#fbbf24' }}>apartar tu lugar</span>
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 20,
              padding: '4px 14px',
              marginTop: 12,
              border: '1px solid rgba(255,255,255,0.15)',
            }}>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 700, letterSpacing: 0.5 }}>CTM Sección 08</span>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>×</span>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 700, letterSpacing: 0.5 }}>JEQUIMA</span>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 6 }}>
              jtqcomunidad.org
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

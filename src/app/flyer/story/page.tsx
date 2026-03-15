import { dogSvgInline, catSvgInline } from "@/components/PetIllustrations"

export default function FlyerStory() {
  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif",
        background: 'linear-gradient(165deg, #070b14 0%, #0f172a 12%, #1e3a5f 28%, #1e40af 45%, #0891b2 60%, #059669 75%, #10b981 90%, #34d399 100%)',
      }}
    >
      {/* Paw pattern overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cellipse cx='40' cy='50' rx='8' ry='11'/%3E%3Cellipse cx='27' cy='35' rx='5' ry='7'/%3E%3Cellipse cx='53' cy='35' rx='5' ry='7'/%3E%3Cellipse cx='22' cy='45' rx='4' ry='5'/%3E%3Cellipse cx='58' cy='45' rx='4' ry='5'/%3E%3C/g%3E%3C/svg%3E")`,
          zIndex: 0,
        }}
      />

      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: -60, left: -60, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.02)', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '45%', right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.02)', zIndex: 0 }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', padding: '50px 60px' }}>

        {/* Logos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 40, marginTop: 10 }}>
          <img src="/logo-ctm08.png" alt="CTM 08" style={{ width: 160, height: 160, objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }} />
          <div style={{ color: 'white', fontSize: 40, fontWeight: 300, opacity: 0.4 }}>×</div>
          <img src="/logo-jtq.png" alt="JEQUIMA" style={{ width: 160, height: 160, objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }} />
        </div>

        {/* Divider */}
        <div style={{ width: 120, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2, margin: '30px 0 25px' }} />

        {/* Main headline */}
        <div style={{ textAlign: 'center', marginBottom: 5 }}>
          <div style={{ color: '#fbbf24', fontSize: 38, fontWeight: 800, letterSpacing: 6, textTransform: 'uppercase', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
            Campaña de
          </div>
          <div style={{ color: 'white', fontSize: 72, fontWeight: 900, lineHeight: 1.05, textShadow: '0 4px 15px rgba(0,0,0,0.4)', margin: '8px 0' }}>
            Esterilización
          </div>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            color: '#0f172a',
            fontSize: 52,
            fontWeight: 900,
            padding: '8px 40px',
            borderRadius: 16,
            boxShadow: '0 6px 20px rgba(245,158,11,0.4)',
            marginTop: 8,
          }}>
            GRATUITA
          </div>
        </div>

        {/* Pet illustrations — Detailed style */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 40, margin: '30px 0 20px' }}>
          <div style={{ textAlign: 'center' }}>
            {dogSvgInline(160)}
            <div style={{ color: 'white', fontSize: 26, fontWeight: 700, marginTop: 6 }}>Perros</div>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 50, fontWeight: 300 }}>&</div>
          <div style={{ textAlign: 'center' }}>
            {catSvgInline(160)}
            <div style={{ color: 'white', fontSize: 26, fontWeight: 700, marginTop: 6 }}>Gatos</div>
          </div>
        </div>

        {/* Benefits */}
        <div style={{
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(10px)',
          borderRadius: 24,
          padding: '28px 40px',
          margin: '15px 0',
          width: '100%',
          maxWidth: 860,
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span style={{ color: 'white', fontSize: 28, fontWeight: 500 }}>100% Gratuita — Sin costo alguno</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                <path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4" />
                <circle cx="20" cy="10" r="2" />
              </svg>
              <span style={{ color: 'white', fontSize: 28, fontWeight: 500 }}>Atención veterinaria profesional</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="#f87171" stroke="#f87171" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span style={{ color: 'white', fontSize: 28, fontWeight: 500 }}>Cuida a tu mascota y a tu comunidad</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span style={{ color: 'white', fontSize: 28, fontWeight: 500 }}>Compromiso con el bienestar animal de Cananea</span>
            </div>
          </div>
        </div>

        {/* Emotional CTA */}
        <div style={{
          textAlign: 'center',
          margin: '20px 0',
          padding: '0 20px',
        }}>
          <div style={{ color: 'white', fontSize: 38, fontWeight: 300, lineHeight: 1.4, fontStyle: 'italic' }}>
            &ldquo;Porque cada mascota merece
          </div>
          <div style={{ color: '#fbbf24', fontSize: 44, fontWeight: 800, lineHeight: 1.3 }}>
            una vida digna y saludable&rdquo;
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 24, marginTop: 12, fontWeight: 400 }}>
            Una iniciativa ciudadana por una comunidad más responsable
          </div>
        </div>

        {/* Cupos limitados CTA */}
        <div style={{
          background: 'rgba(255,255,255,0.08)',
          border: '2px solid rgba(255,255,255,0.15)',
          borderRadius: 20,
          padding: '22px 40px',
          textAlign: 'center',
          width: '100%',
          maxWidth: 700,
        }}>
          <div style={{ color: 'white', fontSize: 30, fontWeight: 700, marginBottom: 4 }}>
            Cupos limitados — Regístrate hoy
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 24 }}>
            Aparta tu lugar antes de que se agoten
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* QR Section */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 28,
          padding: '30px 40px',
          textAlign: 'center',
          boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
          width: '100%',
          maxWidth: 750,
        }}>
          <div style={{ color: '#0f172a', fontSize: 28, fontWeight: 800, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 2 }}>
            ¡Aparta tu lugar!
          </div>
          <div style={{ color: '#64748b', fontSize: 22, marginBottom: 16 }}>
            Escanea el código QR con tu celular
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src="/qr-registro.png" alt="QR" style={{ width: 220, height: 220 }} />
          </div>
          <div style={{ color: '#059669', fontSize: 24, fontWeight: 700, marginTop: 12 }}>
            jtqcomunidad.org
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', margin: '28px 0 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span style={{ color: 'white', fontSize: 32, fontWeight: 700 }}>Cananea, Sonora</span>
          </div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 24,
            padding: '6px 20px',
            marginTop: 12,
            border: '1px solid rgba(255,255,255,0.15)',
          }}>
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, fontWeight: 700, letterSpacing: 1 }}>CTM Sección 08</span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>×</span>
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, fontWeight: 700, letterSpacing: 1 }}>JEQUIMA</span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16, marginTop: 8 }}>
            jtqcomunidad.org
          </div>
        </div>
      </div>
    </div>
  );
}

interface IllustrationProps {
  className?: string
  size?: number
  style?: React.CSSProperties
}

export function DogIllustration({ className = "", size = 200, style }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className} style={style}>
      <defs>
        <linearGradient id="dogFur" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4A574" />
          <stop offset="50%" stopColor="#C4956A" />
          <stop offset="100%" stopColor="#B8845C" />
        </linearGradient>
        <linearGradient id="dogFurDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A0764E" />
          <stop offset="100%" stopColor="#8B6544" />
        </linearGradient>
        <linearGradient id="dogFurLight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E8C9A8" />
          <stop offset="100%" stopColor="#D4A574" />
        </linearGradient>
        <radialGradient id="dogNose" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#4a3728" />
          <stop offset="100%" stopColor="#2d1810" />
        </radialGradient>
        <radialGradient id="dogEye" cx="35%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#5C3D2E" />
          <stop offset="100%" stopColor="#2d1810" />
        </radialGradient>
        <linearGradient id="dogCollar" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <filter id="dogShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.15" />
        </filter>
      </defs>

      <g filter="url(#dogShadow)">
        {/* Body */}
        <ellipse cx="100" cy="138" rx="48" ry="38" fill="url(#dogFur)" />
        {/* Chest highlight */}
        <ellipse cx="100" cy="130" rx="28" ry="24" fill="url(#dogFurLight)" opacity="0.6" />

        {/* Back legs */}
        <ellipse cx="72" cy="162" rx="14" ry="18" fill="url(#dogFur)" />
        <ellipse cx="128" cy="162" rx="14" ry="18" fill="url(#dogFur)" />
        {/* Back paws */}
        <ellipse cx="68" cy="176" rx="12" ry="6" fill="url(#dogFurLight)" />
        <ellipse cx="132" cy="176" rx="12" ry="6" fill="url(#dogFurLight)" />

        {/* Front legs */}
        <rect x="80" y="148" width="14" height="30" rx="7" fill="url(#dogFur)" />
        <rect x="106" y="148" width="14" height="30" rx="7" fill="url(#dogFur)" />
        {/* Front paws */}
        <ellipse cx="87" cy="178" rx="10" ry="5" fill="url(#dogFurLight)" />
        <ellipse cx="113" cy="178" rx="10" ry="5" fill="url(#dogFurLight)" />
        {/* Paw pads */}
        <circle cx="85" cy="179" r="2" fill="#B8845C" opacity="0.5" />
        <circle cx="89" cy="179" r="2" fill="#B8845C" opacity="0.5" />
        <circle cx="111" cy="179" r="2" fill="#B8845C" opacity="0.5" />
        <circle cx="115" cy="179" r="2" fill="#B8845C" opacity="0.5" />

        {/* Tail */}
        <path d="M148 130 Q168 105 162 78 Q158 65 152 72" stroke="url(#dogFur)" strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M148 130 Q168 105 162 78 Q158 65 152 72" stroke="url(#dogFurLight)" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.4" />

        {/* Head */}
        <circle cx="100" cy="72" r="38" fill="url(#dogFur)" />
        {/* Face lighter area */}
        <ellipse cx="100" cy="82" rx="24" ry="20" fill="url(#dogFurLight)" opacity="0.5" />

        {/* Ears */}
        <ellipse cx="60" cy="52" rx="16" ry="28" fill="url(#dogFurDark)" transform="rotate(-20 60 52)" />
        <ellipse cx="60" cy="52" rx="10" ry="20" fill="#E8987A" opacity="0.4" transform="rotate(-20 60 52)" />
        <ellipse cx="140" cy="52" rx="16" ry="28" fill="url(#dogFurDark)" transform="rotate(20 140 52)" />
        <ellipse cx="140" cy="52" rx="10" ry="20" fill="#E8987A" opacity="0.4" transform="rotate(20 140 52)" />

        {/* Muzzle */}
        <ellipse cx="100" cy="86" rx="18" ry="14" fill="url(#dogFurLight)" opacity="0.8" />

        {/* Eyes */}
        <ellipse cx="84" cy="68" rx="8" ry="9" fill="white" />
        <ellipse cx="116" cy="68" rx="8" ry="9" fill="white" />
        <circle cx="86" cy="68" r="6" fill="url(#dogEye)" />
        <circle cx="118" cy="68" r="6" fill="url(#dogEye)" />
        {/* Pupils */}
        <circle cx="87" cy="67" r="3.5" fill="#1a1008" />
        <circle cx="119" cy="67" r="3.5" fill="#1a1008" />
        {/* Eye highlights */}
        <circle cx="89" cy="65" r="2" fill="white" />
        <circle cx="121" cy="65" r="2" fill="white" />
        <circle cx="85" cy="70" r="1" fill="white" opacity="0.6" />
        <circle cx="117" cy="70" r="1" fill="white" opacity="0.6" />
        {/* Eyebrows */}
        <path d="M74 60 Q84 55 92 60" stroke="#A0764E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M108 60 Q116 55 126 60" stroke="#A0764E" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Nose */}
        <ellipse cx="100" cy="82" rx="8" ry="5.5" fill="url(#dogNose)" />
        {/* Nose highlight */}
        <ellipse cx="98" cy="80" rx="3" ry="2" fill="white" opacity="0.25" />

        {/* Mouth */}
        <path d="M92 88 Q100 96 108 88" stroke="#8B6544" strokeWidth="1.5" fill="none" />
        <line x1="100" y1="87" x2="100" y2="92" stroke="#8B6544" strokeWidth="1.5" />

        {/* Tongue */}
        <ellipse cx="100" cy="97" rx="6" ry="8" fill="#E8787A" />
        <ellipse cx="100" cy="95" rx="6" ry="4" fill="url(#dogFurLight)" opacity="0.8" />
        <line x1="100" y1="92" x2="100" y2="103" stroke="#D4636A" strokeWidth="0.8" opacity="0.5" />

        {/* Collar */}
        <path d="M68 108 Q100 118 132 108" stroke="url(#dogCollar)" strokeWidth="8" fill="none" strokeLinecap="round" />
        {/* Tag */}
        <circle cx="100" cy="118" r="6" fill="#fbbf24" />
        <circle cx="100" cy="118" r="4" fill="#f59e0b" />
        {/* Paw on tag */}
        <circle cx="100" cy="117" r="1.5" fill="#fbbf24" />
        <circle cx="98" cy="115.5" r="0.8" fill="#fbbf24" />
        <circle cx="102" cy="115.5" r="0.8" fill="#fbbf24" />
        <circle cx="100" cy="114.5" r="0.8" fill="#fbbf24" />

        {/* Fur texture hints */}
        <path d="M78 120 L80 115" stroke="#B8845C" strokeWidth="0.8" opacity="0.15" />
        <path d="M85 125 L87 120" stroke="#B8845C" strokeWidth="0.8" opacity="0.15" />
        <path d="M115 125 L113 120" stroke="#B8845C" strokeWidth="0.8" opacity="0.15" />
        <path d="M122 120 L120 115" stroke="#B8845C" strokeWidth="0.8" opacity="0.15" />
        <path d="M95 130 L97 126" stroke="#B8845C" strokeWidth="0.8" opacity="0.12" />
        <path d="M105 130 L103 126" stroke="#B8845C" strokeWidth="0.8" opacity="0.12" />
        <path d="M75 140 L78 136" stroke="#B8845C" strokeWidth="0.8" opacity="0.1" />
        <path d="M125 140 L122 136" stroke="#B8845C" strokeWidth="0.8" opacity="0.1" />
      </g>
    </svg>
  )
}

export function CatIllustration({ className = "", size = 200, style }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className} style={style}>
      <defs>
        <linearGradient id="catFur" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5B041" />
          <stop offset="50%" stopColor="#F5A623" />
          <stop offset="100%" stopColor="#E8983A" />
        </linearGradient>
        <linearGradient id="catFurDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4882A" />
          <stop offset="100%" stopColor="#C07820" />
        </linearGradient>
        <linearGradient id="catFurLight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FCE4B0" />
          <stop offset="100%" stopColor="#F5D08A" />
        </linearGradient>
        <radialGradient id="catEyeGreen" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6DD400" />
          <stop offset="40%" stopColor="#2ECC71" />
          <stop offset="100%" stopColor="#1B8C4E" />
        </radialGradient>
        <radialGradient id="catNose" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#F0A0A0" />
          <stop offset="100%" stopColor="#E87A7A" />
        </radialGradient>
        <linearGradient id="catCollar" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <filter id="catShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.15" />
        </filter>
      </defs>

      <g filter="url(#catShadow)">
        {/* Body */}
        <ellipse cx="100" cy="138" rx="42" ry="34" fill="url(#catFur)" />
        {/* Chest */}
        <ellipse cx="100" cy="132" rx="22" ry="22" fill="url(#catFurLight)" opacity="0.6" />
        {/* Chest tuft */}
        <path d="M92 122 Q96 118 100 122 Q104 118 108 122" stroke="url(#catFurLight)" strokeWidth="2" fill="none" opacity="0.5" />
        <path d="M94 126 Q98 122 102 126 Q106 122 106 126" stroke="url(#catFurLight)" strokeWidth="1.5" fill="none" opacity="0.4" />

        {/* Back legs */}
        <ellipse cx="74" cy="160" rx="14" ry="16" fill="url(#catFur)" />
        <ellipse cx="126" cy="160" rx="14" ry="16" fill="url(#catFur)" />
        {/* Back paws */}
        <ellipse cx="70" cy="174" rx="11" ry="5" fill="url(#catFurLight)" />
        <ellipse cx="130" cy="174" rx="11" ry="5" fill="url(#catFurLight)" />

        {/* Front legs */}
        <rect x="82" y="150" width="12" height="26" rx="6" fill="url(#catFur)" />
        <rect x="106" y="150" width="12" height="26" rx="6" fill="url(#catFur)" />
        {/* Front paws */}
        <ellipse cx="88" cy="176" rx="9" ry="4.5" fill="url(#catFurLight)" />
        <ellipse cx="112" cy="176" rx="9" ry="4.5" fill="url(#catFurLight)" />
        {/* Paw details */}
        <circle cx="86" cy="177" r="1.5" fill="#E8983A" opacity="0.3" />
        <circle cx="90" cy="177" r="1.5" fill="#E8983A" opacity="0.3" />
        <circle cx="110" cy="177" r="1.5" fill="#E8983A" opacity="0.3" />
        <circle cx="114" cy="177" r="1.5" fill="#E8983A" opacity="0.3" />

        {/* Tail — wrapped around body */}
        <path d="M142 145 Q165 130 160 105 Q156 85 148 95 Q142 105 148 110" stroke="url(#catFur)" strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M142 145 Q165 130 160 105 Q156 85 148 95" stroke="url(#catFurDark)" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.3" />
        {/* Tail stripes */}
        <path d="M155 115 Q160 112 158 108" stroke="url(#catFurDark)" strokeWidth="2" fill="none" opacity="0.25" />
        <path d="M158 125 Q163 120 160 116" stroke="url(#catFurDark)" strokeWidth="2" fill="none" opacity="0.2" />

        {/* Head */}
        <circle cx="100" cy="72" r="36" fill="url(#catFur)" />
        {/* Face lighter area */}
        <ellipse cx="100" cy="80" rx="22" ry="18" fill="url(#catFurLight)" opacity="0.45" />

        {/* Ears */}
        <polygon points="66,52 52,14 82,42" fill="url(#catFur)" />
        <polygon points="134,52 148,14 118,42" fill="url(#catFur)" />
        {/* Inner ears */}
        <polygon points="67,50 56,22 78,43" fill="#E8987A" opacity="0.5" />
        <polygon points="133,50 144,22 122,43" fill="#E8987A" opacity="0.5" />

        {/* Eyes */}
        <ellipse cx="84" cy="68" rx="10" ry="12" fill="white" />
        <ellipse cx="116" cy="68" rx="10" ry="12" fill="white" />
        {/* Iris */}
        <ellipse cx="84" cy="68" rx="7" ry="10" fill="url(#catEyeGreen)" />
        <ellipse cx="116" cy="68" rx="7" ry="10" fill="url(#catEyeGreen)" />
        {/* Vertical pupils */}
        <ellipse cx="84" cy="68" rx="2.5" ry="9" fill="#1a1a2e" />
        <ellipse cx="116" cy="68" rx="2.5" ry="9" fill="#1a1a2e" />
        {/* Eye highlights */}
        <circle cx="87" cy="64" r="2.5" fill="white" />
        <circle cx="119" cy="64" r="2.5" fill="white" />
        <circle cx="82" cy="72" r="1.2" fill="white" opacity="0.5" />
        <circle cx="114" cy="72" r="1.2" fill="white" opacity="0.5" />
        {/* Eyelids */}
        <path d="M73 62 Q84 56 95 62" stroke="url(#catFurDark)" strokeWidth="1.5" fill="none" />
        <path d="M105 62 Q116 56 127 62" stroke="url(#catFurDark)" strokeWidth="1.5" fill="none" />

        {/* Nose */}
        <path d="M96 82 L100 86 L104 82 Z" fill="url(#catNose)" />
        {/* Nose highlight */}
        <circle cx="99" cy="83" r="1" fill="white" opacity="0.3" />

        {/* Mouth */}
        <path d="M94 88 Q100 93 106 88" stroke="#C07820" strokeWidth="1.2" fill="none" />
        <line x1="100" y1="86" x2="100" y2="90" stroke="#C07820" strokeWidth="1.2" />

        {/* Whiskers */}
        <line x1="70" y1="78" x2="40" y2="72" stroke="white" strokeWidth="1.3" opacity="0.6" />
        <line x1="70" y1="82" x2="38" y2="82" stroke="white" strokeWidth="1.3" opacity="0.6" />
        <line x1="70" y1="86" x2="40" y2="92" stroke="white" strokeWidth="1.3" opacity="0.6" />
        <line x1="130" y1="78" x2="160" y2="72" stroke="white" strokeWidth="1.3" opacity="0.6" />
        <line x1="130" y1="82" x2="162" y2="82" stroke="white" strokeWidth="1.3" opacity="0.6" />
        <line x1="130" y1="86" x2="160" y2="92" stroke="white" strokeWidth="1.3" opacity="0.6" />

        {/* Tabby stripes on forehead */}
        <path d="M82 52 Q100 46 118 52" stroke="url(#catFurDark)" strokeWidth="2.5" fill="none" opacity="0.3" />
        <path d="M86 58 Q100 53 114 58" stroke="url(#catFurDark)" strokeWidth="2" fill="none" opacity="0.25" />
        <path d="M90 42 L88 36" stroke="url(#catFurDark)" strokeWidth="2" fill="none" opacity="0.2" />
        <path d="M100 40 L100 34" stroke="url(#catFurDark)" strokeWidth="2" fill="none" opacity="0.2" />
        <path d="M110 42 L112 36" stroke="url(#catFurDark)" strokeWidth="2" fill="none" opacity="0.2" />

        {/* Body stripes */}
        <path d="M72 130 Q78 125 76 120" stroke="url(#catFurDark)" strokeWidth="2" fill="none" opacity="0.15" />
        <path d="M128 130 Q122 125 124 120" stroke="url(#catFurDark)" strokeWidth="2" fill="none" opacity="0.15" />
        <path d="M68 140 Q74 135 72 130" stroke="url(#catFurDark)" strokeWidth="2" fill="none" opacity="0.12" />
        <path d="M132 140 Q126 135 128 130" stroke="url(#catFurDark)" strokeWidth="2" fill="none" opacity="0.12" />

        {/* Collar */}
        <path d="M72 106 Q100 116 128 106" stroke="url(#catCollar)" strokeWidth="7" fill="none" strokeLinecap="round" />
        {/* Tag */}
        <circle cx="100" cy="115" r="5.5" fill="#fbbf24" />
        <circle cx="100" cy="115" r="3.5" fill="#f59e0b" />
        {/* Fish on tag */}
        <path d="M98 115 Q100 113 102 115 Q100 117 98 115" fill="#fbbf24" />
        <path d="M102 115 L104 113.5 L104 116.5 Z" fill="#fbbf24" />

        {/* Fur texture */}
        <path d="M80 122 L82 118" stroke="#E8983A" strokeWidth="0.8" opacity="0.12" />
        <path d="M120 122 L118 118" stroke="#E8983A" strokeWidth="0.8" opacity="0.12" />
        <path d="M90 135 L92 131" stroke="#E8983A" strokeWidth="0.8" opacity="0.1" />
        <path d="M110 135 L108 131" stroke="#E8983A" strokeWidth="0.8" opacity="0.1" />
      </g>
    </svg>
  )
}

// Inline-style versions for Puppeteer flyer rendering (no Tailwind classes)
export function dogSvgInline(size: number) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.2))' }}>
      <defs>
        <linearGradient id="dfi-fur" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4A574" />
          <stop offset="50%" stopColor="#C4956A" />
          <stop offset="100%" stopColor="#B8845C" />
        </linearGradient>
        <linearGradient id="dfi-furDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A0764E" />
          <stop offset="100%" stopColor="#8B6544" />
        </linearGradient>
        <linearGradient id="dfi-furLight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E8C9A8" />
          <stop offset="100%" stopColor="#D4A574" />
        </linearGradient>
        <radialGradient id="dfi-nose" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#4a3728" />
          <stop offset="100%" stopColor="#2d1810" />
        </radialGradient>
        <radialGradient id="dfi-eye" cx="35%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#5C3D2E" />
          <stop offset="100%" stopColor="#2d1810" />
        </radialGradient>
        <linearGradient id="dfi-collar" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <g>
        <ellipse cx="100" cy="138" rx="48" ry="38" fill="url(#dfi-fur)" />
        <ellipse cx="100" cy="130" rx="28" ry="24" fill="url(#dfi-furLight)" opacity="0.6" />
        <ellipse cx="72" cy="162" rx="14" ry="18" fill="url(#dfi-fur)" />
        <ellipse cx="128" cy="162" rx="14" ry="18" fill="url(#dfi-fur)" />
        <ellipse cx="68" cy="176" rx="12" ry="6" fill="url(#dfi-furLight)" />
        <ellipse cx="132" cy="176" rx="12" ry="6" fill="url(#dfi-furLight)" />
        <rect x="80" y="148" width="14" height="30" rx="7" fill="url(#dfi-fur)" />
        <rect x="106" y="148" width="14" height="30" rx="7" fill="url(#dfi-fur)" />
        <ellipse cx="87" cy="178" rx="10" ry="5" fill="url(#dfi-furLight)" />
        <ellipse cx="113" cy="178" rx="10" ry="5" fill="url(#dfi-furLight)" />
        <path d="M148 130 Q168 105 162 78 Q158 65 152 72" stroke="url(#dfi-fur)" strokeWidth="10" strokeLinecap="round" fill="none" />
        <circle cx="100" cy="72" r="38" fill="url(#dfi-fur)" />
        <ellipse cx="100" cy="82" rx="24" ry="20" fill="url(#dfi-furLight)" opacity="0.5" />
        <ellipse cx="60" cy="52" rx="16" ry="28" fill="url(#dfi-furDark)" transform="rotate(-20 60 52)" />
        <ellipse cx="60" cy="52" rx="10" ry="20" fill="#E8987A" opacity="0.4" transform="rotate(-20 60 52)" />
        <ellipse cx="140" cy="52" rx="16" ry="28" fill="url(#dfi-furDark)" transform="rotate(20 140 52)" />
        <ellipse cx="140" cy="52" rx="10" ry="20" fill="#E8987A" opacity="0.4" transform="rotate(20 140 52)" />
        <ellipse cx="100" cy="86" rx="18" ry="14" fill="url(#dfi-furLight)" opacity="0.8" />
        <ellipse cx="84" cy="68" rx="8" ry="9" fill="white" />
        <ellipse cx="116" cy="68" rx="8" ry="9" fill="white" />
        <circle cx="86" cy="68" r="6" fill="url(#dfi-eye)" />
        <circle cx="118" cy="68" r="6" fill="url(#dfi-eye)" />
        <circle cx="87" cy="67" r="3.5" fill="#1a1008" />
        <circle cx="119" cy="67" r="3.5" fill="#1a1008" />
        <circle cx="89" cy="65" r="2" fill="white" />
        <circle cx="121" cy="65" r="2" fill="white" />
        <path d="M74 60 Q84 55 92 60" stroke="#A0764E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M108 60 Q116 55 126 60" stroke="#A0764E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <ellipse cx="100" cy="82" rx="8" ry="5.5" fill="url(#dfi-nose)" />
        <ellipse cx="98" cy="80" rx="3" ry="2" fill="white" opacity="0.25" />
        <path d="M92 88 Q100 96 108 88" stroke="#8B6544" strokeWidth="1.5" fill="none" />
        <line x1="100" y1="87" x2="100" y2="92" stroke="#8B6544" strokeWidth="1.5" />
        <ellipse cx="100" cy="97" rx="6" ry="8" fill="#E8787A" />
        <ellipse cx="100" cy="95" rx="6" ry="4" fill="url(#dfi-furLight)" opacity="0.8" />
        <path d="M68 108 Q100 118 132 108" stroke="url(#dfi-collar)" strokeWidth="8" fill="none" strokeLinecap="round" />
        <circle cx="100" cy="118" r="6" fill="#fbbf24" />
        <circle cx="100" cy="118" r="4" fill="#f59e0b" />
      </g>
    </svg>
  )
}

export function catSvgInline(size: number) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.2))' }}>
      <defs>
        <linearGradient id="cfi-fur" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5B041" />
          <stop offset="50%" stopColor="#F5A623" />
          <stop offset="100%" stopColor="#E8983A" />
        </linearGradient>
        <linearGradient id="cfi-furDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4882A" />
          <stop offset="100%" stopColor="#C07820" />
        </linearGradient>
        <linearGradient id="cfi-furLight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FCE4B0" />
          <stop offset="100%" stopColor="#F5D08A" />
        </linearGradient>
        <radialGradient id="cfi-eye" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6DD400" />
          <stop offset="40%" stopColor="#2ECC71" />
          <stop offset="100%" stopColor="#1B8C4E" />
        </radialGradient>
        <radialGradient id="cfi-nose" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#F0A0A0" />
          <stop offset="100%" stopColor="#E87A7A" />
        </radialGradient>
        <linearGradient id="cfi-collar" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <g>
        <ellipse cx="100" cy="138" rx="42" ry="34" fill="url(#cfi-fur)" />
        <ellipse cx="100" cy="132" rx="22" ry="22" fill="url(#cfi-furLight)" opacity="0.6" />
        <ellipse cx="74" cy="160" rx="14" ry="16" fill="url(#cfi-fur)" />
        <ellipse cx="126" cy="160" rx="14" ry="16" fill="url(#cfi-fur)" />
        <ellipse cx="70" cy="174" rx="11" ry="5" fill="url(#cfi-furLight)" />
        <ellipse cx="130" cy="174" rx="11" ry="5" fill="url(#cfi-furLight)" />
        <rect x="82" y="150" width="12" height="26" rx="6" fill="url(#cfi-fur)" />
        <rect x="106" y="150" width="12" height="26" rx="6" fill="url(#cfi-fur)" />
        <ellipse cx="88" cy="176" rx="9" ry="4.5" fill="url(#cfi-furLight)" />
        <ellipse cx="112" cy="176" rx="9" ry="4.5" fill="url(#cfi-furLight)" />
        <path d="M142 145 Q165 130 160 105 Q156 85 148 95 Q142 105 148 110" stroke="url(#cfi-fur)" strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M155 115 Q160 112 158 108" stroke="url(#cfi-furDark)" strokeWidth="2" fill="none" opacity="0.25" />
        <circle cx="100" cy="72" r="36" fill="url(#cfi-fur)" />
        <ellipse cx="100" cy="80" rx="22" ry="18" fill="url(#cfi-furLight)" opacity="0.45" />
        <polygon points="66,52 52,14 82,42" fill="url(#cfi-fur)" />
        <polygon points="134,52 148,14 118,42" fill="url(#cfi-fur)" />
        <polygon points="67,50 56,22 78,43" fill="#E8987A" opacity="0.5" />
        <polygon points="133,50 144,22 122,43" fill="#E8987A" opacity="0.5" />
        <ellipse cx="84" cy="68" rx="10" ry="12" fill="white" />
        <ellipse cx="116" cy="68" rx="10" ry="12" fill="white" />
        <ellipse cx="84" cy="68" rx="7" ry="10" fill="url(#cfi-eye)" />
        <ellipse cx="116" cy="68" rx="7" ry="10" fill="url(#cfi-eye)" />
        <ellipse cx="84" cy="68" rx="2.5" ry="9" fill="#1a1a2e" />
        <ellipse cx="116" cy="68" rx="2.5" ry="9" fill="#1a1a2e" />
        <circle cx="87" cy="64" r="2.5" fill="white" />
        <circle cx="119" cy="64" r="2.5" fill="white" />
        <path d="M73 62 Q84 56 95 62" stroke="url(#cfi-furDark)" strokeWidth="1.5" fill="none" />
        <path d="M105 62 Q116 56 127 62" stroke="url(#cfi-furDark)" strokeWidth="1.5" fill="none" />
        <path d="M96 82 L100 86 L104 82 Z" fill="url(#cfi-nose)" />
        <path d="M94 88 Q100 93 106 88" stroke="#C07820" strokeWidth="1.2" fill="none" />
        <line x1="100" y1="86" x2="100" y2="90" stroke="#C07820" strokeWidth="1.2" />
        <line x1="70" y1="78" x2="40" y2="72" stroke="white" strokeWidth="1.3" opacity="0.6" />
        <line x1="70" y1="82" x2="38" y2="82" stroke="white" strokeWidth="1.3" opacity="0.6" />
        <line x1="70" y1="86" x2="40" y2="92" stroke="white" strokeWidth="1.3" opacity="0.6" />
        <line x1="130" y1="78" x2="160" y2="72" stroke="white" strokeWidth="1.3" opacity="0.6" />
        <line x1="130" y1="82" x2="162" y2="82" stroke="white" strokeWidth="1.3" opacity="0.6" />
        <line x1="130" y1="86" x2="160" y2="92" stroke="white" strokeWidth="1.3" opacity="0.6" />
        <path d="M82 52 Q100 46 118 52" stroke="url(#cfi-furDark)" strokeWidth="2.5" fill="none" opacity="0.3" />
        <path d="M86 58 Q100 53 114 58" stroke="url(#cfi-furDark)" strokeWidth="2" fill="none" opacity="0.25" />
        <path d="M72 106 Q100 116 128 106" stroke="url(#cfi-collar)" strokeWidth="7" fill="none" strokeLinecap="round" />
        <circle cx="100" cy="115" r="5.5" fill="#fbbf24" />
        <circle cx="100" cy="115" r="3.5" fill="#f59e0b" />
      </g>
    </svg>
  )
}

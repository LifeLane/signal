
'use client';

export function IntroLogo() {
  const asciiLogoLines = [
    '   .d8888b.  888    888 8888888b.  8888888b.   .d8888b.  888     888 ',
    '  d88P  Y88b 888    888 888   Y88b 888   Y88b d88P  Y88b 888     888 ',
    '  888    888 888    888 888    888 888    888 888    888 888     888 ',
    '  888        8888888888 888   d88P 888   d88P 888        888     888 ',
    '  888  88888 888    888 8888888P"  8888888P"  888  88888 888     888 ',
    '  888    888 888    888 888 T88b   888 T88b   888    888 Y88b. .d88P ',
    '  Y88b  d88P 888    888 888  T88b  888  T88b  Y88b  d88P  "Y88888P"  ',
    '   "Y8888P"  888    888 888   T88b 888   T88b  "Y8888P"     "Y88P"   ',
  ];

  return (
    <pre className="font-mono text-primary text-center text-[6px] md:text-[8px] leading-tight">
      {asciiLogoLines.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
    </pre>
  );
}

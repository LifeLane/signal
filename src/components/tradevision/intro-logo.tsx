
'use client';

export function IntroLogo() {
  const asciiLogoLines = [
    '███████╗██╗  ██╗ █████╗ ██████╗  ██████╗ ██╗    ██╗',
    '██╔════╝██║  ██║██╔══██╗██╔══██╗██╔═══██╗██║    ██║',
    '███████╗███████║███████║██║  ██║██║   ██║██║ █╗ ██║',
    '╚════██║██╔══██║██╔══██║██║  ██║██║   ██║██║███╗██║',
    '███████║██║  ██║██║  ██║██████╔╝╚██████╔╝╚███╔███╔╝',
    '╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝  ╚═════╝  ╚══╝╚══╝ ',
  ];

  return (
    <pre className="font-mono text-primary text-center text-[6px] md:text-[8px] leading-tight">
      {asciiLogoLines.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
    </pre>
  );
}


import type React from 'react';

const CssIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" {...props}>
    <path fill="#1572B6" d="M6 58l4.5-51.5L32 12l21.5-5.5L58 58z"/>
    <path fill="#33A9DC" d="M32 15.3l17.4-4.4L52.3 55 32 55z"/>
    <path fill="#EBEBEB" d="M32 34.1h-10l-.7-7.8h10.7v-6.6H19.9l.2 2.1 1.8 20.9h10.1v-6.5zm0 10.9h-.1l-5.9-1.6-.4-4.4h-6.6l1 11.6 11.9 3.2h.1v-6.8z"/>
    <path fill="#FFF" d="M42.7 26.3H32v6.6h9.3l-.7 7.8H32v6.6h8.6l-.9 10.1-8.6 2.3v6.8l11.9-3.2.1-.5 1.6-18.2.2-2.1h-3.2z"/>
  </svg>
);

export default CssIcon;

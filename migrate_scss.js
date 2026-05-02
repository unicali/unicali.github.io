const fs = require('fs');

const srcPath = 'C:\\Users\\USER\\source\\PAGINAS-WEB\\ANONIMO\\unicali\\elements\\cuarto\\cuarto.scss';
const destPath = 'C:\\Users\\USER\\source\\PAGINAS-WEB\\ANONIMO\\unicali\\src\\pages\\DevRoom.scss';

const originalColors = `
$bg-1: #322e4a;
$bg-2: #1c1a29;
$white-1: #FBFAFE;
$white-2: #9E99C1;
$white-3: #383358;
$white-4: #282347;
$black-1: #1f2158;
$black-2: #111231;
$black-3: #0a0b1e;
$neon-1: #5474FB;
$neon-2: #283CD2;
$cuadro-1: #D51E24;
$cuadro-2: #0F1110;
`;

const content = fs.readFileSync(srcPath, 'utf8');
const lines = content.split(/\r?\n/);

// Find Mixins
const mixinsStart = lines.findIndex(l => l.includes('@mixin cube('));
const mixinsEnd = lines.findIndex(l => l.includes('*, *::after, *::before')) - 1;
const mixins = lines.slice(mixinsStart, mixinsEnd + 1).join('\n');

// Find Generic
const genericStart = lines.findIndex(l => l.includes('*, *::after, *::before'));
const genericEnd = lines.findIndex(l => l.includes('body{')) - 1;
const generic = lines.slice(genericStart, genericEnd + 1).join('\n');

// Find Body
const bodyStart = lines.findIndex(l => l.includes('body{'));
const bodyEnd = lines.indexOf('}', bodyStart);
const bodyRules = lines.slice(bodyStart + 1, bodyEnd).join('\n');

// Find Rest and Keyframes
const faceStart = lines.findIndex(l => l.trim().startsWith('.face{'));
const keyframesStart = lines.findIndex(l => l.includes('@keyframes pantalla-tablet'));

const restContent = lines.slice(faceStart, keyframesStart).join('\n');
const keyframesContent = lines.slice(keyframesStart).join('\n');

const result = `
${originalColors}

${mixins}

.dev-room-page {
    ${bodyRules}

    ${generic}

    .room-scene {
        position: relative;
        width: 28vw;
        height: 28vw;
        display: flex;
        justify-content: center;
        align-items: center;
        perspective: 1000px;
        
        @media (max-width: 1024px) { transform: scale(1.5); }
        @media (max-width: 768px) { transform: scale(2.2); }
        @media (max-width: 480px) { transform: scale(3.5); }

        ${restContent}
    }
}

${keyframesContent}
`;

fs.writeFileSync(destPath, result);
console.log('Conversion complete!');

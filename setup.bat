@echo off
chcp 65001 >nul
cd /d "c:\Users\Ângelo C. Domingos\3D Objects\Repositorio\consultorioFront"
npm install
npm run build:css
pause

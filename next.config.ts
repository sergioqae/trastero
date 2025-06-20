import type {NextConfig} from 'next';

// IMPORTANTE PARA GITHUB PAGES:
// Reemplaza '/NOMBRE_DE_TU_REPOSITORIO' con el nombre real de tu repositorio en GitHub.
// Por ejemplo, si tu repositorio es 'https://github.com/tu-usuario/gestor-trasteros',
// entonces REPO_NAME debería ser '/gestor-trasteros'.
// Si estás desplegando un sitio de usuario/organización (ej. tu-usuario.github.io),
// entonces REPO_NAME debería ser una cadena vacía ''.

// Para desarrollo en Firebase Studio o local, mantén estas líneas comentadas.
// Para DESPLEGAR A GITHUB PAGES, DESCOMENTA las siguientes 3 líneas y asegúrate que REPO_NAME es correcto.
const REPO_NAME = '/trastero'; // Ejemplo: '/tu-repositorio-github'

const nextConfig: NextConfig = {
  output: 'export', // Necesario para generar un sitio estático para GitHub Pages
  basePath: REPO_NAME, // DESCOMENTAR PARA GITHUB PAGES
  assetPrefix: REPO_NAME ? `${REPO_NAME}/` : undefined, // DESCOMENTAR PARA GITHUB PAGES
  images: {
    unoptimized: true, // Desactiva la optimización de imágenes de Next.js para exportación estática
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  allowedDevOrigins: [
     'https://6000-firebase-studio-1747815302284.cluster-6vyo4gb53jczovun3dxslzjahs.cloudworkstations.dev',
     'https://*.cluster-6vyo4gb53jczovun3dxslzjahs.cloudworkstations.dev'
  ],
};

export default nextConfig;

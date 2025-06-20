import type {NextConfig} from 'next';

// IMPORTANTE PARA GITHUB PAGES:
// Reemplaza '/NOMBRE_DE_TU_REPOSITORIO' con el nombre real de tu repositorio en GitHub.
// Por ejemplo, si tu repositorio es 'https://github.com/tu-usuario/gestor-trasteros',
// entonces REPO_NAME debería ser '/gestor-trasteros'.
// Si estás desplegando un sitio de usuario/organización (ej. tu-usuario.github.io),
// entonces REPO_NAME debería ser una cadena vacía ''.
const REPO_NAME = '/trastero'; // CAMBIADO AL NOMBRE DE TU REPOSITORIO

const nextConfig: NextConfig = {
  output: 'export', // Necesario para generar un sitio estático para GitHub Pages
  basePath: REPO_NAME, // Necesario para que las rutas funcionen en GitHub Pages
  assetPrefix: REPO_NAME ? `${REPO_NAME}/` : undefined, // Necesario para que los assets se carguen correctamente
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
  // typescript: { // Temporalmente comentado
  //   ignoreBuildErrors: true,
  // },
  // eslint: { // Temporalmente comentado
  //   ignoreDuringBuilds: true,
  // },
  // allowedDevOrigins ya no es necesario aquí porque es para `next dev`
  // y no afecta la construcción para producción ni el despliegue estático.
  // Si lo necesitas para tu entorno de desarrollo local/en la nube, mantenlo,
  // pero asegúrate de que la URL que pusiste anteriormente sea correcta para ese entorno.
  // Para el despliegue en GitHub Pages, no tiene efecto.
  allowedDevOrigins: [
     'https://6000-firebase-studio-1747815302284.cluster-6vyo4gb53jczovun3dxslzjahs.cloudworkstations.dev',
  ],
};

export default nextConfig;

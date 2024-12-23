import glob from 'fast-glob';
import { cache } from 'react';

const exportNames = {
  blog: 'article',
  work: 'caseStudy',
};

export const loadMDXMetadata = cache(async (directory) => {
  if (!directory || !exportNames[directory]) {
    throw new Error(`Invalid directory: ${directory}`);
  }

  try {
    // Ajustado para encontrar page.mdx e page.mdx em subdiretórios
    const files = await glob(`${directory}/**/page.{mdx}`, {
      cwd: 'src/app',
      absolute: false,
    });

    const metadataPromises = files.map(async (filepath) => {
      // Extrai o ID do diretório pai do arquivo page.mdx
      const pathParts = filepath.split('/');
      const id = pathParts[pathParts.length - 2]; // Pega o nome do diretório que contém page.mdx

      try {
        // Caminho relativo para o import
        const modulePath = `src/app/${filepath}`;
        const mdxModule = await import(modulePath);
        const metadata = mdxModule[exportNames[directory]];

        if (!metadata) {
          console.warn(`No metadata found for ${filepath}`);
          return null;
        }

        return {
          id,
          href: `/${directory}/${id}`,
          ...metadata,
        };
      } catch (error) {
        console.error(`Error loading MDX file ${filepath}:`, error);
        return null;
      }
    });

    const results = await Promise.all(metadataPromises);

    // Filtra resultados nulos e ordena por data
    return results
      .filter(Boolean)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error(`Error loading MDX metadata from ${directory}:`, error);
    throw error;
  }
});

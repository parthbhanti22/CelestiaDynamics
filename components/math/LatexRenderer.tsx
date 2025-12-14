import React, { useMemo } from 'react';
import katex from 'katex';

interface LatexRendererProps {
  expression: string;
  block?: boolean;
}

export const LatexRenderer: React.FC<LatexRendererProps> = ({ expression, block = false }) => {
  const html = useMemo(() => {
    try {
      // Check if katex is loaded properly
      if (!katex || !katex.renderToString) {
         return `<span class="text-slate-500">Loading math...</span>`;
      }
      
      return katex.renderToString(expression, {
        throwOnError: false,
        displayMode: block,
        output: 'html', // Force HTML output to ensure consistent styling
        strict: false,
        trust: true,
      });
    } catch (e) {
      console.error("KaTeX Render Error:", e);
      // Fallback that looks like an error message but doesn't break layout
      return `<span class="text-red-400 font-mono text-xs p-1 border border-red-900 rounded bg-red-900/20 inline-block">Error rendering equation</span>`;
    }
  }, [expression, block]);

  return (
    <span 
      className={`${block ? "block my-6 text-center w-full overflow-x-auto" : "inline-block mx-1 align-middle text-cyan-300"}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
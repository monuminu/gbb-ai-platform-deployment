import HighlightJS from 'highlight.js';
import 'highlight.js/styles/base16/tomorrow-night.css';

// ----------------------------------------------------------------------

declare global {
  interface Window {
    HighlightJS: any;
  }
}

HighlightJS.configure({
  languages: ['javascript', 'typescript', 'markdown', 'python', 'html', 'css', 'json'],
});

if (typeof window !== 'undefined') {
  window.HighlightJS = HighlightJS;
}
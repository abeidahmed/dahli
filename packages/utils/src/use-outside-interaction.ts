export default function useOutsideInteraction(callback: (event: Event) => void, options = false) {
  document.addEventListener('pointerdown', callback, options);
  window.addEventListener('focusin', callback, options);

  return () => {
    document.removeEventListener('pointerdown', callback, options);
    window.removeEventListener('focusin', callback, options);
  };
}

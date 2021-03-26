export const pageVariants = {
  exit: {
    opacity: 0,
    x: 100,
    transition: { duration: 0.3 },
  },
  initial: {
    opacity: 0,
    x: -100,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, delay: 0.3 },
  },
};

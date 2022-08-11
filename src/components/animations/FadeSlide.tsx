import { FunctionalComponent, h } from "preact";
import { AnimatePresence, motion } from "framer-motion";

export const FadeInSlideLeft: FunctionalComponent = ({ children }) => {
  return (
    <motion.div
      transition={{ ease: "easeOut", duration: 0.25 }}
      initial={{
        x: 20,
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      //
    >
      {children}
    </motion.div>
  );
};

export const SiteListAnimation: FunctionalComponent = ({ children }) => {
  return (
    <AnimatePresence>
      <motion.div
        transition={{ ease: "easeOut", duration: 0.25 }}
        initial={{
          x: 20,
          opacity: 0,
          height: 0,
        }}
        animate={{
          x: 0,
          opacity: 1,
          height: "auto",
        }}
        exit={{
          x: 20,
          opacity: 0,
          height: 0,
        }}
        //
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export const FadeInSlideRight: FunctionalComponent = ({ children }) => {
  return (
    <motion.div
      transition={{ ease: "easeOut", duration: 0.25 }}
      initial={{
        x: -20,
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      //
    >
      {children}
    </motion.div>
  );
};

export const FadeIn: FunctionalComponent = ({ children }) => {
  return (
    <motion.div
      transition={{ ease: "easeOut", duration: 0.25 }}
      initial={{
        //   x: -20,
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        //   x: 0,
      }}
      //
    >
      {children}
    </motion.div>
  );
};

export const FadeOut: FunctionalComponent = ({ children }) => {
  return (
    <motion.div
      transition={{ ease: "easeOut", duration: 0.25 }}
      initial={{
        opacity: 1,
      }}
      animate={{
        opacity: 0,
      }}
      //
    >
      {children}
    </motion.div>
  );
};

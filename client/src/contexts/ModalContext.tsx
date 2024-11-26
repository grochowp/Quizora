import { createContext, useContext, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const centerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const topVariants = {
  hidden: { opacity: 0, top: -30 },
  visible: { opacity: 1, top: 60 },
  exit: { opacity: 0, top: -30 },
};

interface ModalProps {
  openModal: (
    modalBody: React.ReactNode,
    time: number,
    position?: "center" | "top",
  ) => void;
}

const defaultModal: ModalProps = {
  openModal: () => {},
};

export const ModalContext = createContext<ModalProps>(defaultModal);

export const ModalProvider = ({ children }: React.PropsWithChildren) => {
  const [modalBody, setModalBody] = useState<React.ReactNode>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [position, setPosition] = useState<"center" | "top">("center");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openModal = (
    modal: React.ReactNode,
    time: number,
    position: "center" | "top" = "center",
  ) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setModalBody(modal);
    setPosition(position);
    setIsOpen(true);

    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, time * 1000);
  };

  return (
    <ModalContext.Provider value={{ openModal }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={position === "center" ? centerVariants : topVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`absolute left-1/2 z-50 -translate-x-1/2 ${
              position === "center" ? "top-1/2 -translate-y-1/2" : "top-10"
            }`}
          >
            {modalBody}
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </ModalContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useLoggedUserContext must be used within a ModalContext");
  }
  return context;
};

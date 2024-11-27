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
    position?: "center" | "top",
    time?: number,
  ) => void;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultModal: ModalProps = {
  openModal: () => {},
  setIsModalOpen: () => {},
};

export const ModalContext = createContext<ModalProps>(defaultModal);

export const ModalProvider = ({ children }: React.PropsWithChildren) => {
  const [modalBody, setModalBody] = useState<React.ReactNode>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [position, setPosition] = useState<"center" | "top">("center");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [modalTime, setModalTime] = useState<number | undefined>();

  const openModal = (
    modal: React.ReactNode,
    position: "center" | "top" = "center",
    time?: number,
  ) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setModalTime(time);
    setModalBody(modal);
    setPosition(position);
    setIsModalOpen(true);

    if (time) {
      timeoutRef.current = setTimeout(() => {
        setIsModalOpen(false);
      }, time * 1000);
    }
  };

  return (
    <ModalContext.Provider value={{ openModal, setIsModalOpen }}>
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            variants={position === "center" ? centerVariants : topVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed left-1/2 z-50 -translate-x-1/2 ${
              position === "center" ? "top-1/2 -translate-y-1/2" : "top-12"
            }`}
          >
            {modalBody}
            {modalTime && (
              <motion.div
                initial={{
                  width: "98%",
                }}
                animate={{
                  width: 0,
                  transition: {
                    width: {
                      duration: modalTime,
                    },
                  },
                }}
                className="absolute bottom-[1px] mx-[5px] h-[2px] w-[98%] translate-y-[.9px] rounded-full bg-extras"
              ></motion.div>
            )}
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

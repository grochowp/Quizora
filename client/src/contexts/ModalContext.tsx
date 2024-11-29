import { createContext, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IModalBody } from "../interfaces";

const centerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const topVariants = {
  hidden: { opacity: 0, top: -30 },
  visible: (index: number) => {
    const screenWidth = window.innerWidth;
    const offset = screenWidth >= 768 ? 105 : 90;
    return { opacity: 1, top: 60 + index * offset };
  },
  exit: { opacity: 0, top: -30 },
};

interface ModalProps {
  openModal: (
    modalBody: React.ReactNode,
    position?: "center" | "top",
    time?: number,
  ) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
}

const defaultModal: ModalProps = {
  openModal: () => {},
  closeModal: () => {},
  closeAllModals: () => {},
};

export const ModalContext = createContext<ModalProps>(defaultModal);

export const ModalProvider = ({ children }: React.PropsWithChildren) => {
  const [modals, setModals] = useState<IModalBody[]>([]);

  const openModal = (
    modalBody: React.ReactNode,
    position: "center" | "top" = "center",
    time?: number,
  ) => {
    const id = crypto.randomUUID();
    setModals((prev) => [...prev, { id, body: modalBody, position, time }]);

    if (time) {
      setTimeout(() => {
        setModals((prev) => prev.filter((modal) => modal.id !== id));
      }, time * 1000);
    }
  };

  const closeModal = (id: string) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id));
  };

  const closeAllModals = () => {
    setModals([]);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, closeAllModals }}>
      <AnimatePresence>
        {modals.map((modal, index) => (
          <motion.div
            key={modal.id}
            custom={index}
            variants={
              modal.position === "center" ? centerVariants : topVariants
            }
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed left-1/2 z-50 -translate-x-1/2 ${
              modal.position === "center" ? "top-1/2 -translate-y-1/2" : ""
            }`}
          >
            {modal.body}
            <IoIosCloseCircleOutline
              className="absolute right-2 top-2 cursor-pointer text-xl"
              onClick={() => closeModal(modal.id)}
            />
            {modal.time && (
              <motion.div
                initial={{ width: "98%" }}
                animate={{
                  width: 0,
                  transition: { duration: modal.time },
                }}
                className="absolute bottom-[1px] mx-[5px] h-[2px] w-[98%] translate-y-[.9px] rounded-full bg-extras"
              ></motion.div>
            )}
          </motion.div>
        ))}
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

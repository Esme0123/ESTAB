import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

function SuccessModal({ open, message = "Operación realizada correctamente.", onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.1 }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-green/10"
            >
              <CheckCircle2 className="h-12 w-12 text-brand-green" />
            </motion.span>

            <h3 className="mt-5 text-xl font-extrabold text-navy">Operación exitosa</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{message}</p>

            <button
              onClick={onClose}
              className="mt-6 w-full rounded-full bg-brand-green px-6 py-3 font-bold text-white shadow-lg shadow-brand-green/30 transition hover:bg-brand-green-dark"
            >
              Aceptar
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default SuccessModal
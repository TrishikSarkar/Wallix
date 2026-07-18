"use client";

import { useState } from "react";
import { Heart, Mail, X, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Footer() {
  const [supportOpen, setSupportOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const upiId = "trishiksarkar@fam";

  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      //
    }
  };

  return (
    <>
      <footer className="w-full px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-sm max-md:flex-col max-md:items-center max-md:gap-3 max-md:text-center">
          <p className="text-[#6b7280]">&copy; 2026 Wallix</p>
          <p className="text-[#6b7280] max-md:order-3">
            Created By{" "}
            <a
              href="https://www.linkedin.com/in/trishik-sarkar/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#111111] underline-offset-2 hover:underline transition-all duration-150"
            >
              @TrishikSarkar
            </a>
          </p>
          <div className="flex items-center gap-4 max-md:order-2">
            <a
              href="mailto:trishiksarkar1508@gmail.com?subject=Wallix%20Feedback&body=Hello%20Trishik%2C%0A%0AI%20would%20like%20to%20share%20the%20following%20feedback%20about%20Wallix%3A%0A----------------------------"
              className="flex items-center gap-1.5 text-[#6b7280] transition-colors hover:text-[#111111]"
            >
              <Mail className="h-[18px] w-[18px]" strokeWidth={1.5} />
              <span className="text-sm font-medium">Feedback</span>
            </a>
            <button
              onClick={() => setSupportOpen(true)}
              className="flex items-center gap-1.5 text-[#6b7280] transition-colors hover:text-[#111111]"
            >
              <Heart className="h-[18px] w-[18px]" strokeWidth={1.5} />
              <span className="text-sm font-medium">Support</span>
            </button>
            <a
              href="https://github.com/TrishikSarkar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6b7280] transition-colors hover:text-[#111111]"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {supportOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
            onClick={() => setSupportOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[400px] rounded-[24px] bg-white p-6 shadow-xl text-center"
            >
              <button
                onClick={() => setSupportOpen(false)}
                className="absolute right-4 top-4 text-[#6b7280] hover:text-[#111111] transition-colors"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>

              <div className="text-4xl mb-3">❤️</div>
              <h2 className="text-lg font-semibold text-[#111111]">Support Wallix</h2>
              <p className="mt-2 text-sm text-[#6b7280] leading-relaxed">
                Wallix is completely free.
                <br />
                No ads.
                <br />
                No login.
                <br />
                No tracking.
              </p>
              <p className="mt-3 text-sm text-[#6b7280] leading-relaxed">
                If this project helped you,
                <br />
                you can support its development.
              </p>

              <div className="mt-5 flex justify-center">
                <img
                  src="/qr.png"
                  alt="UPI QR Code"
                  className="w-40 h-40 rounded-xl border border-[#eaeaea]"
                />
              </div>

              <div className="mt-4 flex items-center justify-center gap-2">
                <code className="rounded-lg bg-[#f5f5f5] px-3 py-2 text-sm font-mono text-[#111111]">
                  {upiId}
                </code>
                <button
                  onClick={copyUpiId}
                  className="rounded-lg bg-[#f5f5f5] p-2 text-[#6b7280] hover:text-[#111111] transition-colors"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" strokeWidth={1.5} />
                  ) : (
                    <Copy className="h-4 w-4" strokeWidth={1.5} />
                  )}
                </button>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <button
                  onClick={copyUpiId}
                  className="w-full rounded-[14px] bg-[#111111] py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  {copied ? "Copied!" : "Copy UPI ID"}
                </button>
                <button
                  onClick={() => setSupportOpen(false)}
                  className="w-full py-2 text-sm text-[#6b7280] hover:text-[#111111] transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function ConfirmPopup({
  popupTitle,
  message,
  afterConfirm,
  popupState,
  setPopupState,
}: {
  popupTitle: string;
  message: string;
  afterConfirm: () => any;
  popupState: boolean;
  setPopupState: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Transition show={popupState} as={Fragment}>
      <Dialog
        className="relative z-50"
        open={popupState}
        onClose={() => setPopupState(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 flex flex-col w-screen items-center justify-center">
            <Dialog.Panel className="mx-auto max-w-sm rounded bg-sky-100 dark:bg-gray-900 p-5">
              <Dialog.Title className="font-bold text-red-500 mb-1">
                {popupTitle}
              </Dialog.Title>
              <Dialog.Description className="mb-5">
                {message}
              </Dialog.Description>
              <div className="flex justify-around">
                <button
                  className="border border-red-700 rounded-full p-3 px-5 hover:bg-red-500 hover:text-white"
                  onClick={afterConfirm}
                >
                  Yes!
                </button>
                <button
                  className="border border-sky-700 rounded-full p-3 px-4 hover:bg-sky-500 hover:text-white"
                  onClick={() => setPopupState(false)}
                >
                  Nooo
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

"use client";
import { HiPhotograph } from "react-icons/hi";
import { useBoardStore } from "@/Store/BoardStore";
import { useModalStore } from "@/Store/ModalStore";
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useRef } from "react";
import RadioGroupType from "./RadioGroupType";
import Image from "next/image";

function Modal() {
  const imagePickerRef = useRef<HTMLInputElement>(null);
  const [isOpen, closeModal] = useModalStore((state) => [
    state.isOpen,
    state.closeModal,
  ]);
  const [image, newTaskInput, setNewTaskInput, setImage] = useBoardStore(
    (state) => [
      state.image,
      state.newTaskInput,
      state.setNewTaskInput,
      state.setImage,
    ]
  );
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="form" className="relative z-10" onClose={closeModal}>
        {/*
          Use one Transition.Child to apply one transition to the backdrop...
        */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              {/* <div className="fixed inset-0 bg-black bg-opacity-25" /> */}
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 pb-2"
                >
                  Add a Task
                </Dialog.Title>
                <div className="mt-2">
                  <input
                    type="text"
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    className="w-full border boder-gray-300 rounded-md outline-none p-5"
                  />
                </div>
                {/* Radio Group */}
                <RadioGroupType />
                <div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      imagePickerRef?.current?.click();
                    }}
                    className="w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 flex gap-2 items-center justify-center"
                  >
                    <HiPhotograph className="text-3xl inline-block" />
                    Upload Image
                  </button>
                  {image && (
                    <Image
                      alt="upload image"
                      width={200}
                      height={200}
                      className="w-full h-44 object-cover mt-2 filter hover:grayscale transition-all duration-150 cursor-not-allowed"
                      src={URL.createObjectURL(image)}
                      onClick={() => setImage(null)}
                    />
                  )}
                  <button>
                    <input
                      type="file"
                      id="image-file"
                      ref={imagePickerRef}
                      hidden
                      onChange={(e) => {
                        if (!e.target.files![0].type.startsWith("image/"))
                          return;
                        setImage(e.target.files![0]);
                      }}
                    />
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default Modal;

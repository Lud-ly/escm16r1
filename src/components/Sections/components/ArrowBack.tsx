"use client";
import { IoMdArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { ArrowBackProps } from "~/types/types";

export default function ArrowBack({ iSize }: ArrowBackProps) {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };
  return (
    <div className="my-1">
      <button onClick={goBack} type="button">
        <IoMdArrowBack size={iSize} />
      </button>
    </div>
  );
}

import { ProgressSpinner } from "primereact/progressspinner";
import React from "react";

export default function LoadingFull() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-20">
      <ProgressSpinner />
    </div>
  );
}

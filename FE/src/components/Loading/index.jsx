import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";

export default function Loading() {
  return (
    <div
      className="flex justify-center items-center"
      style={{ height: "200px" }}
    >
      <ProgressSpinner />
    </div>
  );
}

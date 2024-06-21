import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ContextMenu } from "primereact/contextmenu";
import { Paginator } from "primereact/paginator";
import { Toast } from "primereact/toast";
import { ProductService } from "../../services/ProductService";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import "./index.css";
import Document from "../Document";

export default function ManageDocument() {
  return (
    <div>
      {/* menubar */}
      <div className="flex justify-center border-b-2 border-[#D1F7FF]">
        <h1 className="p-5 cursor-pointer hover:bg-[#D1F7FF] bg-[#D1F7FF]">
          Tài liệu
        </h1>
        <h1 className="p-5 cursor-pointer hover:bg-[#D1F7FF]">Chủ đề</h1>
        <h1 className="p-5 cursor-pointer hover:bg-[#D1F7FF]">Bài học</h1>
      </div>
      <Document />
    </div>
  );
}

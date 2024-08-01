import PostContentItemList from "./PostContentItemList";
import { Paginator } from "primereact/paginator";

import React, { useContext, useState } from "react";

import PostContext from "../../store/PostContext";
const tabsData = [
  {
    label: " Tất cả",
    content: <PostContentItemList />,
  },
  {
    label: " Câu hỏi hay",
    content:
      "Fugiat dolor et quis in incididunt aute. Ullamco voluptate consectetur dolor officia sunt est dolor sint.",
  },
  {
    label: "Chưa trả lời",
    content:
      "Fugiat dolor et quis in incididunt aute. Ullamco voluptate consectetur dolor officia sunt est dolor sint.",
  },
  {
    label: "Câu hỏi của tôi",
    content: <PostContentItemList myQuestion={true} />,
  },
];
function PostContentItem(props) {
  const { first, rows, totalPage, onPageChange, setItemSidebar } =
    useContext(PostContext);

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  return (
    <div>
      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        {tabsData.map((tab, idx) => (
          <li key={idx} className="me-2">
            <a
              href="#"
              className={`inline-block p-4 rounded-t-lg ${
                idx === activeTabIndex
                  ? "text-blue-600 font-bold bg-gray-100 active dark:bg-gray-800 dark:text-blue-500"
                  : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              }`}
              onClick={(e) => {
                e.preventDefault();
                if (idx === 0) {
                  setItemSidebar({
                    itemSelected: undefined,
                  });
                } else if (idx === 3) {
                  setItemSidebar({
                    itemSelected: "myQuestion",
                  });
                }
                setActiveTabIndex(idx);
              }}
              tabindex={idx === activeTabIndex ? "0" : "-1"}
              aria-selected={idx === activeTabIndex}
            >
              {tab.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        {/* Render the content of the active tab */}
        {tabsData[activeTabIndex].content}
      </div>
      <Paginator
        first={first}
        rows={rows}
        rowsPerPageOptions={[10, 20, 30]}
        totalRecords={totalPage * rows} // Total records should be calculated based on total pages and rows per page
        onPageChange={onPageChange}
        className="custom-paginator mx-auto"
      />
    </div>
  );
}

export default PostContentItem;

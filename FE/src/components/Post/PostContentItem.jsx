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
    content:
      "Fugiat dolor et quis in incididunt aute. Ullamco voluptate consectetur dolor officia sunt est dolor sint.",
  },
];
function PostContentItem(props) {
  const { first, rows, totalPage, onPageChange, setItemSidebar } =
    useContext(PostContext);

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  return (
    <div>
      <div className="flex space-x-9 border-b">
        {/* Loop through tab data and render button for each. */}
        {tabsData.map((tab, idx) => {
          return (
            <button
              key={idx}
              className={`py-2 border-b-4 transition-colors duration-300 ${
                idx === activeTabIndex
                  ? "border-blue-600"
                  : "border-transparent hover:border-gray-200"
              }`}
              // Change the active tab on click.
              onClick={() => {
                if (idx === 0) {
                  {
                    setItemSidebar(0);
                  }
                }
                setActiveTabIndex(idx);
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {/* Show active tab content. */}
      <div className="py-4">{tabsData[activeTabIndex].content}</div>

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

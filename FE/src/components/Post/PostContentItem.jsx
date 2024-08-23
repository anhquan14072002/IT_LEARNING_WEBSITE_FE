import PostContentItemList from "./PostContentItemList";
import { Paginator } from "primereact/paginator";

import React, { useContext, useState } from "react";

import PostContext from "../../store/PostContext";
import { BASE_URL_FE } from "../../services/restClient";
import { useNavigate } from "react-router-dom";
const tabsData = [
  {
    label: " Tất cả",
    content: <PostContentItemList />,
  },
  {
    label: " Câu hỏi ưa thích",

    content: <PostContentItemList goodQuestion={true} />,
  },
  {
    label: "Chưa trả lời",
    content: <PostContentItemList notAnswer={true} />,
  },
  {
    label: "Câu hỏi của tôi",
    content: <PostContentItemList myQuestion={true} />,
  },
];
function PostContentItem(props) {
  const navigate = useNavigate();
  const { first, rows, totalPage, onPageChange, setItemSidebar } =
    useContext(PostContext);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  function detailNotification() {
    let link = BASE_URL_FE + "/post/0";
    if (link) {
      if (link.startsWith("http://") || link.startsWith("https://")) {
        // Absolute URL: Use window.location.href for navigation
        window.location.href = link;
      } else {
        // Relative URL: Use navigate from React Router
        navigate(link, { replace: true });
      }
    }
  }
  return (
    <div>
      <ul className="flex flex-wrap text-md font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-200 dark:text-gray-400">
        {tabsData.map((tab, idx) => (
          <li key={idx} className="me-2">
            <a
              href="#"
              className={`inline-block p-4 rounded-t-lg ${
                idx === activeTabIndex
                  ? "text-blue-500 font-bold bg-gray-100 active dark:bg-gray-100 dark:text-blue-500"
                  : "hover:text-gray-600  hover:bg-gray-50 dark:hover:bg-gray-100 dark:hover:text-gray-500"
              }`}
              onClick={(e) => {
                e.preventDefault();
                if (idx === 0) {
                  setItemSidebar((preValue) => {
                    return { gradeIdSelected: undefined, itemTab: undefined };
                  });
                  detailNotification();
                } else if (idx === 3) {
                  setItemSidebar((preValue) => {
                    return {
                      gradeIdSelected: undefined,
                      itemTab: "myQuestion",
                    };
                  });
                } else if (idx === 2) {
                  setItemSidebar((preValue) => {
                    return { gradeIdSelected: undefined, itemTab: "notAnswer" };
                  });
                } else if (idx === 1) {
                  setItemSidebar((preValue) => {
                    return {
                      gradeIdSelected: undefined,
                      itemTab: "goodQuestion",
                    };
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

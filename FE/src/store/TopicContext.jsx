import {
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useFetch } from "use-http";

export const TopicContext = createContext({
  data: [],
  idSelected: 0,
  isShow: false,
  onShow: () => {},
  onPageChange: () => {},
  editTopic: () => {},
  deleteData: () => {},
});
const topicFake = [
  {
    Id: 1,
    Title: "Giới thiệu về Máy tính và Phần cứng (Lớp 3)",
    Description: "Tìm hiểu về các thành phần cơ bản của máy tính và phần cứng.",
    Objectives:
      "Hiểu các thành phần chính của máy tính như CPU, RAM, và ổ cứng.",
    Document: { id: 1, title: "Sách giáo khoa Công nghệ thông tin lớp 3" },
  },
  {
    Id: 2,
    Title: "Sử dụng Phần mềm Đơn giản (Lớp 4)",
    Description:
      "Hướng dẫn cách sử dụng các phần mềm cơ bản như Paint và Notepad.",
    Objectives:
      "Biết cách mở, lưu và chỉnh sửa file trong các phần mềm cơ bản.",
    Document: { id: 2, title: "Sách giáo khoa Công nghệ thông tin lớp 4" },
  },
  {
    Id: 3,
    Title: "Làm quen với Internet (Lớp 5)",
    Description:
      "Giới thiệu về Internet và các khái niệm cơ bản như trình duyệt web và email.",
    Objectives:
      "Hiểu cách sử dụng trình duyệt web để tìm kiếm thông tin và gửi email.",
    Document: { id: 3, title: "Sách giáo khoa Công nghệ thông tin lớp 5" },
  },
  {
    Id: 4,
    Title: "Lập trình Cơ bản với Scratch (Lớp 6)",
    Description:
      "Học cách lập trình cơ bản bằng Scratch, một ngôn ngữ lập trình đồ họa.",
    Objectives:
      "Tạo ra các dự án đơn giản như trò chơi và câu chuyện tương tác.",
    Document: { id: 4, title: "Sách giáo khoa Công nghệ thông tin lớp 6" },
  },
  {
    Id: 5,
    Title: "Microsoft Office Cơ bản (Lớp 7)",
    Description:
      "Giới thiệu về các ứng dụng trong bộ Microsoft Office như Word, Excel và PowerPoint.",
    Objectives:
      "Biết cách tạo, chỉnh sửa và định dạng văn bản, bảng tính và bài thuyết trình.",
    Document: { id: 5, title: "Sách giáo khoa Công nghệ thông tin lớp 7" },
  },
];
const actionMethod = {
  add: "Add_Item",
  remove: "Remove_Item",
  update: "Update_Item",
  deleteMany: "Delete_Many_Item",
  replaceItem: "replace_topic",
};

export default function TopicContextProvider({ children }) {
  const [isShow, setIsShow] = useState(false);
  const [topicId, setTopicId] = useState(0);
  const [data, setData] = useState(null);
  const [dataTest, setDataTest] = useState(null);
  const { get, post, response, loading, error } = useFetch("/topic"); //
  async function loadInitialTopic() {
    const initialTopic = await get("/getalltopic");
    console.log(initialTopic);
    if (response.ok) {
      setDataTest(initialTopic.data);
    }
  }
  useEffect(() => {
    loadInitialTopic();
  }, []);
  console.log(dataTest);
  /* function name: delete topic from button agree 
  parameter: 
  created by: Đặng Đình Quốc Khánh */
  async function deleteData(topic) {
    try {
      // test add topic
      const response = await post("/createtopic", {
        title: "string",
        description: "string",
        objectives: "string",
        documentId: 1,
        isActive: true,
      });
      console.log(1234);
      console.log(response);
      if (response.isSucceeded) {
        // setDataTest([response, ...dataTest]);
        await loadInitialTopic();
      }
      /* solution: Where is the origin of action from ? 
          -  */
      let updatedArray = data.filter((obj) => obj.Id !== topic.Id);
      setData(updatedArray);
    } catch (err) {
      // handle the error
      if (err instanceof Error) {
        console.error(`Error: ${err.name}`); // the type of error
        console.error(err.message); // the description of the error
      } else {
        // handle other errors
        console.error("Error Unknown:");
        console.error(err);
      }
    }
  }

  useEffect(() => {
    // TopicService.getTopics().then((data) => setTopics(data));
    if (topicFake) {
      setData(topicFake);
    }
  }, []);
  /* function name: show dialog
  parameter:
  created by: Đặng Đình Quốc Khánh */
  function onShow() {
    try {
      /* solution: Where is the origin of action from ?
          -  */
      setIsShow(!isShow);
    } catch (err) {
      // handle the error
      if (err instanceof Error) {
        console.error(`Error: ${err.name}`); // the type of error
        console.error(err.message); // the description of the error
      } else {
        // handle other errors
        console.error("Error Unknown:");
        console.error(err);
      }
    }
  }

  /* function name: handle page change when i click change page 
  parameter: event is default of s 
  created by: Đặng Đình Quốc Khánh */
  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
    const topicNext = [
      {
        Id: 6,
        Title: "Lập trình với Python (Lớp 8)",
        Description:
          "Giới thiệu về ngôn ngữ lập trình Python và các khái niệm cơ bản.",
        Objectives:
          "Viết các chương trình đơn giản và hiểu về biến, vòng lặp và hàm.",
        status: active,
        Document: { id: 6, title: "Sách giáo khoa Công nghệ thông tin lớp 8" },
      },
      {
        Id: 7,
        Title: "Thiết kế Web cơ bản (Lớp 9)",
        Description:
          "Học cách thiết kế trang web đơn giản sử dụng HTML và CSS.",
        Objectives:
          "Tạo và định dạng trang web với các yếu tố cơ bản như văn bản, hình ảnh và liên kết.",
        Document: { id: 7, title: "Sách giáo khoa Công nghệ thông tin lớp 9" },
      },
      {
        Id: 8,
        Title: "An ninh mạng cơ bản (Lớp 10)",
        Description:
          "Giới thiệu về các khái niệm cơ bản của an ninh mạng và bảo mật thông tin.",
        Objectives:
          "Hiểu về các mối đe dọa bảo mật thông tin và cách bảo vệ dữ liệu cá nhân.",
        Document: { id: 8, title: "Sách giáo khoa Công nghệ thông tin lớp 10" },
      },
      {
        Id: 9,
        Title: "Phát triển Ứng dụng di động (Lớp 11)",
        Description:
          "Học cách phát triển ứng dụng di động đơn giản sử dụng Android Studio.",
        Objectives:
          "Tạo ra các ứng dụng di động cơ bản và hiểu về các thành phần của ứng dụng Android.",
        Document: { id: 9, title: "Sách giáo khoa Công nghệ thông tin lớp 11" },
      },
      {
        Id: 10,
        Title: "Trí tuệ Nhân tạo Cơ bản (Lớp 12)",
        Description:
          "Giới thiệu về các khái niệm cơ bản của trí tuệ nhân tạo và học máy.",
        Objectives:
          "Hiểu về các thuật toán cơ bản của học máy và áp dụng chúng vào các dự án nhỏ.",
        Document: {
          id: 10,
          title: "Sách giáo khoa Công nghệ thông tin lớp 12",
        },
      },
    ];

    setData((preVlue) => {
      return [...topicNext];
    });
  };
  /* function name: handle edit topic 
parameter: topic is send object 
created by: Đặng Đình Quốc Khánh */
  const editTopic = (topic) => {
    try {
      setTopicId(topic.Id);
      setIsShow(true);
    } catch (err) {
      // handle the error
      if (err instanceof Error) {
        console.error(`Error: ${err.name}`); // the type of error
        console.error(err.message); // the description of the error
      } else {
        // handle other errors
        console.error("Error Unknown:");
        console.error(err);
      }
    }
  };

  return (
    <TopicContext.Provider
      value={{
        isShow,
        onShow,
        data,
        idSelected: topicId,
        onPageChange,
        editTopic,
        deleteData,
      }}
    >
      {children}
    </TopicContext.Provider>
  );
}

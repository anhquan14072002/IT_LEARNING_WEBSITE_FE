import { createContext, useEffect, useState } from "react";
import { useFetch } from "use-http";

export const TopicContext = createContext({
  idSelected: 0,
  isShow: false,
  onShow: () => {},
});

export default function TopicContextProvider({ children }) {
  const [isShow, setIsShow] = useState(false);
  const [topicId, setTopicId] = useState(0);

  /* function name: show dialog
  parameter:
  created by: Đặng Đình Quốc Khánh */
  function onShow(id = 0) {
    try {
      /* solution: Where is the origin of action from ?
          -  */
      setTopicId(id);
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

  return (
    <TopicContext.Provider
      value={{
        isShow,
        onShow,
        idSelected: topicId,
      }}
    >
      {children}
    </TopicContext.Provider>
  );
}

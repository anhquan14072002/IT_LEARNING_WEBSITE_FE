import React from "react";
import TopicList from "../ManagementTopic/TopicList";
import { Provider } from "use-http";
export default function Topic() {
  return (
    <Provider url="https://localhost:7000/api">
      <TopicList />
    </Provider>
  );
}

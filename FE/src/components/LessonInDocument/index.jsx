import React from "react";
import './index.css';

export default function LessonInDocument({ display, documentList }) {
  return (
    <div className="w-[15%] bg-gray-100 border-r-2 flex flex-col gap-3 min-h-screen pt-5 pb-">
      <div
        className={`fixed w-[15%] ${
          display
            ? "transition duration-200 ease-in-out opacity-0"
            : "transition duration-200 ease-in-out opacity-100"
        } `}
      >
        <h1 className="font-bold text-lg pl-2">{documentList.title}</h1>
        <div className="overflow-y-auto h-[75vh] custom-scrollbar">
          {documentList.topic &&
            documentList.topic.childTopics &&
            documentList.topic.childTopics.map((childTopic, index) => (
              <div key={index} className="mb-4">
                <h2 className="font-semibold pl-1">{childTopic.title}</h2>
                {Array.isArray(childTopic.lessons) && childTopic.lessons.length > 0 ? (
                  <ul className="list-disc pl-6">
                    {childTopic.lessons.map((lesson, idx) => (
                      <li key={idx}>{lesson.title}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No lessons available for this topic</p>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

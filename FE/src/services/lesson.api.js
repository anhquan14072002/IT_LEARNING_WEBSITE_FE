import restClient from "./restClient";

export const getLessonById = async (id,setLoading,setLesson) => {
    setLoading(true);
    await restClient({
        url: `api/lesson/getlessonbyid/${id}`,
        method: "GET",
    })
        .then((res) => {
            setLesson(res.data.data || {});
            setLoading(false);
        })
        .catch((err) => {
            setLesson({});
            setLoading(false);
        });
}
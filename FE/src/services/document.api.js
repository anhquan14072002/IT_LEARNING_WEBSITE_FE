import restClient from "./restClient";

export const getDocumentByGradeId = async (id,setLoading,setDocumentList) => {
    setLoading(true);
    await restClient({
        url: `api/document/getalldocumentbygrade/`+id,
        method: "GET",
    })
        .then((res) => {
            setDocumentList(res.data.data || []);
            setLoading(false);
        })
        .catch((err) => {
            setListClass([]);
            setLoading(false);
        });
}

export const getAllDocument = async (setLoading,setDocumentList) => {
    setLoading(true);
    await restClient({
        url: `api/document/getalldocument`,
        method: "GET",
    })
        .then((res) => {
            setDocumentList(res.data.data || []);
            setLoading(false);
        })
        .catch((err) => {
            setListClass([]);
            setLoading(false);
        });
}
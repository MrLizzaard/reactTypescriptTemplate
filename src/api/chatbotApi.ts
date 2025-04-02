import axios from "./axiosInstance";

interface ChatbotResponse {
  reply: string;
}

export const sendChatMessage = async (message: string): Promise<ChatbotResponse> => {
  const res = await axios.post("/chatbot", { message }, { skipLoading: true });
  console.log(res);
  return res.data.data;
};

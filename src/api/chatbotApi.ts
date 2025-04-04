import axiosInstance from "./axiosInstance";

interface ChatbotResponse {
  reply: string;
}

export const sendChatMessage = async (message: string): Promise<ChatbotResponse> => {
  const res = await axiosInstance.post("/chatbot", { message }, { skipLoading: true });
  return res.data.data;
};

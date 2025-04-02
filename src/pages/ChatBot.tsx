// src/pages/ChatBot.tsx
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { sendChatMessage } from "../api/chatbotApi";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 80vh;
  max-width: 600px;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
`;

const ChatLog = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  background: #f9f9f9;
`;

const InputWrapper = styled.form`
  display: flex;
  border-top: 1px solid #ccc;
`;

const Input = styled.input`
  flex: 1;
  padding: 1rem;
  border: none;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 1rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
`;

const ResetButton = styled.button`
  align-self: flex-end;
  margin: 1rem;
  padding: 0.5rem 1rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

const ChatBot = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const isFirstRender = useRef(true);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // 👉 1. LocalStorage에서 대화 복원
  useEffect(() => {
    const saved = localStorage.getItem("chat_messages");

    if (saved) {
      const parsed = JSON.parse(saved);
      setMessages(parsed);
    }
  }, []);

  // 👉 2. 대화 저장
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    localStorage.setItem("chat_messages", JSON.stringify(messages));
  }, [messages]);

  // 👉 3. 자동 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = `👤 ${input}`;
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendChatMessage(input);
      setLoading(false);

      // 👉 4. 타이핑 애니메이션
      const botText = res.reply;
      let typed = "";
      setMessages((prev) => [...prev, `🤖 _`]); // 메시지 마지막 갱신
      for (let i = 0; i < botText.length; i++) {
        typed += botText[i];
        const current = `🤖 ${typed}_`;
        setMessages((prev) => [...prev.slice(0, -1), current]); // 메시지 마지막 갱신
        await new Promise((r) => setTimeout(r, 30));
      }

      setMessages((prev) => [...prev.slice(0, -1), `🤖 ${botText}`]);
    } catch (err: any) {
      setMessages((prev) => [...prev, "❌ 오류: 챗봇 응답을 불러오지 못했습니다."]);
      console.error(err);
    } finally {
      setLoading(false);
    }

    setInput("");
  };

  const handleReset = () => {
    const confirmReset = window.confirm("정말로 대화를 초기화하시겠습니까?");
    if (!confirmReset) return;

    setMessages([]);
    localStorage.removeItem("chat_messages");
  };

  return (
    <>
      <Container>
        <ResetButton onClick={handleReset}>대화 초기화</ResetButton>
        <ChatLog>
          {messages.map((msg, i) => (
            <div key={i}>{msg}</div>
          ))}
          {loading && <div>🤖 생각 중...</div>}
        </ChatLog>
        <InputWrapper onSubmit={handleSubmit}>
          <Input placeholder="메시지를 입력하세요..." value={input} onChange={(e) => setInput(e.target.value)} />
          <Button type="submit">전송</Button>
        </InputWrapper>
      </Container>
    </>
  );
};

export default ChatBot;

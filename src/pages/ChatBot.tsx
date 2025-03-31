// src/pages/ChatBot.tsx
import React, { useState } from "react";
import styled from "styled-components";

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

const ChatBot = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [...prev, `👤 ${input}`, `🤖 답변: ${input}`]); // 임시 답변
    setInput("");
  };

  return (
    <>
      <Container>
        <ChatLog>
          {messages.map((msg, i) => (
            <div key={i}>{msg}</div>
          ))}
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

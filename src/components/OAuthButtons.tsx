// src/components/OAuthButtons.tsx
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SiNaver } from "react-icons/si";
import styled from "styled-components";

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 2rem;
`;

interface OAuthButtonsProps {
  onClick: (provider: "google" | "github" | "naver") => void;
}

const OAuthButtons = ({ onClick }: OAuthButtonsProps) => {
  const GoogleIcon = FcGoogle as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
  const GithubIcon = FaGithub as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
  const NaverIcon = SiNaver as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
  return (
    <ButtonContainer>
      <IconButton onClick={() => onClick("google")} aria-label="구글 로그인">
        {/* <FcGoogle /> */}
        <GoogleIcon />
      </IconButton>
      <IconButton onClick={() => onClick("github")} aria-label="깃허브 로그인">
        {/* <FaGithub color="black" /> */}
        <GithubIcon color="black" />
      </IconButton>
      <IconButton onClick={() => onClick("naver")} aria-label="네이버 로그인">
        {/* <SiNaver color="#2DB400" /> */}
        <NaverIcon color="#2DB400" />
      </IconButton>
    </ButtonContainer>
  );
};

export default OAuthButtons;

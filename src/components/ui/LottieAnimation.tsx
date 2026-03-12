import { useEffect, useState } from "react";
import Lottie from "lottie-react";

interface LottieAnimationProps {
  url: string;
  loop?: boolean;
  className?: string;
  onComplete?: () => void;
}

export const LottieAnimation = ({ url, loop = true, className, onComplete }: LottieAnimationProps) => {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Lottie JSON search error:", err));
  }, [url]);

  if (!animationData) return <div className={className} />;

  return (
    <div className={className}>
      <Lottie 
        animationData={animationData}
        loop={loop}
        onComplete={onComplete}
      />
    </div>
  );
};

export const SuccessCheckLottie = ({ className, onComplete }: { className?: string; onComplete?: () => void }) => (
  <LottieAnimation 
    url="https://assets9.lottiefiles.com/packages/lf20_pqnfmone.json" 
    loop={false} 
    className={className} 
    onComplete={onComplete}
  />
);

export const ConfettiLottie = ({ className, onComplete }: { className?: string; onComplete?: () => void }) => (
  <LottieAnimation 
    url="https://assets5.lottiefiles.com/packages/lf20_u4j3tAz6.json" 
    loop={false} 
    className={className} 
    onComplete={onComplete}
  />
);

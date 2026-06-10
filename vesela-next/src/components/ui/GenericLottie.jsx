import Lottie from "lottie-react";
import { useMemo } from "react";

const GenericLottie = ({
  animationData,
  width = 200,
  height,
  loop = false,
  autoplay = true,
}) => {
  const clonedData = useMemo(() => {
    if (!animationData) return null;
    try {
      return JSON.parse(JSON.stringify(animationData));
    } catch {
      return animationData;
    }
  }, [animationData]);

  if (!clonedData) return null;

  return (
    <div style={{ width, height }}>
      <Lottie animationData={clonedData} loop={loop} autoplay={autoplay} />
    </div>
  );
};

export default GenericLottie;

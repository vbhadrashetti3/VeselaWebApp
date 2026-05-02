import Lottie from "lottie-react";

const GenericLottie = ({
  animationData,
  width = 200,
  height,
  loop = false,
  autoplay = true,
}) => {
  return (
    <div style={{ width, height }}>
      <Lottie animationData={animationData} loop={loop} autoplay={autoplay} />
    </div>
  );
};

export default GenericLottie;

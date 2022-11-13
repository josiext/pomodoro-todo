const giveCronometerFormat = (sec: number) => {
  const minutes = Math.trunc(sec / 60);
  const seconds = sec % 60;

  return `${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;
};

export default giveCronometerFormat;

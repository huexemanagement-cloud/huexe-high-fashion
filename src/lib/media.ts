export function px(id: number, w = 1000, h = 1500) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;
}

export const SHOWREEL = [
  { video: "https://videos.pexels.com/video-files/3917526/3917526-uhd_4096_2160_25fps.mp4", poster: "https://images.pexels.com/videos/3917526/backstage-blonde-fashion-model-3917526.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900" },
  { video: "https://videos.pexels.com/video-files/7779055/7779055-uhd_4096_2160_25fps.mp4", poster: "https://images.pexels.com/videos/7779055/design-diversity-fashion-female-7779055.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900" },
  { video: "https://videos.pexels.com/video-files/7779784/7779784-uhd_4096_2160_25fps.mp4", poster: "https://images.pexels.com/videos/7779784/pexels-photo-7779784.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900" },
  { video: "https://videos.pexels.com/video-files/8089121/8089121-uhd_4096_2160_25fps.mp4", poster: "https://images.pexels.com/videos/8089121/actress-adult-alternative-band-8089121.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900" },
];

export const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxNSI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjE1IiBmaWxsPSIjMTYxNjE2Ii8+PC9zdmc+";

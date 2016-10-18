// @flow
import type { WebGazer, Adjuster } from 'types/webgazer';
import type { Rectangle } from 'types/math';

const symbolAdjuster = Symbol();

const load: (_:void) => Promise<WebGazer>
= () => new Promise(resolve => {
  if (window.webgazer) {
    resolve(window.webgazer);
  }
  const script = document.createElement('script');
  script.setAttribute('src', 'https://webgazer.cs.brown.edu/webgazer.js');
  script.addEventListener('load', () => resolve(window.webgazer));
  document.head.appendChild(script);
});

const ready: (_:WebGazer) => Promise<void>
= webgazer => new Promise(resolve => {
  const tid = setInterval(() => {
    if (webgazer.isReady()) {
      clearInterval(tid);
      resolve();
    }
  }, 100);
});

const start: (_:WebGazer) => Promise<void>
= async webgazer => {
  webgazer
    .setRegression('ridge')
    .setTracker('clmtrackr')
    .begin();
  await ready(webgazer);
};

const findVideoElement: (_:Document) => HTMLVideoElement
= document => (
  (document.querySelector('video#webgazerVideoFeed'): any): HTMLVideoElement
);

const initilizeVideo: (_:HTMLVideoElement) => (_:Rectangle) => HTMLVideoElement
= video => rect => {
  video.style.display = 'block';
  video.style.position = 'absolute';
  video.style.top = `${rect.top}px`;
  video.style.left = `${rect.left}px`;
  video.width = rect.width;
  video.height = rect.height;
  video.style.visibility = 'hidden';
  video.style.margin = '0px';
  return video;
};

const createOverlay: (_:Rectangle) => HTMLCanvasElement
= rect => {
  const overlay = document.createElement('canvas');
  overlay.style.position = 'absolute';
  overlay.width = rect.width;
  overlay.height = rect.height;
  overlay.style.top = `${rect.top}px`;
  overlay.style.left = `${rect.left}px`;
  overlay.style.margin = '0px';
  overlay.style.visibility = 'hidden';
  document.body.appendChild(overlay);
  return overlay;
};

const startAdjuster:
  (_:WebGazer) => (_:Rectangle) => (_:Adjuster) => Adjuster
= webgazer => rect => adjuster => {
  webgazer.params.imgWidth = rect.width;
  webgazer.params.imgHeight = rect.height;
  const clm = webgazer.getTracker().clm;
  (function drawLoop () {
    const overlay = adjuster.overlay;
    const graphic = overlay.getContext('2d');
    if (graphic) graphic.clearRect(0, 0, rect.width, rect.height);
    if (clm.getCurrentPosition()) clm.draw(overlay);
    requestAnimationFrame(drawLoop);
  })();
  return adjuster;
};

const getAdjuster: (_:WebGazer) => Adjuster
= webgazer => webgazer[symbolAdjuster];

export const startWebGazer: (_:void) => Promise<WebGazer>
= async () => {
  const width = 640;
  const height = 480;
  const rect = {
    top: window.innerHeight / 2 - height / 2,
    left: window.innerWidth / 2 - width / 2,
    width, height,
  };
  const webgazer = await load()
  await start(webgazer);
  const adjuster = {
    video: initilizeVideo(await findVideoElement(document))(rect),
    overlay: createOverlay(rect),
  };
  startAdjuster(webgazer)(rect)(adjuster);
  webgazer[symbolAdjuster] = adjuster;
  return webgazer;
};

export const showAdjuster: (_:WebGazer) => WebGazer
= webgazer => {
  webgazer.showPredictionPoints(true);
  const adjuster = getAdjuster(webgazer);
  adjuster.video.style.visibility =
  adjuster.overlay.style.visibility = 'visible';
  return webgazer;
};

export const hideAdjuster: (_:WebGazer) => WebGazer
= webgazer => {
  webgazer.showPredictionPoints(false);
  const adjuster = getAdjuster(webgazer);
  adjuster.video.style.visibility =
  adjuster.overlay.style.visibility = 'hidden';
  return webgazer;
};

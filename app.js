const video = document.getElementById('video');

// Import models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startCamera());

// Video stream
function startCamera() {
  navigator.getUserMedia(
    {
      video: {}
    },
    stream => (video.srcObject = stream),
    err => console.log(err)
  );
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const faceBox = {
    width: video.width,
    height: video.height
  };

  faceapi.matchDimensions(canvas, faceBox);

  setInterval(async() => {
    const faceDetections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    const resizeFace = faceapi.resizeResults(faceDetections, faceBox);
    faceapi.draw.drawDetections(canvas, resizeFace);
    faceapi.draw.drawFaceLandmarks(canvas, resizeFace);
    faceapi.draw.drawFaceExpressions(canvas, resizeFace);

  }, 100);
});
